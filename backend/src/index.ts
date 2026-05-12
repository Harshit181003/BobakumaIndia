import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import passport from "passport";
import { config } from "./config.js";
import { apiRouter } from "./routes/index.js";
import { initPassportGoogle } from "./integrations/googlePassport.js";
import { razorpayWebhookHandler } from "./routes/webhooks.routes.js";

const app = express();

// Next.js `rewrites` (and other reverse proxies) send `X-Forwarded-For`. express-rate-limit requires
// `trust proxy` when that header is present. Dev: one hop (Next → Express). Prod: set `TRUST_PROXY`
// to the number of trusted hops (e.g. `1` behind a single load balancer).
if (process.env.TRUST_PROXY) {
  const n = Number(process.env.TRUST_PROXY);
  app.set("trust proxy", Number.isFinite(n) && n >= 0 ? n : 1);
} else if (process.env.NODE_ENV !== "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
function isLocalDevOrigin(origin: string) {
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:") return false;
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin: (origin, cb) => {
      const allow = new Set([config.appPublicUrl, ...config.corsOrigins]);
      if (!origin) return cb(null, true);
      if (allow.has(origin)) return cb(null, true);
      // Local Next dev may use :3000, :3001, etc. — allow any http localhost / 127.0.0.1 in non-production.
      if (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin)) return cb(null, true);
      return cb(new Error(`CORS_BLOCKED:${origin}`), false);
    },
    credentials: true
  })
);
app.use(cookieParser());
app.post("/api/webhooks/razorpay", express.raw({ type: "application/json" }), razorpayWebhookHandler);
app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120
  })
);

initPassportGoogle(passport);
app.use(passport.initialize());

const healthJson = { ok: true as const, service: "bobakuma-backend" as const };
app.get("/health", (_req, res) => {
  res.json(healthJson);
});
// Same payload as `/health` — used when the frontend proxies same-origin `/api/*` to this server.
app.get("/api/health", (_req, res) => {
  res.json(healthJson);
});

app.use("/api", apiRouter);

const port = config.port;
// Default 0.0.0.0 so both http://localhost:PORT and http://127.0.0.1:PORT work (Windows often maps
// "localhost" to IPv6 ::1; binding only 127.0.0.1 breaks fetch from the browser to localhost).
const host = process.env.BIND_HOST ?? "0.0.0.0";
// eslint-disable-next-line no-console
console.log(
  `MySQL target: ${config.mysql.host}:${config.mysql.port} database=${config.mysql.database} user=${config.mysql.user}`
);
app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${host}:${port}`);
});

