import { db } from "@/src/db";
import { orders, orderItems, products } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { Order, OrderStatus } from "@/lib/types";

export async function getAllAdminOrders(): Promise<Order[]> {
  const dbOrders = await db.query.orders.findMany({
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
  });

  return dbOrders.map((order) => ({
    id: order.id,
    productId: order.items[0]?.productId || "",
    productSlug: order.items[0]?.product?.slug || "",
    productName: order.items[0]?.product?.name || "Deleted Product",
    fullName: order.fullName,
    phone: order.phone,
    governorate: order.governorate,
    address: order.address,
    size: order.items[0]?.size || "",
    color: order.items[0]?.color || "",
    quantity: order.items[0]?.quantity || 1,
    notes: order.notes || "",
    status: order.status as OrderStatus,
    createdAt: order.createdAt.toISOString(),
  }));
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus) {
  await db.update(orders).set({
    status: status,
    updatedAt: new Date(),
  }).where(eq(orders.id, id));

  return { success: true };
}
