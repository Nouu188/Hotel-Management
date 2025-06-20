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
    phone: z
      .string()
      .min(3, { message: "Phone number must be at least 3 characters long." })
      .max(12, { message: "Phone number cannot exceed 12 characters." })
      .regex(/^[0-9]+$/, {
        message: "Phone number can only contain numbers.",
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
  location: z.string().optional().or(z.literal('')),
  birthDay: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format." }
  ).optional(), 
  gender: z.string().optional(), 
  phoneNumber: z.string()
    .min(9, "Invalid phone number")
    .max(15, "Invalid phone number")
    .optional()
    .or(z.literal('')), 
});

export const UserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 letters").max(50),
  image: z.any().optional(),
  gender: z.string().optional(),
  birthDay: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
  }).optional(),
  
  phoneNumber: z.string()
    .min(9, "Invalid phone number")
    .max(15, "Invalid phone number")
    .optional()
    .or(z.literal('')), 
    
  location: z.string()
    .max(100, "Location too long")
    .optional()
    .or(z.literal('')), 
});

export const BookingRequestSchema = z.object({
  bookingGuest: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    planedArrivalTime: z.string(),
    personalRequest: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  bookingData: z.object({
    userId: z.string().uuid(),
    fromDate: z.string(),
    toDate: z.string(),
  }),
  usingServiceItems: z.array(z.object({
    serviceId: z.string().uuid(), // Nên dùng ID thay vì tên để đảm bảo chính xác
    quantity: z.number().min(1),
  })).optional(),
  bookingRoomItems: z.array(z.object({
    hotelBranchRoomTypeId: z.string().uuid(),
    quantityBooked: z.number().min(1),
  })).min(1, "Phải chọn ít nhất một phòng."),
});

export type BookingRequestBody = z.infer<typeof BookingRequestSchema>;

export const RoomSearchSchema = z.object({
  branchName: z.string().min(1),
  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  guestAllocations: z.array(z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
  })).min(1, "Phải có ít nhất một yêu cầu phòng."),
}).refine(data => new Date(data.dateRange.from) < new Date(data.dateRange.to), {
  message: "Ngày đến phải trước ngày đi.",
  path: ["dateRange"],
});