import { db } from "@/src/db";
import { orders, orderItems, products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { OrderPayload } from "@/lib/types";

export async function createOrder(payload: OrderPayload & { productSlug: string }) {
  // 1. Validate basic fields
  if (!payload.fullName.trim() || !payload.phone.trim() || !payload.address.trim() || !payload.governorate.trim()) {
    throw new Error("Missing required customer information");
  }

  // 2. Fetch product from DB to get real price (never trust client price)
  const dbProduct = await db.query.products.findFirst({
    where: eq(products.slug, payload.productSlug),
  });

  if (!dbProduct) {
    throw new Error("Product not found");
  }

  if (!dbProduct.active) {
    throw new Error("Product is not available for sale");
  }

  // 3. Calculate total
  const unitPrice = dbProduct.salePrice ? Number(dbProduct.salePrice) : Number(dbProduct.price);
  const totalAmount = unitPrice * (payload.quantity || 1);

  // 4. Insert order and items within a transaction
  return await db.transaction(async (tx) => {
    const [insertedOrder] = await tx.insert(orders).values({
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      governorate: payload.governorate.trim(),
      address: payload.address.trim(),
      totalAmount: totalAmount.toString(),
      status: "New",
      notes: payload.notes?.trim() || "",
    }).returning();

    await tx.insert(orderItems).values({
      orderId: insertedOrder.id,
      productId: dbProduct.id,
      size: payload.size,
      color: payload.color,
      quantity: payload.quantity || 1,
      priceAtTime: unitPrice.toString(),
    });

    return insertedOrder;
  });
}
