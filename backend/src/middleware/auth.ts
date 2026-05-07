import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export type AuthedRequest = Request & {
  user?: {
    id: number;
    role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "VENDOR";
    email?: string | null;
  };
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  try {
    const claims = verifyAccessToken(token);
    req.user = {
      id: Number(claims.sub),
      role: claims.role,
      email: claims.email ?? null
    };
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

