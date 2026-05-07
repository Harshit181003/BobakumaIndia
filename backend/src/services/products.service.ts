import { pool } from "../db.js";
import { effectiveUnitPricePaise } from "../utils/money.js";

export type ProductRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  material: string;
  capacity_ml: number | null;
  color: string;
  price_paise: number;
  discount_percent: number;
  stock_qty: number;
  is_active: 0 | 1;
  created_at: Date;
  updated_at: Date;
};

export type ProductListFilters = {
  q?: string;
  category?: string;
  material?: string;
  color?: string;
  minPricePaise?: number;
  maxPricePaise?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  page: number;
  pageSize: number;
};

function mapProductListRow(r: Record<string, unknown>) {
  const pricePaise = Number(r.price_paise);
  const discountPercent = Number(r.discount_percent);
  return {
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    category: String(r.category),
    material: String(r.material),
    color: String(r.color),
    capacityMl: r.capacity_ml == null ? null : Number(r.capacity_ml),
    pricePaise,
    discountPercent,
    effectivePricePaise: effectiveUnitPricePaise(pricePaise, discountPercent),
    stockQty: Number(r.stock_qty),
    imageUrl: r.image_url ? String(r.image_url) : null,
    avgRating: r.avg_rating == null ? 0 : Number(r.avg_rating),
    reviewCount: Number(r.review_count ?? 0)
  };
}

export async function listProducts(f: ProductListFilters) {
  const offset = (f.page - 1) * f.pageSize;
  const where: string[] = ["p.is_active = 1"];
  const params: unknown[] = [];

  if (f.category) {
    where.push("p.category = ?");
    params.push(f.category);
  }
  if (f.material) {
    where.push("p.material = ?");
    params.push(f.material);
  }
  if (f.color) {
    where.push("p.color = ?");
    params.push(f.color);
  }
  if (f.q?.trim()) {
    where.push("(p.name LIKE ? OR p.description LIKE ?)");
    const like = `%${f.q.trim()}%`;
    params.push(like, like);
  }

  const effExpr = "FLOOR(p.price_paise * (100 - p.discount_percent) / 100)";
  if (f.minPricePaise != null) {
    where.push(`${effExpr} >= ?`);
    params.push(f.minPricePaise);
  }
  if (f.maxPricePaise != null) {
    where.push(`${effExpr} <= ?`);
    params.push(f.maxPricePaise);
  }

  let orderBy = "p.created_at DESC";
  if (f.sort === "price_asc") orderBy = `${effExpr} ASC`;
  if (f.sort === "price_desc") orderBy = `${effExpr} DESC`;
  if (f.sort === "rating") orderBy = "avg_rating DESC, review_count DESC, p.created_at DESC";

  const sql = `
    SELECT
      p.*,
      (
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.sort_order ASC, pi.id ASC
        LIMIT 1
      ) AS image_url,
      COALESCE(AVG(r.rating), 0) AS avg_rating,
      COUNT(r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE ${where.join(" AND ")}
    GROUP BY p.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const listParams = [...params, f.pageSize, offset];
  const [rows] = await pool.query(sql, listParams);

  const countSql = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT p.id
      FROM products p
      WHERE ${where.join(" AND ")}
      GROUP BY p.id
    ) t
  `;
  const [countRows] = await pool.query(countSql, params);
  const total = Number((countRows as { total: number }[])[0]?.total ?? 0);

  return {
    items: (rows as Record<string, unknown>[]).map(mapProductListRow),
    total,
    page: f.page,
    pageSize: f.pageSize
  };
}

export async function getProductBySlug(slug: string) {
  const [rows] = await pool.query("SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1", [slug]);
  const p = (rows as ProductRow[])[0];
  if (!p) return null;

  const [images] = await pool.query(
    "SELECT id, url, alt_text, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
    [p.id]
  );

  const [reviewAgg] = await pool.query(
    "SELECT COALESCE(AVG(rating),0) AS avg_rating, COUNT(*) AS review_count FROM reviews WHERE product_id = ?",
    [p.id]
  );
  const agg = (reviewAgg as { avg_rating: number; review_count: number }[])[0];

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    material: p.material,
    color: p.color,
    capacityMl: p.capacity_ml,
    pricePaise: p.price_paise,
    discountPercent: p.discount_percent,
    effectivePricePaise: effectiveUnitPricePaise(p.price_paise, p.discount_percent),
    stockQty: p.stock_qty,
    avgRating: Number(agg.avg_rating),
    reviewCount: Number(agg.review_count),
    images: (images as { id: number; url: string; alt_text: string | null; sort_order: number }[]).map((i) => ({
      id: i.id,
      url: i.url,
      altText: i.alt_text,
      sortOrder: i.sort_order
    }))
  };
}

export async function getRelatedProducts(category: string, excludeId: number, limit = 4) {
  const [rows] = await pool.query(
    `SELECT p.*,
      (
        SELECT pi.url FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.sort_order ASC, pi.id ASC LIMIT 1
      ) AS image_url,
      COALESCE(AVG(r.rating), 0) AS avg_rating,
      COUNT(r.id) AS review_count
     FROM products p
     LEFT JOIN reviews r ON r.product_id = p.id
     WHERE p.is_active = 1 AND p.category = ? AND p.id <> ?
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT ?`,
    [category, excludeId, limit]
  );
  return (rows as Record<string, unknown>[]).map(mapProductListRow);
}

export async function getReviewsForProduct(productId: number) {
  const [rows] = await pool.query(
    `SELECT r.id, r.rating, r.comment, r.created_at,
            u.name AS user_name
     FROM reviews r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return (rows as { id: number; rating: number; comment: string | null; created_at: Date; user_name: string | null }[]).map(
    (r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      userName: r.user_name ?? "Customer"
    })
  );
}
