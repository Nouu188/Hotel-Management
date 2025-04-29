import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { AccountSchema } from "@/lib/validation";
import { ActionResponse, ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("User");

    try {
        const account = await prisma.account.findUnique({ where: { userId: id } });
        
        if(!account) {
            throw new NotFoundError("Account");
        }

        return NextResponse.json(
            { success: true, data: account },
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
    if (!id) throw new NotFoundError("User");

    try {
        const body = await request.json();
        const validatedData = AccountSchema.partial().safeParse(body);

        if(!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        };

        const updatedAccount = await prisma.account.update({
            where: { userId: id },
            data: validatedData.data,
        })

        return NextResponse.json(
            { success: true, data: updatedAccount },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}

export async function DELETE (
    _: Request , 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if(!id) {
        throw new NotFoundError("User");
    }

    try {
        const account = await prisma.account.delete({
            where: { userId: id }
        });

        return NextResponse.json(
            { success: true, data: account },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}

