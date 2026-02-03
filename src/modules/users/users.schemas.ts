import { z } from "zod";
import { ApiError } from "../../utils/apiError";

/**
 * Schema for updating user profile (PATCH /me)
 */
export const updateMeSchema = z.object({
    body: z
        .object({
            name: z
                .string()
                .min(2, "Name must be at least 2 characters")
                .max(100, "Name must be less than 100 characters")
                .trim()
                .optional(),
            phone: z
                .number({
                    required_error: "Phone must be a number",
                    invalid_type_error: "Phone must be a number",
                })
                .positive("Phone must be a positive number")
                .optional(),
            address: z
                .string()
                .min(1, "Address cannot be empty")
                .max(200, "Address must be less than 200 characters")
                .trim()
                .optional(),
        })
        .strict()
        .refine((data) => !("email" in data), {
            message: "Email cannot be changed through this endpoint",
            path: ["email"],
        }),
});

/**
 * Type inference from Zod schema
 */
export type UpdateMeBody = z.infer<typeof updateMeSchema>["body"];

/**
 * Validates update user profile request body
 * Throws ApiError if validation fails
 */
export const validateUpdateMe = (data: unknown): UpdateMeBody => {
    try {
        // Validate that email is not present
        if (data && typeof data === "object" && "email" in data) {
            throw new ApiError(400, "EMAIL_CHANGE_NOT_ALLOWED", "Email cannot be changed through this endpoint");
        }

        // Validate using Zod schema
        const result = updateMeSchema.parse({ body: data });
        return result.body;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
            throw new ApiError(400, "VALIDATION_ERROR", errors.join(", "));
        }
        // Re-throw ApiError if it's already an ApiError
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request data");
    }
};
