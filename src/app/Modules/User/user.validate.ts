import z from "zod";

//  export const createUserZoodSchema = z.object({
//                      name: z
//     .string({ invalid_type_error: "Name must be a string" })
//     .min(2, { message: "Name must be at least 2 characters" })
//     .max(50, { message: "Name must be at most 50 characters" }),

//   email: z
//     .string({ invalid_type_error: "Email must be a string" })
//     .email({ message: "Invalid email address" }),

//   phone: z
//     .string()
//     .regex(/^(\+8801|8801|01)[3-9]\d{8}$/, {
//     message: "Phone number must be a valid Bangladeshi number",
//   })
//     .optional(),

//   password: z
//   .string()
//   .min(8, { message: "Password must be at least 8 characters long" })
//   .max(100, { message: "Password must be less than 100 characters" })
//   .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/,
//     {
//       message:
//         "Password must include uppercase, lowercase, number, and one of these symbols: !, @, #, $, %",
//     }
//   )

//     })
import { IsActive, Role } from "./user.interface";

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
    ),

  role: z
    .enum([Role.USER, Role.ADMIN], {
      errorMap: () => ({ message: `Role must be one of: ${Role.USER}, ${Role.ADMIN}` }),
    })
    .optional(),

  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be a boolean value" })
    .optional(),

  isActive: z
    .enum([IsActive.ACTIVE, IsActive.INACTIVE], {
      errorMap: () => ({ message: `isActive must be either ACTIVE or INACTIVE` }),
    })
    .optional(),

  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be a boolean value" })
    .optional(),

  picture: z.string().optional(),
  address: z.string().optional(),

  auth: z
    .array(
      z.object({
        Provider: z.string(),
        ProviderId: z.string(),
      })
    )
    .optional(),
});


export const updateUserZoodSchema = z.object({
name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }).optional(),

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
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ).optional()

    
})