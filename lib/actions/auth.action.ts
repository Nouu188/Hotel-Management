// lib/actions/auth.ts

"use server";

import { SignUpSchema } from '../validation';
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import handleError from '../handlers/error';
import prisma from '../prisma';
import bcrypt from "bcryptjs";

export async function signUpWithCredentials(
    params: any 
): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: SignUpSchema });

    if(validationResult instanceof Error) {
        return handleError(validationResult, "api") as ActionResponse; 
    } 

    const { name, email, password, phone } = validationResult.params!;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            throw new Error("User with this email already exists!");
        }
            
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber: phone
            }
        });

        await prisma.account.create({
            data: {
                userId: newUser.id,
                provider: "credentials",
                providerAccountId: newUser.email,
            }
        })

        return { success: true, message: "Sign up successful! Please sign in." };

    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
