"use client";

import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { arrivalTime } from '@/constants/arrivalTime';
import { cn } from '@/lib/utils';

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4,6}$/;

const formSchema = z.object({
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

interface ClientDetailsProps {
    onClick: (values: ClientDetailsFormValues) => void
}

const ClientDetails = ({ onClick }: ClientDetailsProps) => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const form = useForm<ClientDetailsFormValues>({ 
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            confirmEmail: "",
            phone: "",
            arrivalTime: "", 
        },
    })
    function onSubmit(values: ClientDetailsFormValues) {
        setExpanded(false);
        onClick(values);
    }

    return (
        <div className={cn(expanded && "p-1", "flex flex-col border-1 max-w-[680px] border-[#b4b2b2] bg-white rounded-sm shadow")}>
            <button
                className='flex items-center justify-between p-4 w-full cursor-pointer border-b-1'
                onClick={() => setExpanded(!expanded)}
            >
                <div className='flex items-center gap-6'>
                    <div className='bg-[#066a9233] border-1 border-[#066A92] rounded-full min-w-8 min-h-8 flex justify-center items-center text-[#066A92] text-[19px]'>1</div>
                    <p className='text-[24px] lato font-semibold'>Your details</p>                    
                </div>

                {expanded ? (
                    <ChevronUp/>
                ) : (
                    <ChevronDown />
                )}
            </button>

            {expanded && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=""> 
                    <div className="flex flex-col md:flex-row gap-6 px-4 pt-4">
                         <div className="flex flex-col gap-6 w-full md:w-1/2">
                             <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="First name" className='rounded-sm min-h-12 border-[#b4b2b2] text-[18px]' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                                control={form.control}
                                name="email" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="email" placeholder='E-mail' className='rounded-sm min-h-12 border-[#b4b2b2] text-[18px]' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder='Phone number (optional)' className='rounded-sm min-h-12 border-[#b4b2b2] text-[18px]' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                         </div>
            
                         <div className="flex flex-col gap-6 w-full md:w-1/2">
                            <FormField
                                control={form.control}
                                name="lastName" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder='Last name' className='rounded-sm min-h-12 border-[#b4b2b2] text-[18px]' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <FormField
                                control={form.control}
                                name="confirmEmail" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="email" placeholder='Confirm e-mail' className='rounded-sm min-h-12 border-[#b4b2b2] text-[18px]' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                              <FormField
                                control={form.control}
                                name="arrivalTime"
                                render={({ field }) => (
                                    <FormItem>
                                         <p className='text-[15px]'>Help us ensure a warm welcome and smooth check-in at your arrival.</p>
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-sm w-full min-h-12 border-[#b4b2b2]">
                                                    <SelectValue placeholder="Planned arrival time?" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {arrivalTime.map((item, index) => (
                                                        <SelectItem key={index} value={item.time}>{item.time}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                         </div>
                    </div>
            
                    <div className='flex flex-col md:flex-row justify-between items-center pl-4 pr-4 md:pr-8 pt-6 md:pt-8 pb-5 gap-4'>
                        <div className='flex justify-start items-center gap-2 cursor-pointer'>
                            <PlusCircle className='text-[#066A92] scale-92'/>
                            <p className='text-[15px] text-[#066A92]'>Any personal requests?</p>
                        </div>
                        <Button
                            className='bg-[#077dab] hover:bg-[#3c5c6a] w-full md:w-auto px-8 min-h-8 text-lg rounded-sm' 
                            type="submit" 
                            disabled={form.formState.isSubmitting}
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
            )}
        </div>
    )
}

export default ClientDetails