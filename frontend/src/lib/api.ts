const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

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

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = typeof window !== "undefined" ? getAccessToken() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API}/api${path}`, { ...init, headers });
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

export { API };
