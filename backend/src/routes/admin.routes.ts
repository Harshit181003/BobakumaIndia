import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { streamOrderInvoicePdfToResponse } from "../services/invoice.service.js";

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireRole(["ADMIN", "SUPER_ADMIN"]));

adminRouter.get("/analytics", async (_req, res) => {
  const [rev] = await pool.query(
    `SELECT COALESCE(SUM(total_paise),0) AS revenue_paise, COUNT(*) AS orders
     FROM orders WHERE status IN ('PAID','PACKED','SHIPPED','DELIVERED')`
  );
  const [pending] = await pool.query(`SELECT COUNT(*) AS c FROM orders WHERE status = 'PENDING_PAYMENT'`);
  const [low] = await pool.query(
    `SELECT id, name, slug, stock_qty FROM products WHERE is_active = 1 AND stock_qty < 10 ORDER BY stock_qty ASC LIMIT 20`
  );
  const [top] = await pool.query(
    `SELECT p.id, p.name, p.slug, SUM(oi.qty) AS units
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     INNER JOIN orders o ON o.id = oi.order_id
     WHERE o.status IN ('PAID','PACKED','SHIPPED','DELIVERED')
     GROUP BY p.id, p.name, p.slug
     ORDER BY units DESC
     LIMIT 10`
  );

  const r = (rev as { revenue_paise: number; orders: number }[])[0];
  return res.json({
    revenuePaise: Number(r?.revenue_paise ?? 0),
    paidOrders: Number(r?.orders ?? 0),
    pendingPaymentOrders: Number((pending as { c: number }[])[0]?.c ?? 0),
    lowStock: low,
    topProducts: top
  });
});

adminRouter.get("/products", async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize ?? 24)));
  const offset = (page - 1) * pageSize;
  const [rows] = await pool.query(
    `SELECT p.*,
      (SELECT pi.url FROM product_images pi WHERE pi.product_id=p.id ORDER BY pi.sort_order, pi.id LIMIT 1) AS image_url
     FROM products p
     ORDER BY p.id DESC
     LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );
  const [c] = await pool.query("SELECT COUNT(*) AS total FROM products");
  return res.json({ items: rows, total: Number((c as { total: number }[])[0]?.total ?? 0), page, pageSize });
});

const upsertProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  category: z.enum(["KIDS", "OFFICE", "SHIRTS"]),
  material: z.string().min(1).max(50),
  capacityMl: z.coerce.number().int().positive().optional().nullable(),
  color: z.string().min(1).max(50),
  pricePaise: z.coerce.number().int().positive(),
  discountPercent: z.coerce.number().int().min(0).max(90).optional(),
  stockQty: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean().optional(),
  images: z
    .array(z.object({ url: z.string().url(), altText: z.string().max(255).optional(), sortOrder: z.number().int().optional() }))
    .optional()
});

adminRouter.post("/products", async (req, res) => {
  const parsed = upsertProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [ins] = await conn.query(
      `INSERT INTO products
        (name, slug, description, category, material, capacity_ml, color, price_paise, discount_percent, stock_qty, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsed.data.name,
        parsed.data.slug,
        parsed.data.description,
        parsed.data.category,
        parsed.data.material,
        parsed.data.capacityMl ?? null,
        parsed.data.color,
        parsed.data.pricePaise,
        parsed.data.discountPercent ?? 0,
        parsed.data.stockQty,
        parsed.data.isActive === false ? 0 : 1
      ]
    );
    const productId = (ins as { insertId: number }).insertId;

    if (parsed.data.images?.length) {
      for (const [idx, img] of parsed.data.images.entries()) {
        await conn.query(
          `INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES (?, ?, ?, ?)`,
          [productId, img.url, img.altText ?? null, img.sortOrder ?? idx]
        );
      }
    }

    await conn.commit();
    return res.status(201).json({ id: productId });
  } catch (e) {
    await conn.rollback();
    const msg = e instanceof Error ? e.message : "ERROR";
    if (msg.includes("Duplicate")) return res.status(409).json({ error: "DUPLICATE_SLUG" });
    throw e;
  } finally {
    conn.release();
  }
});

