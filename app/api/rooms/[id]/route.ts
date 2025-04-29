import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Room");

    try {
        const room = await prisma.room.findUnique({ where: { id } });

        if(!room) {
            throw new NotFoundError("Room");
        }

        return NextResponse.json(
            { success: true, data: room },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Room");

    try {
        const body = await request.json();

        const updatedRoom = await prisma.room.update({
            where: { id },
            data: body.data
        });

        if(!updatedRoom) {
            throw new NotFoundError("Room");
        }

        return NextResponse.json(
            { success: true, data: updatedRoom },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Room");

    try {
        const room = await prisma.room.delete({ where: { id } });

        if(!room) {
            throw new NotFoundError("Room");
        }

        return NextResponse.json( 
            { success: true, data: room },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}