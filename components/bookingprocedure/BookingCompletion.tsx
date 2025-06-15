"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface BookingCompletionProps {
    isOpen: boolean;
    onToggle: () => void;
    onSubmit: () => void;
    completedPrev: boolean;
}

const BookingCompletion = ({ isOpen, onToggle, onSubmit, completedPrev }: BookingCompletionProps) => {
    return (
        <div className={cn(isOpen && "p-1", "flex flex-col border-1 max-w-[680px] border-[#b4b2b2] bg-white rounded-sm shadow")}>
            <button
                className={cn(!completedPrev ? 'cursor-not-allowed' : 'cursor-pointer', 'flex items-center justify-between p-4 w-full border-b-1')}
                onClick={onToggle}
            >
                <div className='flex items-center gap-6'>
                    <div className='bg-[#066a9233] border-1 border-[#066A92] rounded-full min-w-8 min-h-8 flex justify-center items-center text-[#066A92] text-[19px]'>3</div>
                    <p className='text-[24px] lato font-semibold'>Complete your booking</p>                    
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
                <div className='overflow-hidden'></div>
                {isOpen && (
                    <div className='px-4 pt-4 space-y-3'>
                        <p className='text-[18px] lato font-semibold'>Terms and conditions</p>

                        <div className='flex items-center gap-3'>
                            <Checkbox className='rounded-none scale-110 border-black data-[state=checked]:bg-[#066A92] data-[state=checked]:border-[#066A92] data-[state=checked]:text-white' />
                            <label
                                htmlFor="terms"
                                className="text-sm text-[16px] flex gap-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I have read and agree to the<p className='text-[#066A92] cursor-pointer hover:text-[#3c5b6a]'> terms and conditions</p>
                            </label>                    
                        </div>

                        <Button 
                            className='bg-[#077dab] hover:bg-[#3c5c6a] scale-y-110 mt-4 mb-2 w-full text-[20px] rounded-sm' 
                            onClick={onSubmit}
                        >
                            Book
                        </Button>                
                    </div>                
                )}
            </div>
        </div>
    )
}

export default BookingCompletion;