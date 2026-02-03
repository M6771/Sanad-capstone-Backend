import { z } from "zod";

export const createChildSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Name is required")
            .max(100, "Name must be less than 100 characters")
            .trim(),
        dateOfBirth: z
            .union([z.string(), z.date()])
            .optional()
            .refine(
                (val) => {
                    if (!val) return true;
                    const date = val instanceof Date ? val : new Date(val);
                    return !isNaN(date.getTime());
                },
                { message: "Invalid date format" }
            ),
        gender: z.string().trim().optional(),
        medicalHistory: z.string().max(500, "Medical history must be less than 500 characters").trim().optional(),
        notes: z.string().max(1000, "Notes must be less than 1000 characters").trim().optional(),
    }),
});

export const updateChildSchema = z.object({
    body: z
        .object({
            name: z
                .string()
                .min(1, "Name cannot be empty")
                .max(100, "Name must be less than 100 characters")
                .trim()
                .optional(),
            dateOfBirth: z
                .union([z.string(), z.date()])
                .optional()
                .refine(
                    (val) => {
                        if (!val) return true;
                        const date = val instanceof Date ? val : new Date(val);
                        return !isNaN(date.getTime());
                    },
                    { message: "Invalid date format" }
                ),
            gender: z.string().trim().optional(),
            medicalHistory: z
                .string()
                .max(500, "Medical history must be less than 500 characters")
                .trim()
                .optional(),
            notes: z.string().max(1000, "Notes must be less than 1000 characters").trim().optional(),
        })
        .strict(),
});

export const childIdParamSchema = z.object({
    params: z.object({
        childId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid child ID format"),
    }),
});

/**
 * Type inference from Zod schemas
 */
export type CreateChildBody = z.infer<typeof createChildSchema>["body"];
export type UpdateChildBody = z.infer<typeof updateChildSchema>["body"];

