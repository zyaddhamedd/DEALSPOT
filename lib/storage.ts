"use client";

export {
  estimateProductsStorageBytes,
  loadProducts,
  PRODUCTS_STORAGE_KEY,
  resetProducts,
  resetSingleProduct,
  saveProducts,
} from "@/lib/productStorage";

import { Order, OrderPayload, OrderStatus, Product } from "@/lib/types";

const ORDERS_KEY = "dealspot_orders";
const LEGACY_ORDERS_KEYS = ["dealspot_orders_v1"];

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const loadOrders = (): Order[] => {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(ORDERS_KEY) ?? LEGACY_ORDERS_KEYS
    .map((key) => window.localStorage.getItem(key))
    .find(Boolean) ?? null;
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveOrders = (orders: Order[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const createOrder = (product: Product, payload: OrderPayload): Order => {
  const order: Order = {
    id: `ord_${Date.now()}`,
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    fullName: payload.fullName,
    phone: payload.phone,
    governorate: payload.governorate,
    address: payload.address,
    size: payload.size,
    color: payload.color,
    quantity: payload.quantity,
    notes: payload.notes?.trim() || "",
    status: "New",
    createdAt: new Date().toISOString(),
  };

  const nextOrders = [order, ...loadOrders()];
  saveOrders(nextOrders);

  return order;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const nextOrders = loadOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
  saveOrders(nextOrders);
  return nextOrders;
};

export const exportOrdersToCsv = (orders: Order[]) => {
  if (!canUseStorage()) {
    return;
  }

  const header = [
    "id",
    "productName",
    "fullName",
    "phone",
    "governorate",
    "address",
    "size",
    "color",
    "quantity",
    "status",
    "createdAt",
    "notes",
  ];

  const rows = orders.map((order) =>
    [
      order.id,
      order.productName,
      order.fullName,
      order.phone,
      order.governorate,
      order.address,
      order.size,
      order.color,
      String(order.quantity),
      order.status,
      order.createdAt,
      order.notes ?? "",
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `dealspot-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
