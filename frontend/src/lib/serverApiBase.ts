/** Server-side fetches to Express (avoid relying only on NEXT_PUBLIC_* in Node). */
export function getServerApiBase(): string {
  return (
    process.env.INTERNAL_API_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:4000"
  );
}
