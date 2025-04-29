import handleError from "@/lib/handlers/error";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET (_: Request) {
    try {
        const rooms = await prisma.room.findMany();

        return NextResponse.json(
            { success: true, data: rooms },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}

export async function POST (request: Request) {
    try {
        const body = await request.json();

        const existingRoom = await prisma.room.findUnique({ where: { id: body.data.email }});
        if(existingRoom) {
            throw new Error("Room already exist!");
        }

        const newRoom = await prisma.room.create({
            data: body.data,
        });

        return NextResponse.json(
            { success: true, data: newRoom },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}