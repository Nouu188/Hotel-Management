import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { AccountSchema } from "@/lib/validation";
import { ApiErrorResponse } from "@/types/global";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST (request: Request) {
    const { providerAccountId } = await request.json();

    try {
        const account_user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const validatedData = AccountSchema.partial().safeParse({ providerAccountId });

            if(!validatedData.success) {
                throw new ValidationError(validatedData.error.flatten().fieldErrors);
            }

            const account = await tx.account.findUnique({ where: { providerAccountId } });
            if(!account) {
                throw new NotFoundError("Account");
            }
            
            const user = await tx.user.findUnique({ where: { id: account?.userId }});
            if(!account) {
                throw new NotFoundError("User");
            }

            return account;
        });

        return NextResponse.json(
            { success: true, data: account_user},
            { status: 200 }
        )
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}