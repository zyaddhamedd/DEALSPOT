"use client";

import { cloneProducts, defaultProducts, normalizeProduct, resolveProductFallback } from "@/lib/products";
import { Product } from "@/lib/types";

const PRODUCTS_KEY = "dealspot_products";
const LEGACY_PRODUCTS_KEYS = ["dealspot_products_v1"];

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readProductsRaw = () => {
  if (!canUseStorage()) {
    return null;
  }

  const current = window.localStorage.getItem(PRODUCTS_KEY);
  if (current) {
    return current;
  }

  for (const key of LEGACY_PRODUCTS_KEYS) {
    const legacy = window.localStorage.getItem(key);
    if (legacy) {
      return legacy;
    }
  }

  return null;
};

export const loadProducts = (): Product[] => {
  if (!canUseStorage()) {
    return cloneProducts(defaultProducts);
  }

  const raw = readProductsRaw();
  if (raw === null) {
    // No data ever saved, return defaults
    return cloneProducts(defaultProducts);
  }

  try {
    const parsed = JSON.parse(raw) as Array<Partial<Product> & { image?: string }>;
    if (!Array.isArray(parsed)) {
      return cloneProducts(defaultProducts);
    }

    // Return the list (even if empty)
    return parsed.map((product, index) => normalizeProduct(product, resolveProductFallback(product, index)));
  } catch {
    return cloneProducts(defaultProducts);
  }
};

export const saveProducts = (products: Product[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const resetProducts = () => {
  if (canUseStorage()) {
    window.localStorage.removeItem(PRODUCTS_KEY);
    LEGACY_PRODUCTS_KEYS.forEach((key) => window.localStorage.removeItem(key));
  }

  return cloneProducts(defaultProducts);
};

export const resetSingleProduct = (productId: string, currentProducts: Product[]) => {
  const defaults = cloneProducts(defaultProducts);
  const fallback = defaults.find((product) => product.id === productId);

  if (!fallback) {
    return currentProducts;
  }

  return currentProducts.map((product) => (product.id === productId ? fallback : product));
};

export const estimateProductsStorageBytes = (products: Product[]) =>
  new Blob([JSON.stringify(products)]).size;

export const PRODUCTS_STORAGE_KEY = PRODUCTS_KEY;
