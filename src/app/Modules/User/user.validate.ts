import z, { object } from "zod";

 export const createUserZoodSchema = z.object({
                     name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email address" }),

  phone: z
    .string()
    .regex(/^(\+8801|8801|01)[3-9]\d{8}$/, {
    message: "Phone number must be a valid Bangladeshi number",
  })
    .optional(),

  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be less than 100 characters" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/,
    {
      message:
        "Password must include uppercase, lowercase, number, and one of these symbols: !, @, #, $, %",
    }
  )

    })

    
 export const updateUserZoodSchema = z.object({
name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }).optional(),

  phone: z
    .string()
    .optional(),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ).optional()

    
})