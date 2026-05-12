import { NextResponse } from "next/server";

/** Hit http://localhost:PORT/api/dev-ping — if you see JSON, Next is handling /api (not the backend). */
export function GET() {
  return NextResponse.json({ ok: true, from: "next-frontend", hint: "Use /api/auth/* etc.; those are proxied to Express in dev." });
}
