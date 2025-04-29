import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { AccountSchema } from "@/lib/validation";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST (request: Request) {
    const { providerAccountId } = await request.json();

    try {
        const account = await prisma.$transaction(async (tx) => {
            const validatedData = AccountSchema.partial().safeParse({ providerAccountId });

            if(!validatedData.success) {
                throw new ValidationError(validatedData.error.flatten().fieldErrors);
            }

            const account = await tx.account.findUnique({ where: { providerAccountId } });

            if(!account) {
                throw new NotFoundError("Account");
            }

            return account;
        });

        return NextResponse.json(
            { success: true, data: account},
            { status: 200 }
        )
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}