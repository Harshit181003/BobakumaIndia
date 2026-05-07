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

app.use(helmet());
app.use(
  cors({
    origin: config.appPublicUrl,
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

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bobakuma-backend" });
});

app.use("/api", apiRouter);

const port = config.port;
const host = process.env.BIND_HOST ?? (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${host}:${port}`);
});

