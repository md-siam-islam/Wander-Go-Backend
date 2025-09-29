
import z from "zod";

export const createDivisionZoodSchema = z.object({
    name : z.string({
        required_error : "Division name is required",
        invalid_type_error : "Division name must be a string"
    }).min(2 , {message : "Division name must be at least 2 characters"})
    .max(50, {message : "Division name must be at most 50 characters"}),

    slug : z.string({
        invalid_type_error : "Division slug must be a string"
    }).optional(),

    thumbnail : z.string({
        invalid_type_error : "Division thumbnail must be a string"
    }).optional(),

    description : z.string({
        invalid_type_error : "Division description must be a string"
    }).optional()
})
export const updateDivisionZoodSchema = z.object({
    name : z.string({
        required_error : "Division name is required",
        invalid_type_error : "Division name must be a string"
    }).min(2 , {message : "Division name must be at least 2 characters"})
    .max(50, {message : "Division name must be at most 50 characters"}).optional(),

    slug : z.string({
        invalid_type_error : "Division slug must be a string"
    }).optional(),

    thumbnail : z.string({
        invalid_type_error : "Division thumbnail must be a string"
    }).optional(),

    description : z.string({
        invalid_type_error : "Division description must be a string"
    }).optional()
})
