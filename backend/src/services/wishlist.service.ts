import { pool } from "../db.js";
import { effectiveUnitPricePaise } from "../utils/money.js";

async function getOrCreateWishlistId(userId: number) {
  const [existing] = await pool.query("SELECT id FROM wishlists WHERE user_id = ? LIMIT 1", [userId]);
  const row = (existing as { id: number }[])[0];
  if (row) return row.id;

  const [ins] = await pool.query("INSERT INTO wishlists (user_id) VALUES (?)", [userId]);
  return (ins as { insertId: number }).insertId;
}

export async function getWishlist(userId: number) {
  const wishlistId = await getOrCreateWishlistId(userId);
  const [rows] = await pool.query(
    `SELECT wi.id AS wishlist_item_id, p.id AS product_id, p.name, p.slug,
            p.price_paise, p.discount_percent, p.stock_qty, p.is_active,
            (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC, pi.id ASC LIMIT 1) AS image_url
     FROM wishlist_items wi
     INNER JOIN products p ON p.id = wi.product_id
     WHERE wi.wishlist_id = ?
     ORDER BY wi.id DESC`,
    [wishlistId]
  );

  return (rows as Record<string, unknown>[]).map((r) => {
    const pricePaise = Number(r.price_paise);
    const discountPercent = Number(r.discount_percent);
    return {
      wishlistItemId: Number(r.wishlist_item_id),
      productId: Number(r.product_id),
      name: String(r.name),
      slug: String(r.slug),
      effectivePricePaise: effectiveUnitPricePaise(pricePaise, discountPercent),
      imageUrl: r.image_url ? String(r.image_url) : null,
      inStock: Number(r.stock_qty) > 0 && Number(r.is_active) === 1
    };
  });
}

export async function addWishlistItem(userId: number, productId: number) {
  const wishlistId = await getOrCreateWishlistId(userId);
  const [pRows] = await pool.query("SELECT id, is_active FROM products WHERE id = ? LIMIT 1", [productId]);
  const p = (pRows as { id: number; is_active: 0 | 1 }[])[0];
  if (!p || p.is_active !== 1) throw new Error("PRODUCT_NOT_FOUND");

  await pool.query(
    `INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE wishlist_id = wishlist_id`,
    [wishlistId, productId]
  );
  return getWishlist(userId);
}

export async function removeWishlistItem(userId: number, wishlistItemId: number) {
  const wishlistId = await getOrCreateWishlistId(userId);
  await pool.query("DELETE FROM wishlist_items WHERE id = ? AND wishlist_id = ?", [wishlistItemId, wishlistId]);
  return getWishlist(userId);
}
