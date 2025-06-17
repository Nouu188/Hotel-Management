"use server";

import { SignInSchema, SignUpSchema } from './../validation';
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import handleError from '../handlers/error';
import prisma from '../prisma';
import bcrypt from "bcryptjs";
import { signIn } from '@/auth';
import { NotFoundError } from '../http-errors';
import { toast } from '@/hooks/use-toast';
import { AuthCredentials } from '@/types/action';


export async function signUpWithCredentials(
    params: AuthCredentials 
): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: SignUpSchema });

    if(validationResult instanceof Error) {
        return handleError(validationResult, "api") as ActionResponse; 
    } 

    const { name, email, password, phone } = await validationResult.params!;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser)
            throw new Error("User already exist!");

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phoneNumber: phone
            }
        });

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.account.create({
            data: {
                userId: newUser.id,
                password: hashedPassword,
                provider: "credentials",
                providerAccountId: newUser.email
            }
        });

        await signIn("credentials", { email, password, phone, redirect: false })

        return { success: true }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function signInWithCredentials(
    params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: SignInSchema });

    const { email, password } = await params;

    if(validationResult instanceof Error) {
        return handleError(validationResult, "api") as ActionResponse; 
    } 

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(!existingUser) {
            throw new NotFoundError("User");
        }

        const existingAccount = await prisma.account.findUnique({
            where: { 
                userId: existingUser.id,
                provider: "credentials",
            }
        });

        if(!existingAccount) 
            throw new NotFoundError("Account");

        const passwordMatch = bcrypt.compare(password, existingAccount.password!);
        
        
        if(!passwordMatch) {
            throw new Error("Password does not match");
        }

        await signIn("credentials", { email, password, redirect: false})

        return { success: true }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}