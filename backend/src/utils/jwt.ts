import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type JwtRole = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "VENDOR";

export type AccessTokenClaims = {
  sub: string; // user id
  role: JwtRole;
  email?: string | null;
};

export function signAccessToken(claims: AccessTokenClaims) {
  return jwt.sign(claims, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn
  });
}

export function signRefreshToken(claims: AccessTokenClaims) {
  return jwt.sign(claims, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenClaims;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.jwt.refreshSecret) as AccessTokenClaims;
}

