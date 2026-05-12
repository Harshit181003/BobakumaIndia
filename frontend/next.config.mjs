/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" }
    ]
  },
  /**
   * Proxy `/api/*` to Express in dev (Node handles this — Edge `middleware` rewrites to 127.0.0.1
   * often fail on Windows). `afterFiles`: real App Router handlers under `/api` (e.g. dev-ping) win.
   */
  async rewrites() {
    if (process.env.DISABLE_API_DEV_PROXY === "1") return [];
    const isProd = process.env.NODE_ENV === "production";
    const fromEnv = (process.env.BACKEND_DEV_URL ?? process.env.INTERNAL_API_BASE_URL ?? "").replace(/\/$/, "");
    if (isProd && !fromEnv) return [];
    const target = fromEnv || "http://127.0.0.1:4000";
    return {
      afterFiles: [{ source: "/api/:path*", destination: `${target}/api/:path*` }]
    };
  }
};

export default nextConfig;

