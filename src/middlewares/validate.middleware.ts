import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ApiError } from "./apiError";

/**
 * Generic validation middleware for Zod schemas
 * Usage: validate(schema)(req, res, next)
 */
export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map((e) => {
                    const path = e.path.join(".");
                    return `${path}: ${e.message}`;
                });
                next(ApiError.badRequest(errors.join(", ")));
            } else {
                next(ApiError.badRequest("Validation failed"));
            }
        }
    };
};
