import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST (request: Request) {
    const { email } = await request.json();
    if(!email) {
        throw new NotFoundError("User");
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) {
            throw new NotFoundError("User")
        }

        return NextResponse.json(
            { success: true, data: user },
            { status: 200 }
        )
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}