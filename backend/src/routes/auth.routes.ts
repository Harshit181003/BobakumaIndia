import { Router } from "express";
import passport from "passport";
import { z } from "zod";
import { config } from "../config.js";
import { verifyPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, type JwtRole } from "../utils/jwt.js";
import {
  createUserEmailPassword,
  findUserByEmail,
  createOrLinkGoogleUser,
  findUserById
} from "../services/users.service.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
  name: z.string().trim().min(1).max(120).optional()
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) return res.status(409).json({ error: "EMAIL_IN_USE" });

  const user = await createUserEmailPassword(parsed.data);
  if (!user) return res.status(500).json({ error: "FAILED_TO_CREATE_USER" });

  const accessToken = signAccessToken({ sub: String(user.id), role: user.role as JwtRole, email: user.email });
  const refreshToken = signRefreshToken({ sub: String(user.id), role: user.role as JwtRole, email: user.email });

  return res.json({
    user: { id: user.id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatar_url },
    tokens: { accessToken, refreshToken }
  });
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const user = await findUserByEmail(parsed.data.email);
  if (!user || !user.password_hash) return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  if (!user.is_active) return res.status(403).json({ error: "ACCOUNT_DISABLED" });

  const ok = await verifyPassword(parsed.data.password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const accessToken = signAccessToken({ sub: String(user.id), role: user.role as JwtRole, email: user.email });
  const refreshToken = signRefreshToken({ sub: String(user.id), role: user.role as JwtRole, email: user.email });

  return res.json({
    user: { id: user.id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatar_url },
    tokens: { accessToken, refreshToken }
  });
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

authRouter.post("/refresh", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  try {
    const claims = verifyRefreshToken(parsed.data.refreshToken);
    const user = await findUserById(Number(claims.sub));
    if (!user || !user.is_active) return res.status(401).json({ error: "UNAUTHORIZED" });
    const accessToken = signAccessToken({
      sub: String(user.id),
      role: user.role as JwtRole,
      email: user.email
    });
    const refreshToken = signRefreshToken({
      sub: String(user.id),
      role: user.role as JwtRole,
      email: user.email
    });
    return res.json({ tokens: { accessToken, refreshToken } });
  } catch {
    return res.status(401).json({ error: "INVALID_REFRESH_TOKEN" });
  }
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await findUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json({
    user: { id: user.id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatar_url }
  });
});

authRouter.get("/google", (req, res, next) => {
  if (!config.google.clientId) return res.status(501).json({ error: "GOOGLE_AUTH_NOT_CONFIGURED" });
  return passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${config.appPublicUrl}/login?error=google` }),
  async (req, res) => {
    const profile = req.user as unknown as {
      id: string;
      displayName?: string;
      photos?: Array<{ value: string }>;
      emails?: Array<{ value: string }>;
    };

    const email = profile.emails?.[0]?.value ?? null;
    const user = await createOrLinkGoogleUser({
      googleId: profile.id,
      email,
      name: profile.displayName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null
    });

    if (!user) return res.redirect(`${config.appPublicUrl}/login?error=google_user`);

    const accessToken = signAccessToken({ sub: String(user.id), role: user.role as JwtRole, email: user.email });
    const refreshToken = signRefreshToken({ sub: String(user.id), role: user.role as JwtRole, email: user.email });

    const redirectUrl = new URL("/auth/callback", config.appPublicUrl);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    return res.redirect(redirectUrl.toString());
  }
);

