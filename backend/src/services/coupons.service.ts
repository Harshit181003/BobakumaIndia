import { pool } from "../db.js";

export type CouponRow = {
  id: number;
  code: string;
  discount_percent: number | null;
  discount_paise: number | null;
  min_order_paise: number;
  max_redemptions: number | null;
  expires_at: Date | null;
  is_active: 0 | 1;
};

export async function findCouponByCode(code: string) {
  const [rows] = await pool.query("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) LIMIT 1", [code]);
  return (rows as CouponRow[])[0] ?? null;
}

export async function countCouponRedemptions(couponId: number) {
  const [rows] = await pool.query("SELECT COUNT(*) AS c FROM coupon_redemptions WHERE coupon_id = ?", [couponId]);
  return Number((rows as { c: number }[])[0]?.c ?? 0);
}

export async function hasUserRedeemedCoupon(userId: number, couponId: number) {
  const [rows] = await pool.query(
    "SELECT id FROM coupon_redemptions WHERE user_id = ? AND coupon_id = ? LIMIT 1",
    [userId, couponId]
  );
  return Boolean((rows as { id: number }[])[0]);
}

export function computeDiscountPaise(coupon: CouponRow, subtotalPaise: number) {
  if (coupon.discount_percent != null) {
    return Math.floor((subtotalPaise * coupon.discount_percent) / 100);
  }
  if (coupon.discount_paise != null) {
    return Math.min(coupon.discount_paise, subtotalPaise);
  }
  return 0;
}
