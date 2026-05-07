import nodemailer from "nodemailer";
import { config } from "../config.js";

let transporter: nodemailer.Transporter | null = null;

function getTransport() {
  if (!config.smtp.host || !config.smtp.port) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth:
        config.smtp.user && config.smtp.pass
          ? { user: config.smtp.user, pass: config.smtp.pass }
          : undefined
    });
  }
  return transporter;
}

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const t = getTransport();
  if (!t) {
    // eslint-disable-next-line no-console
    console.warn("[email] SMTP not configured; skipping send:", subject);
    return { skipped: true as const };
  }
  await t.sendMail({
    from: config.smtp.from ?? "Bobakuma <no-reply@localhost>",
    to,
    subject,
    text,
    html: html ?? `<p>${text}</p>`
  });
  return { skipped: false as const };
}
