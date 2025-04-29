"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface BookingCompletionProps {
    completedDetails: boolean,
    onClick: () => void,
}

const BookingCompletion = ({ completedDetails, onClick }: BookingCompletionProps) => {
    const [completedPrev, setCompletedPrev] = useState<boolean>(completedDetails);
    const [expanded, setExpanded] = useState<boolean>(true);
    const [accepted, setAccepted] = useState<boolean>(false);

    useEffect(() => {
        setCompletedPrev(completedDetails);
        setExpanded(!expanded);
    }, [completedDetails]);

    return (
        <div className={cn(expanded && "p-1", "flex flex-col border-1 max-w-[680px] border-[#b4b2b2] bg-white rounded-sm shadow")}>
            <button
                className='flex items-center justify-between p-4 w-full cursor-pointer border-b-1'
                onClick={() => {
                    if(completedPrev) {
                        setExpanded(!expanded)
                    }
                }}
            >
                <div className='flex items-center gap-6'>
                    <div className='bg-[#066a9233] border-1 border-[#066A92] rounded-full min-w-8 min-h-8 flex justify-center items-center text-[#066A92] text-[19px]'>2</div>
                    <p className='text-[24px] lato font-semibold'>Complete your booking</p>                    
                </div>

                {expanded ? (
                    <ChevronUp/>
                ) : (
                    <ChevronDown />
                )}
            </button>
            
            {expanded && (
                <div className='px-4 pt-4 space-y-3'>
                    <p className='text-[18px] lato font-semibold'>Terms and conditions</p>

                    <div className='flex items-center gap-3'>
                        <Checkbox className='rounded-none scale-110 border-black data-[state=checked]:bg-[#066A92] data-[state=checked]:border-[#066A92] data-[state=checked]:text-white' onClick={() => { setAccepted(true) }}/>
                        <label
                            htmlFor="terms"
                            className="text-sm text-[16px] flex gap-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I have read and agree to the<p className='text-[#066A92] cursor-pointer hover:text-[#3c5b6a]'> terms and conditions</p>
                        </label>                    
                    </div>

                    <Button 
                        className='bg-[#077dab] hover:bg-[#3c5c6a] scale-y-110 mt-4 mb-2 w-full text-[20px] rounded-sm' 
                        onClick={onClick}
                    >
                        Book
                    </Button>                
                </div>                
            )}
            
        </div>
    )
}

export default BookingCompletion;