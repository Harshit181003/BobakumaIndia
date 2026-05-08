import { Suspense } from "react";
import { CallbackClient } from "./CallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-900/60">Signing you in…</div>}>
      <CallbackClient />
    </Suspense>
  );
}
