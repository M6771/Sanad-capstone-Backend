import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "./apiError";
import User from "../models/User.model";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    [key: string]: any;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    req.user = {
      _id: user._id.toString(),
      ...user.toObject(),
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized("Invalid token"));
    }
  }
};
