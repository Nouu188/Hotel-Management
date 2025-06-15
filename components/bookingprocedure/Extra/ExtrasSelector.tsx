"use client";

import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useMemo } from 'react'
import { hotelExtras } from '@/constants/extraService';
import Image from 'next/image';
import { Checkbox } from '../../ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '../../ui/button';
import AddAndRemoveExtra from './AddAndRemoveExtra';
import { addExtra, removeExtra, selectExtra, unSelectExtra } from '@/store/slices/extrasSlice';

interface ExtrasSelectorProps {
    isOpen: boolean;
    onToggle: () => void;
    onComplete: () => void;
    completedPrev: boolean;
}

export function calculateExtraPrice (price: string, quantity: number): number {
    const numericPrice = parseInt(price.replace(/,/g, ''), 10) || 0;
    return numericPrice * quantity;
}

export function formatNumberWithCommas(num: number, locale: string = 'en-US'): string {
  if (isNaN(num)) {
    return 'Invalid Number';
  }

  return num.toLocaleString(locale);
}

const ExtrasSelector = ({ isOpen, onToggle, onComplete, completedPrev }: ExtrasSelectorProps) => {
    const dispatch: AppDispatch = useDispatch();
    const guestAllocation = useSelector((state: RootState) => state.filterHotelRoomType.guestAllocation);
    const selectedExtras = useSelector((state: RootState) => state.selectedExtras.selections);

    const totalOfGuest = guestAllocation.reduce(
        (sum, item) => sum + item.adults + item.children + item.infants,
        0
    ) ?? 0;

    const totalOfExtraSelectionPrice: number = useMemo(() => {
        return selectedExtras.reduce(
            (sum, item) => {
                if (item.selection && item.priceFinal) {
                    return sum + item.priceFinal;
                }
                return sum;
            },
            0
        );
    }, [selectedExtras]);

    const totalOfGuestArray = Array.from({ length: totalOfGuest }, (_, index) => 1 + index);

    const handleCheckboxChange = (extraId: string, checked: boolean) => {
        if (checked) {
            dispatch(selectExtra({ extraId, quantityTmp: 1 }));
        } else {
            dispatch(unSelectExtra({ extraId }));
        }
    }

    const handleSelectChange = (extraId: string, quantityTmp: number) => {
        if(quantityTmp === 0) {
            dispatch(unSelectExtra({ extraId }));
        } else {
            dispatch(selectExtra({ extraId, quantityTmp }))
        }
    };

    const handleAddExtraItem = (extraId: string) => {
        dispatch(addExtra({ extraId }));
    };

    const handleRemoveExtraItem = (extraId: string) => {
        dispatch(removeExtra({ extraId }));
        dispatch(unSelectExtra({ extraId }));
    }

    return (
        <div className={cn("flex flex-col border-1 max-w-[620px] border-[#b4b2b2] bg-white rounded-sm shadow")}>
            <button
                className={cn(!completedPrev ? 'cursor-not-allowed' : 'cursor-pointer', 'flex items-center justify-between p-4 w-full border-b-1')}
                onClick={onToggle}
            >
                <div className='flex items-center gap-6'>
                    <div className='bg-[#066a9233] border-1 border-[#066A92] rounded-full min-w-8 min-h-8 flex justify-center items-center text-[#066A92] text-[19px]'>2</div>
                    <p className='text-[24px] lato font-semibold'>Extras</p>                    
                </div>

                <div className='flex items-center gap-4'>
                    <div onClick={onComplete}
                    className={cn(!completedPrev && 'opacity-70 cursor-not-allowed', 'py-2 px-8 border-1 hover:bg-[#066A92] hover:text-white text-[#066A92] border-[#066A92] rounded-[2px]')}>
                        Skip
                    </div>

                    {isOpen ? (
                        <ChevronUp />
                    ) : (
                        <ChevronDown />
                    )}
                </div>
            </button>
            <div                                 
                className={cn(
                    "grid transition-[grid-template-rows] duration-400 ease-in-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className='overflow-hidden'></div>
                {isOpen && (
                    <div className='flex-col'>
                        {hotelExtras.map((item, index) => {
                            const existingExtra = selectedExtras.find(extra => extra.id  === item.id);
                            const isSelected = existingExtra?.selection;
                            const isAdded: boolean | undefined = existingExtra?.isAdded;
                            const quantityTmp = existingExtra?.quantityTmp;

                            let price: number = 0;
                            if(quantityTmp) {
                                price = calculateExtraPrice(item.price, quantityTmp);
                            }

                            return (
                                <div key={index} className=' mt-4'>
                                    <div className='flex raleway mx-3 gap-3'>
                                        <div className='w-[274px] h-[134px]'>
                                            <Image src={item.imgUrl} width={234} height={184} className='object-cover rounded-[5px]' alt={item.name}/>
                                        </div>
                                        <div className='w-full flex flex-col justify-between'>
                                            <div>
                                                <h1 className='font-semibold text-[18px]'>{item.name}</h1>
                                                <p className='mb-4'>{item.description}</p>
                                                <div className='flex gap-1'>
                                                    <p className='font-semibold text-[18px]'>+VND {item.price}</p>
                                                    <p>{item.priceType}</p>
                                                </div>
                                            </div>
                                            {item.isNumb ? (
                                                <div className='flex justify-end pb-5'>
                                                    <Select
                                                        onValueChange={(value) => handleSelectChange(item.id, parseInt(value))}
                                                    >
                                                        <SelectTrigger className='rounded-[2px] border-[#cecbcb]'>
                                                            <SelectValue placeholder="--"/>
                                                        </SelectTrigger>
                                                        <SelectContent className='rounded-[2px]'>
                                                            <SelectGroup>
                                                                <SelectItem className='bg-[#066A92] data-[highlighted]:bg-[#066a924d] rounded-[2px]' value='--'>--</SelectItem>
                                                                {totalOfGuestArray.map((item) => (
                                                                    <SelectItem className='data-[highlighted]:bg-[#066a924d] rounded-[2px]' key={item} value={item.toString()}>{item}</SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ) : (
                                                <div className='text-end pb-5'>
                                                    <Checkbox
                                                        id={`extra-checkbox-${item.id || index}`}
                                                        checked={!!isSelected} 
                                                        onCheckedChange={(checked) => {
                                                            handleCheckboxChange( item.id, checked as boolean);
                                                        }}
                                                        disabled={!completedPrev}
                                                        className='border-2 rounded-[3px] scale-110 border-black data-[state=checked]:bg-[#066A92]'
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cn(!isSelected && 'py-4 transition-all duration-300 ease-in-out overflow-hidden bg-[#F6F6F6]')}>
                                        <div className={cn(
                                            'transition-all duration-500 ease-in-out overflow-hidden',
                                            isSelected ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                        )}>
                                            <div className='py-3 border-t border-b bg-[#F6F6F6] flex justify-between items-center px-3'>
                                                <div className="font-semibold text-gray-800">
                                                    Total for this extra:
                                                    <span className="text-lg text-black ml-2">
                                                        VND {formatNumberWithCommas(price)}
                                                    </span>
                                                </div>
                                                <AddAndRemoveExtra 
                                                    onAdd={() => handleAddExtraItem(item.id)}    
                                                    onRemove={() => handleRemoveExtraItem(item.id)}  
                                                    isAdded={isAdded as boolean} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )})}
                        <div className='text-end mx-3 py-4 space-y-2'>
                            <div className='flex justify-end gap-2'>
                                <p>Extras total: </p>
                                <p className='font-semibold text-[18px]'>VND {formatNumberWithCommas(totalOfExtraSelectionPrice)}</p>
                            </div>
                            <div className='relative h-11'>
                                <button 
                                    onClick={onComplete} 
                                    className={cn('py-2 mr-4 px-8 min-h-10 cursor-pointer hover:border-1 text-[#066A92] hover:border-[#066A92] rounded-sm')}
                                >
                                    Skip
                                </button>     
                                <Button
                                    className='bg-[#077dab] hover:bg-[#3c5c6a] cursor-pointer w-full md:w-auto px-6 py-4 min-h-10 text-lg rounded-sm' 
                                    type="submit"
                                    onClick={onComplete}
                                >
                                    Continue
                                </Button>                              
                            </div>
                        </div>        
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExtrasSelector