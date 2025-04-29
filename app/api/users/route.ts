import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { UserSchema } from "@/lib/validation";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET (_: Request) {
    try {
        const users = await prisma.user.findMany();
        
        return NextResponse.json(
            { success: true, data: users },
            { status: 200 }
        )
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    } 
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = UserSchema.safeParse(body);

        if(!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        }

        const existingUser = await prisma.user.findUnique({ where: { id: validatedData.data.email }});
        if(existingUser) {
            throw new Error("User already exist!");
        }

        const newUser = await prisma.user.create({
            data: validatedData.data,
        });

        return NextResponse.json(
            { success: true, data: newUser },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}