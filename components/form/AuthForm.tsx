"use client";

import React from 'react';
import { signIn, useSession } from 'next-auth/react'; 
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z, ZodType } from "zod";
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from '@/types/global';
import ROUTES from '@/constants/route';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface AuthFormProps<T> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmitSignUp?: (data: T) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmitSignUp,
  formType
}: AuthFormProps<T>) => { 
  const router = useRouter();
  const { update } = useSession();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => { 
    setIsSubmitting(true);

    try {
      if (formType === "SIGN_IN") {
        const result = await signIn('credentials', {
          redirect: false, 
          email: data.email,
          password: data.password,
        });

        if (result?.ok) {
          toast({
            title: "Success",
            description: "Signed in successfully",
          });
          await update();
          router.push(ROUTES.HOME);
          router.refresh();
        } else {
          toast({
            title: "Sign In Failed",
            description: result?.error || "Invalid email or password.",
          });
        }
      } 
      else {
        if (onSubmitSignUp) {
          const result = await onSubmitSignUp(data);

          if (result?.success) {
            toast({
              title: "Success",
              description: result.message || "Signed up successfully. Please sign in.",
            });

            router.push(ROUTES.SIGN_IN);
          } else {
            toast({
              title: `Error ${result?.status || ''}`,
              description: result?.error?.message || "An unknown error occurred.",
            });
          }
        }
      }
    } catch (error) {
        toast({
            title: "An unexpected error occurred",
            description: "Please try again later.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-10 space-y-6">
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field: formField }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-md playfair">
                  {/* Logic render label giữ nguyên */}
                  {formField.name.charAt(0).toUpperCase() + formField.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={formField.name === "password" ? "password" : "text"}
                    {...formField}
                    className="min-h-12 rounded-sm bg-white border-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

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

        <Button
          type='submit'
          disabled={isSubmitting}
          className="paragraph-medium bg-[#081746] rounded-sm hover:bg-[#0f225e] playfair text-md min-h-12 w-full mt-2 px-4 py-3"
        >
          {isSubmitting
            ? (buttonText === "Sign In" ? "Signing In..." : "Signing Up...")
            : buttonText}
        </Button>
      </form>
    </Form>
  )
}

export default AuthForm;