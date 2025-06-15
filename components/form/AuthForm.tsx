"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z, ZodType } from "zod";
import {  DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";

import Link from 'next/link';
import { ActionResponse } from '@/types/global';

import ROUTES from '@/constants/route'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

interface AuthFormProps<T> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>,
  formType: "SIGN_IN" | "SIGN_UP",
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  formType
}: AuthFormProps<T>) => { 
  const router = useRouter();
  const { update } = useSession();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => { 
    const result = await onSubmit(data);

    if (result?.success) {
      toast({
        title: "Success",
        description:
          formType === "SIGN_IN"
            ? "Signed in successfully"
            : "Signed up successfully",
      });

      await update();
      router.push(ROUTES.HOME);
    } else {
      toast({
        title: `Error ${result?.status}`,
        description: result?.error?.message,
      });
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-md playfair">
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                    className="min-h-12 rounded-sm bg-white border-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className="paragraph-medium bg-[#081746] rounded-sm hover:bg-[#0f225e] playfair text-md min-h-12 w-full mt-2 px-4 py-3"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p className='playfair text-md'>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="text-[#0f225e] font-bold"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p className='playfair text-md'>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="text-[#0f225e] font-bold"
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  )
}

export default AuthForm