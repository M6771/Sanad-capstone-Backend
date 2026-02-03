import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
