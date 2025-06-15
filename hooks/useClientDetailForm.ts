"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4,6}$/;

const formSchema = z
    .object({
        firstName: z.string().min(1, { message: "First name is required." }),
        lastName: z.string().min(1, { message: "Last name is required." }),
        email: z.string().email({ message: "Invalid email address." }),
        confirmEmail: z.string().email({ message: "Invalid confirmation email." }),
        phone: z.string()
            .optional() 
            .or(z.literal("")) 
            .or(z.string().regex(phoneRegex, { message: "Invalid phone number format." })), 
        arrivalTime: z.string().min(1, { message: "Please select an arrival time." }),
        personalRequest: z.string().optional(),
    })
    .refine(data => data.email === data.confirmEmail, {
        message: "Email addresses do not match.",
        path: ["confirmEmail"],
    });

export type ClientDetailsFormValues = z.infer<typeof formSchema>;

export const useClientDetailsForm = () => {
    const form = useForm<ClientDetailsFormValues>({ 
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            confirmEmail: "",
            phone: "",
            arrivalTime: "",
            personalRequest: "",
        },
    });

    return { form, formSchema }; 
};
