import type { NextFunction, Response } from "express";
import type { AuthedRequest } from "./auth.js";
import type { JwtRole } from "../utils/jwt.js";

export function requireRole(roles: JwtRole[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ error: "UNAUTHORIZED" });
    if (!roles.includes(role)) return res.status(403).json({ error: "FORBIDDEN" });
    return next();
  };
}

