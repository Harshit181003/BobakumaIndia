USE bobakuma;

-- Admin users (DEV ONLY — password is "password" — change in production)
INSERT INTO users (email, password_hash, role, name, is_active)
VALUES
  (
    'superadmin@bobakuma.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'SUPER_ADMIN',
    'Super Admin',
    1
  ),
  (
    'admin@bobakuma.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ADMIN',
    'Admin',
    1
  )
ON DUPLICATE KEY UPDATE role=VALUES(role), name=VALUES(name), is_active=VALUES(is_active);

-- Coupons
INSERT INTO coupons (code, discount_percent, min_order_paise, max_redemptions, expires_at, is_active)
VALUES
  ('WELCOME10', 10, 49900, 1000, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 90 DAY), 1),
  ('KIDSLOVE15', 15, 79900, 500, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 60 DAY), 1)
ON DUPLICATE KEY UPDATE is_active=VALUES(is_active);

-- Lunchbox lineup (placeholder photos — swap for your Bobakuma packshots in /public/brand/)
INSERT INTO products
  (name, slug, description, category, material, capacity_ml, color, price_paise, discount_percent, stock_qty, is_active)
VALUES
  (
    'Bobakuma Two-Tier Bento (White / Mint Strap)',
    'bento-blossom-lunchbox',
    'Stackable two-tier bento with a soft mint strap and candy-bright badge prints. Lightweight, everyday leak-aware seal — great for kids and cute desk lunches.',
    'KIDS',
    'BPA_FREE_PLASTIC',
    900,
    'White / Mint',
    89900,
    10,
    120,
    1
  ),
  (
    'Office Zen Steel Lunchbox',
    'office-zen-steel-lunchbox',
    'Premium stainless steel lunchbox with snug seal and sleek pastel sleeve. Perfect for office lunches and gifting.',
    'OFFICE',
    'STAINLESS_STEEL',
    1100,
    'Lavender',
    119900,
    15,
    80,
    1
  ),
  (
    'Peach Pop Mini Tiffin',
    'peach-pop-mini-tiffin',
    'Compact and cute mini tiffin for snacks and fruits. Durable, travel-friendly, and adorable in hand.',
    'KIDS',
    'BPA_FREE_PLASTIC',
    450,
    'Peach',
    49900,
    5,
    200,
    1
  ),
  (
    'Cream Cloud Glass Lunchbox',
    'cream-cloud-glass-lunchbox',
    'Microwave-friendly glass lunchbox with soft-touch pastel lid. Clean look, premium feel, and easy portioning.',
    'OFFICE',
    'GLASS',
    1000,
    'Cream',
    139900,
    12,
    60,
    1
  )
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  description=VALUES(description),
  color=VALUES(color),
  price_paise=VALUES(price_paise),
  discount_percent=VALUES(discount_percent),
  stock_qty=VALUES(stock_qty),
  is_active=VALUES(is_active);

DELETE pi FROM product_images pi
INNER JOIN products p ON p.id = pi.product_id
WHERE p.slug IN (
  'bento-blossom-lunchbox',
  'office-zen-steel-lunchbox',
  'peach-pop-mini-tiffin',
  'cream-cloud-glass-lunchbox'
);

INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT p.id,
       i.url,
       i.alt_text,
       i.sort_order
FROM products p
JOIN (
  SELECT 'bento-blossom-lunchbox' AS slug,
         'https://images.unsplash.com/photo-1587734193613-12eaf7e0e4d1?auto=format&fit=crop&w=1200&q=80' AS url,
         'Stacked white bento lunchbox' AS alt_text,
         0 AS sort_order
  UNION ALL
  SELECT 'bento-blossom-lunchbox',
         'https://images.unsplash.com/photo-1615485920415-680443d9688c?auto=format&fit=crop&w=1200&q=80',
         'Minimal bento containers on wood',
         1
  UNION ALL
  SELECT 'bento-blossom-lunchbox',
         'https://images.unsplash.com/photo-1594398907494-9f3f9d6949b8?auto=format&fit=crop&w=1200&q=80',
         'Colorful bento-style lunch set',
         2
  UNION ALL
  SELECT 'office-zen-steel-lunchbox',
         'https://images.unsplash.com/photo-1524594081293-190a2fe0baae?auto=format&fit=crop&w=1200&q=80',
         'Steel lunchbox (premium office)',
         0
  UNION ALL
  SELECT 'office-zen-steel-lunchbox',
         'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80',
         'Metal food container flat lay',
         1
  UNION ALL
  SELECT 'office-zen-steel-lunchbox',
         'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
         'Lunch spread with containers',
         2
  UNION ALL
  SELECT 'peach-pop-mini-tiffin',
         'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=1200&q=80',
         'Mini tiffin (snacks)',
         0
  UNION ALL
  SELECT 'peach-pop-mini-tiffin',
         'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80',
         'Bright breakfast table',
         1
  UNION ALL
  SELECT 'peach-pop-mini-tiffin',
         'https://images.unsplash.com/photo-1543363136-5ae0b0077b99?auto=format&fit=crop&w=1200&q=80',
         'Pastel pink bento box',
         2
  UNION ALL
  SELECT 'cream-cloud-glass-lunchbox',
         'https://images.unsplash.com/photo-1604909053278-9f5183e46b25?auto=format&fit=crop&w=1200&q=80',
         'Glass lunchbox (cream lid)',
         0
  UNION ALL
  SELECT 'cream-cloud-glass-lunchbox',
         'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
         'Meal prep glass containers',
         1
  UNION ALL
  SELECT 'cream-cloud-glass-lunchbox',
         'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80',
         'Fresh lunch spread',
         2
) i ON i.slug = p.slug;
