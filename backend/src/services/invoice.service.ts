import PDFDocument from "pdfkit";
import type { Response } from "express";
import { getOrderAdmin } from "./orders.service.js";

function formatMoney(paise: number) {
  return `INR ${(paise / 100).toFixed(2)}`;
}

export async function streamOrderInvoicePdfToResponse(orderId: number, res: Response): Promise<boolean> {
  const order = await getOrderAdmin(orderId);
  if (!order) return false;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="bobakuma-order-${orderId}.pdf"`);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text("Bobakuma India");
  doc.moveDown(0.25);
  doc.fontSize(10).fillColor("#666666").text("Invoice / order summary");
  doc.fillColor("#000000");
  doc.moveDown();

  doc.fontSize(12).text(`Order #${order.id}`);
  doc.fontSize(10).text(`Status: ${order.status}`);
  doc.text(`Placed: ${new Date(order.createdAt as Date).toISOString()}`);
  doc.moveDown();

  doc.fontSize(11).text("Ship to", { underline: true });
  doc.fontSize(10);
  doc.text(order.shipping.name);
  doc.text(order.shipping.phone);
  doc.text(`${order.shipping.line1}${order.shipping.line2 ? `, ${order.shipping.line2}` : ""}`);
  doc.text(`${order.shipping.city}, ${order.shipping.state} — ${order.shipping.postal}`);
  doc.text(order.shipping.country);
  doc.moveDown();

  doc.fontSize(11).text("Line items", { underline: true });
  doc.moveDown(0.25);
  for (const it of order.items) {
    const lineTotal = it.unitPricePaise * it.qty;
    doc.fontSize(10).text(`${it.name} × ${it.qty} — ${formatMoney(lineTotal)}`);
  }

  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Subtotal: ${formatMoney(order.subtotalPaise)}`);
  doc.text(`Discount: ${formatMoney(order.discountPaise)}`);
  doc.text(`Shipping: ${formatMoney(order.shippingPaise)}`);
  doc.fontSize(12).text(`Total: ${formatMoney(order.totalPaise)}`);

  doc.end();
  return true;
}
