// components/ui/FormInputField.tsx (hoặc một đường dẫn phù hợp)

import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormInputFieldProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
}

export const FormInputField = ({ control, name, placeholder, ...props }: FormInputFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              placeholder={placeholder}
              className='rounded-sm min-h-12 border-[#b4b2b2] text-[18px]'
              {...props} 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface Option {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  options: Option[];
  description?: string;
}

export const FormSelectField = ({ control, name, placeholder, options, description }: FormSelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {description && <p className='text-[13px]'>{description}</p>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="rounded-sm w-full min-h-12 border-[#b4b2b2]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent side='bottom' className="max-h-[250px] overflow-y-auto">
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};