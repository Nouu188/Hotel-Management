import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

interface Props {
    hotelBranches: { name: string }[],
    onValueChange?: (value: string) => void,
    defaultValue?: string,
    className?: string,
}

const BranchPicker = ({
    hotelBranches,
    onValueChange,
    defaultValue,
    className
}: Props) => {
  return (
    <div>
        <Select onValueChange={onValueChange}>
          <SelectTrigger className={cn(className ? `${className}` : "rounded-none", "z-100 w-[340px] text-[17px] border-gray-200 bg-white")}>
            <SelectValue placeholder={`${defaultValue}` || "Select branch"} />
          </SelectTrigger>
          <SelectContent className='z-100'>
            <SelectGroup>
              {hotelBranches.map((item, index) => (
                <SelectItem key={index} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
    </div>
  )
}

export default BranchPicker