/** Paise helpers (INR smallest unit for Razorpay). */
export function effectiveUnitPricePaise(pricePaise: number, discountPercent: number) {
  return Math.floor((pricePaise * (100 - discountPercent)) / 100);
}

export function lineTotalPaise(unitPaise: number, qty: number) {
  return unitPaise * qty;
}
