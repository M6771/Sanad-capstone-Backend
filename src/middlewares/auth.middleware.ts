import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "./apiError";
import User from "../models/User.model";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    [key: string]: any;
  };
  userId?: string;
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

    const userId = user._id.toString();
    const userObject = user.toObject();
    req.user = {
      ...userObject,
      _id: userId, // Ensure _id is string, not ObjectId
    };
    req.userId = userId;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized("Invalid token"));
    }
  }
};

// Alias for authenticate
export const requireAuth = authenticate;
