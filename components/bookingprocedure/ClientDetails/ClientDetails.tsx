"use client";

import { ChevronDown, ChevronUp, MinusCircle, PlusCircle } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { arrivalTime } from '@/constants/arrivalTime';
import { cn } from '@/lib/utils';
import { Textarea } from '../../ui/textarea';
import { FormInputField, FormSelectField } from '@/components/FormFieldInput';
import { ClientDetailsFormValues, useClientDetailsForm } from '@/hooks/useClientDetailForm';

const inputFields = [
    { name: 'firstName', placeholder: 'First name' },
    { name: 'lastName', placeholder: 'Last name' },
    { name: 'email', placeholder: 'E-mail', type: 'email' },
    { name: 'confirmEmail', placeholder: 'Confirm e-mail', type: 'email' },
    { name: 'phone', placeholder: 'Phone number (optional)' }
];

const arrivalTimeOptions = arrivalTime.map(item => ({ value: item.time, label: item.time }));

interface ClientDetailsProps {
    isOpen: boolean;
    onToggle: () => void;
    onComplete: (values: ClientDetailsFormValues) => void;
}

const ClientDetails = ({ isOpen, onToggle, onComplete }: ClientDetailsProps) => {
    const [openTextArea, setOpenTextArea] = useState<boolean>(true);

    const { form } = useClientDetailsForm();

    function onSubmit(values: ClientDetailsFormValues) {
        onComplete(values);
    }

    const handleOpenTextArea = () => {
        setOpenTextArea(!openTextArea);
    }

    return (
        <div className={cn(isOpen && "p-1", "flex flex-col border-1 max-w-[620px] border-[#b4b2b2] bg-white rounded-sm shadow")}>
            <button
                className='flex items-center justify-between p-4 w-full cursor-pointer border-b-1'
                onClick={onToggle}
            >
                <div className='flex items-center gap-6'>
                    <div className='bg-[#066a9233] border-1 border-[#066A92] rounded-full min-w-8 min-h-8 flex justify-center items-center text-[#066A92] text-[19px]'>1</div>
                    <p className='text-[24px] lato font-semibold'>Your details</p>                    
                </div>

                {isOpen ? (
                    <ChevronUp/>
                ) : (
                    <ChevronDown />
                )}
            </button>

            <div                                 
                className={cn(
                    "grid transition-[grid-template-rows] duration-400 ease-in-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className='overflow-hidden'>
                    {isOpen && (
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}> 
                            <div className="flex flex-col md:flex-row gap-6 px-4 pt-4">
                                <div className="grid grid-cols-2 w-full gap-6">
                                    {inputFields.map((field) => (
                                        <FormInputField
                                            key={field.name}
                                            control={form.control}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                        />
                                    ))}
                                    <FormSelectField
                                        control={form.control}
                                        name="arrivalTime"
                                        placeholder="Planned arrival time?"
                                        options={arrivalTimeOptions}
                                        description="Help us ensure a warm welcome and smooth check-in at your arrival."
                                    />
                                </div>
                            </div>
                            <div className='px-4'>
                                <div>
                                    <button 
                                        type="button"
                                        onClick={handleOpenTextArea}
                                        className='flex justify-start items-center gap-2 cursor-pointer text-[#066A92] hover:opacity-80 transition-opacity w-full text-left py-2'
                                    >
                                        {openTextArea ? <MinusCircle className='scale-92'/> : <PlusCircle className='scale-92'/>}
                                        <p className='text-[14px]'>Any personal requests?</p>
                                    </button>
                                    
                                    <div
                                        className={cn(
                                            "transition-all duration-300 ease-in-out overflow-hidden",
                                            openTextArea ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <Textarea 
                                            className={cn(
                                                'rounded-sm w-full',
                                                'min-h-[120px]' 
                                            )}
                                            placeholder="Type your request here..."
                                        />
                                    </div>
                                </div>
                                <div className={cn(openTextArea && "pt-4 md:pt-6", 'text-right pb-4')}>
                                    <Button
                                        className='bg-[#077dab] hover:bg-[#3c5c6a] w-full md:w-auto px-6 py-4 min-h-10 text-lg rounded-sm' 
                                        type="submit" 
                                        disabled={form.formState.isSubmitting}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClientDetails;