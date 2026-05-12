-- Fix wrong Unsplash hero images (e.g. beach scene on steel lunchbox). Run after seed if data is already loaded.
-- Office Zen: use bento / tiffin photos only.
UPDATE product_images pi
INNER JOIN products p ON p.id = pi.product_id AND p.slug = 'office-zen-steel-lunchbox'
SET
  pi.url = CASE pi.sort_order
    WHEN 0 THEN 'https://images.unsplash.com/photo-1587734193613-12eaf7e0e4d1?auto=format&fit=crop&w=1200&q=80'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1590080876204-c311287998e7?auto=format&fit=crop&w=1200&q=80'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1615485920415-680443d9688c?auto=format&fit=crop&w=1200&q=80'
    ELSE pi.url
  END,
  pi.alt_text = CASE pi.sort_order
    WHEN 0 THEN 'Stacked bento lunchbox (office line)'
    WHEN 1 THEN 'Steel tiffin-style lunch stack'
    WHEN 2 THEN 'Minimal meal containers on wood'
    ELSE pi.alt_text
  END
WHERE pi.sort_order IN (0, 1, 2);

-- Mint tee: replace secondary image that was often a non-product stock shot.
UPDATE product_images pi
INNER JOIN products p ON p.id = pi.product_id AND p.slug = 'bobakuma-mint-graphic-tee' AND pi.sort_order = 1
SET
  pi.url = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80',
  pi.alt_text = 'Folded cotton tees (pastel)';
