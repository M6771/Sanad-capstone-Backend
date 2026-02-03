import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export function validate(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            return next(
                new ApiError(400, "VALIDATION_ERROR", "Invalid request", result.error.flatten())
            );
        }

        // attach parsed if you want later; MVP: not needed
        next();
    };
}
