import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_PUBLIC_URL ?? "http://localhost:3000";
  const api = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  let slugs: string[] = [];
  try {
    const res = await fetch(`${api}/api/products?pageSize=200`);
    if (res.ok) {
      const data = (await res.json()) as { items: { slug: string }[] };
      slugs = (data.items ?? []).map((i) => i.slug);
    }
  } catch {
    /* ignore */
  }
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    ...slugs.map((slug) => ({ url: `${base}/products/${slug}`, lastModified: new Date() }))
  ];
}
