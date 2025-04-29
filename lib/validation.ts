import { z } from "zod";

export const SignInSchema = z.object({
    email: z    
        .string()
        .min(1, { message: "Email is required."})
        .email({ message: "Please provide a valid email address."}),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long."})
        .max(100, { message: "Password cannot exceed 100 characters."})
});

export const SignUpSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please provide a valid email address." }),
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(30, { message: "Name cannot exceed 40 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Name can only contain letters",
        }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        }),
});

export const SignInWithOAuthSchema = z.object({
    provider: z.enum(["google"]),
    providerAccountId: z
      .string()
      .min(1, { message: "Provider Account ID is required." }),
    user: z.object({
      name: z.string().min(1, { message: "Provider Account ID is required." }),
      username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters." }),
      email: z
        .string()
        .email({ message: "Please provide a valid email address."}),
      image: z.string().url("Invalid image URL").optional(),
    })
});

export const AccountSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required." }),
    name: z.string().min(1, { message: "Name is required." }),
    image: z.string().url({ message: "Please provide a valid URL." }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      })
      .optional(),
    provider: z.string().min(1, { message: "Provider is required." }),
    providerAccountId: z
      .string()
      .min(1, { message: "Provider Account ID is required." }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  location: z.string().optional(),
});

export const RoomSchema = z.object({
  
})