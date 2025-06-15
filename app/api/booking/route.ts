import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const bookingRoomItem = await prisma.bookingRoomItem.findUnique({
      where: { id },
    });

    if (!bookingRoomItem) {
      return NextResponse.json(
        { success: false, message: `BookingRoomItem with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: bookingRoomItem },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    return handleError(error, "api") as ApiErrorResponse;
  }
}

interface BookingRoomItemClientData {
  hotelBranchRoomTypeId: string;
  quantityBooked: number;
}

interface BookingRequestBody {
  bookingGuest: Omit<Prisma.BookingGuestCreateInput, 'bookingId' | 'booking'>;
  bookingData: {
    userId: string;
    fromDate: string;
    toDate: string;
  };
  usingServiceItems?: {
    serviceName: string;
    quantity: number;
  }[];
  bookingRoomItems: BookingRoomItemClientData[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingRequestBody;
    const { bookingGuest, bookingData, usingServiceItems, bookingRoomItems: clientBookingRoomItems } = body;

    // Validate input
    if (
      !bookingData ||
      !bookingData.userId ||
      !clientBookingRoomItems ||
      !Array.isArray(clientBookingRoomItems) ||
      clientBookingRoomItems.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: 'bookingData' (with userId), and a non-empty 'bookingRoomItems' array are required.",
        },
        { status: 400 }
      );
    }

    // Validate usingServiceItems
    if (usingServiceItems && !Array.isArray(usingServiceItems)) {
      return NextResponse.json(
        { success: false, message: "Invalid input: 'usingServiceItems' must be an array if provided." },
        { status: 400 }
      );
    }

    let fromDateTime: Date;
    let toDateTime: Date;
    try {
      fromDateTime = new Date(bookingData.fromDate);
      toDateTime = new Date(bookingData.toDate);
      if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime()) || fromDateTime >= toDateTime) {
        throw new Error("Invalid date format or range provided.");
      }
    } catch (dateError) {
      console.error("Date parsing error:", dateError);
      return NextResponse.json(
        { success: false, message: "Invalid date format for fromDate or toDate." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId: bookingData.userId,
          fromDate: fromDateTime,
          toDate: toDateTime,
        },
      });

      const bookingRoomItemsData = clientBookingRoomItems.map((item) => {
        if (!item.hotelBranchRoomTypeId || typeof item.quantityBooked !== 'number' || item.quantityBooked <= 0) {
          throw new Error(
            `Invalid data for booking room item: hotelBranchRoomTypeId or quantityBooked is missing/invalid for item ${JSON.stringify(item)}`
          );
        }
        return {
          hotelBranchRoomTypeId: item.hotelBranchRoomTypeId,
          quantityBooked: item.quantityBooked,
          bookingId: newBooking.id,
        };
      });

      if (bookingRoomItemsData.length === 0) {
        throw new Error("No valid room items to create after processing client data.");
      }

      //Create new Booking
      const newBookingRoomItems = await tx.bookingRoomItem.createMany({
        data: bookingRoomItemsData,
        skipDuplicates: true,
      });

      //Create new BookingGuest
      const newBookingGuest = await tx.bookingGuest.create({
        data: {
          ...bookingGuest,
          bookingId: newBooking.id,
        },
      });

      //Create new UsingService
      let usingServiceData: any[] = [];
      if (usingServiceItems && usingServiceItems.length > 0) {
        // Fetch all services to map serviceName to serviceId
        const serviceNames = usingServiceItems.map((item) => item.serviceName);
        const services = await tx.service.findMany({
          where: { name: { in: serviceNames } },
          select: { id: true, name: true },
        });

        const serviceMap = new Map(services.map((s) => [s.name, s.id]));
        const invalidServiceNames = serviceNames.filter((name) => !serviceMap.has(name));

        if (invalidServiceNames.length > 0) {
          throw new Error(`Invalid service names: ${invalidServiceNames.join(', ')}`);
        }

        usingServiceData = usingServiceItems.map((item) => {
          if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            throw new Error(`Invalid quantity for service ${item.serviceName}`);
          }

          return {
            serviceId: serviceMap.get(item.serviceName)!,
            bookingId: newBooking.id,
            quantity: item.quantity,
          };
        });
      }

      const newUsingService = await tx.usingService.createMany({
        data: usingServiceData,
        skipDuplicates: true,
      });

      return {
        newBooking,
        newBookingRoomItems,
        newUsingService,
        newBookingGuest,
      };
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("!!! API ERROR CAUGHT (POST /booking):", error);

    let errorMessage = "An unexpected error occurred during booking creation.";
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON format in request body.";
      statusCode = 400;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${error.code}.`;
      if (error.code === 'P2002') {
        errorMessage = `Data conflict: A booking with similar details might already exist (Unique constraint failed on ${error.meta?.target}).`;
        statusCode = 409;
      } else if (error.code === 'P2003') {
        errorMessage = `Invalid reference: A related record (e.g., user, room type, service) was not found (Foreign key constraint failed on ${error.meta?.field_name}).`;
        statusCode = 400;
      } else if (error.code === 'P2025') {
        errorMessage = `Operation failed: A required record was not found. ${error.meta?.cause || ''}`;
        statusCode = 404;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      if (
        errorMessage.startsWith("Invalid data for booking room item") ||
        errorMessage.startsWith("No valid room items to create") ||
        errorMessage.startsWith("Invalid service names") ||
        errorMessage.startsWith("Invalid quantity")
      ) {
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { success: false, message: errorMessage, code: (error as any).code, meta: (error as any).meta },
      { status: statusCode }
    );
  }
}