const patchProductSchema = upsertProductSchema.partial();

adminRouter.patch("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "INVALID_ID" });
  const parsed = patchProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const fields: string[] = [];
  const values: unknown[] = [];
  const d = parsed.data;
  if (d.name != null) {
    fields.push("name=?");
    values.push(d.name);
  }
  if (d.slug != null) {
    fields.push("slug=?");
    values.push(d.slug);
  }
  if (d.description != null) {
    fields.push("description=?");
    values.push(d.description);
  }
  if (d.category != null) {
    fields.push("category=?");
    values.push(d.category);
  }
  if (d.material != null) {
    fields.push("material=?");
    values.push(d.material);
  }
  if (d.capacityMl !== undefined) {
    fields.push("capacity_ml=?");
    values.push(d.capacityMl);
  }
  if (d.color != null) {
    fields.push("color=?");
    values.push(d.color);
  }
  if (d.pricePaise != null) {
    fields.push("price_paise=?");
    values.push(d.pricePaise);
  }
  if (d.discountPercent != null) {
    fields.push("discount_percent=?");
    values.push(d.discountPercent);
  }
  if (d.stockQty != null) {
    fields.push("stock_qty=?");
    values.push(d.stockQty);
  }
  if (d.isActive != null) {
    fields.push("is_active=?");
    values.push(d.isActive ? 1 : 0);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (fields.length) {
      values.push(id);
      await conn.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values);
    }

    if (d.images) {
      await conn.query("DELETE FROM product_images WHERE product_id = ?", [id]);
      for (const [idx, img] of d.images.entries()) {
        await conn.query(`INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES (?, ?, ?, ?)`, [
          id,
          img.url,
          img.altText ?? null,
          img.sortOrder ?? idx
        ]);
      }
    }

    await conn.commit();
    return res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

adminRouter.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "INVALID_ID" });
  await pool.query("UPDATE products SET is_active = 0 WHERE id = ?", [id]);
  return res.json({ ok: true });
});

adminRouter.get("/users", async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize ?? 24)));
  const offset = (page - 1) * pageSize;
  const [rows] = await pool.query(
    `SELECT id, email, role, name, is_active, created_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );
  const [c] = await pool.query("SELECT COUNT(*) AS total FROM users");
  return res.json({ items: rows, total: Number((c as { total: number }[])[0]?.total ?? 0), page, pageSize });
});

const roleSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "CUSTOMER", "VENDOR"]),
  isActive: z.coerce.boolean().optional()
});

adminRouter.patch("/users/:id", async (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "INVALID_ID" });
  if (id === req.user!.id) return res.status(400).json({ error: "CANNOT_EDIT_SELF" });

  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  if (parsed.data.role === "SUPER_ADMIN" && req.user!.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "FORBIDDEN" });
  }

  if (parsed.data.isActive != null) {
    await pool.query("UPDATE users SET role = ?, is_active = ? WHERE id = ?", [
      parsed.data.role,
      parsed.data.isActive ? 1 : 0,
      id
    ]);
  } else {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [parsed.data.role, id]);
  }
  return res.json({ ok: true });
});

adminRouter.get("/orders", async (req, res) => {
  const status = req.query.status ? String(req.query.status) : null;
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize ?? 24)));
  const offset = (page - 1) * pageSize;

  const where = status ? "WHERE status = ?" : "";

  const [rows] = await pool.query(
    `SELECT id, user_id, status, total_paise, created_at FROM orders ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    status ? [status, pageSize, offset] : [pageSize, offset]
  );

  const [c] = await pool.query(`SELECT COUNT(*) AS total FROM orders ${where}`, status ? [status] : []);
  return res.json({ items: rows, total: Number((c as { total: number }[])[0]?.total ?? 0), page, pageSize });
});

const statusSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"])
});

adminRouter.patch("/orders/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "INVALID_ID" });
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [parsed.data.status, id]);
  return res.json({ ok: true });
});

adminRouter.get("/orders/:id/invoice", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "INVALID_ID" });
  const ok = await streamOrderInvoicePdfToResponse(id, res);
  if (!ok) return res.status(404).end();
});
