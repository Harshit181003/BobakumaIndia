/** Shown in error messages; real fetch URL is chosen in `apiFetch`. */
export const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";

function isLoopbackApiBase(base: string) {
  if (!base) return true;
  try {
    const u = new URL(base);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/** Same URL rules as `apiFetch` (use for raw `fetch`, `<a href>`, etc.). */
export function getApiFetchUrl(path: string) {
  const suffix = `/api${path.startsWith("/") ? path : `/${path}`}`;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
  // Same-origin `/api/*` is proxied to Express in dev (see `next.config.mjs` `rewrites`).
  // Use relative URLs whenever the public API base is unset or loopback so SSR and the browser
  // agree (avoids hydration mismatches like `/api/...` vs `http://127.0.0.1:4000/api/...`).
  if (!base || isLoopbackApiBase(base)) return suffix;
  return `${base}${suffix}`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bobakuma_access_token");
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem("bobakuma_access_token", access);
  if (refresh) localStorage.setItem("bobakuma_refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("bobakuma_access_token");
  localStorage.removeItem("bobakuma_refresh_token");
}

export function getApiError(e: unknown): { status?: number; errorCode?: string } {
  if (e && typeof e === "object" && "status" in e) {
    const ae = e as { status?: number; body?: unknown };
    let errorCode: string | undefined;
    if (ae.body && typeof ae.body === "object" && ae.body !== null && "error" in ae.body) {
      const err = (ae.body as { error?: unknown }).error;
      if (typeof err === "string") errorCode = err;
    }
    return { status: ae.status, errorCode };
  }
  return {};
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = typeof window !== "undefined" ? getAccessToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(getApiFetchUrl(path), { ...init, headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const tried = typeof window !== "undefined" ? `${window.location.origin}${getApiFetchUrl(path)}` : getApiFetchUrl(path);
    throw Object.assign(new Error("FETCH_FAILED"), { cause: e, apiBase: tried, detail: msg });
  }
  if (!res.ok) {
    let err: unknown = null;
    try {
      err = await res.json();
    } catch {
      err = await res.text();
    }
    throw Object.assign(new Error("API_ERROR"), { status: res.status, body: err });
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

