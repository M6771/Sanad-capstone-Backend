import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = { sub: string };

export function signAccessToken(userId: string): string {
  const payload: JwtPayload = { sub: userId };
  const expiresIn: string = env.JWT_EXPIRES_IN;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
