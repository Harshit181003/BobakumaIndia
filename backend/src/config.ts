import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const envSchema = z.object({
  BACKEND_PORT: z.string().optional(),
  APP_PUBLIC_URL: z.string().default("http://localhost:3000"),
  /** Comma-separated list of allowed CORS origins (e.g. https://bobakuma.in,https://www.bobakuma.in). */
  CORS_ORIGINS: z.string().optional(),

  MYSQL_HOST: z.string().default("localhost"),
  MYSQL_PORT: z.string().default("3306"),
  MYSQL_DATABASE: z.string().default("bobakuma"),
  MYSQL_USER: z.string().default("bobakuma_user"),
  MYSQL_PASSWORD: z.string().default("bobakuma_password"),

  JWT_ACCESS_SECRET: z.string().min(16).default("dev_only_access_secret_change_me"),
  JWT_REFRESH_SECRET: z.string().min(16).default("dev_only_refresh_secret_change_me"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  /** Subcontinent display pricing (INR is DB baseline). Update from your finance source. */
  PRICING_INR_TO_NPR: z.string().default("1.60"),
  PRICING_INR_TO_LKR: z.string().default("3.55"),
  PRICING_ADJUST_NP: z.string().default("1.00"),
  PRICING_ADJUST_LK: z.string().default("1.00")
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

/** Many hosts (cPanel Node, PaaS) set `PORT`; prefer it over `BACKEND_PORT`. */
const listenPort = Number(process.env.PORT || env.BACKEND_PORT || 4000);

export const config = {
  port: listenPort,
  appPublicUrl: env.APP_PUBLIC_URL,
  corsOrigins: (env.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  mysql: {
    host: env.MYSQL_HOST,
    port: Number(env.MYSQL_PORT),
    database: env.MYSQL_DATABASE,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD
  },
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN
  },
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackUrl: env.GOOGLE_CALLBACK_URL
  },
  razorpay: {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
    webhookSecret: env.RAZORPAY_WEBHOOK_SECRET
  },
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM
  },
  pricing: {
    inrToNpr: Number(env.PRICING_INR_TO_NPR),
    inrToLkr: Number(env.PRICING_INR_TO_LKR),
    adjustNp: Number(env.PRICING_ADJUST_NP),
    adjustLk: Number(env.PRICING_ADJUST_LK)
  }
} as const;

