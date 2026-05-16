"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { defaultProducts } from "@/lib/products";
import { loadProducts } from "@/lib/productStorage";
import { Product } from "@/lib/types";

const sortProducts = (items: Product[]) =>
  [...items].sort((left, right) => Number(right.featured) - Number(left.featured));

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setProducts(sortProducts(loadProducts().filter((product) => product.active)));
    setIsHydrated(true);
  }, []);

  if (isHydrated && products.length === 0) {
    return (
      <div className="panel p-10 text-center text-white/65">
        لا توجد منتجات مفعلة حاليا. يمكنك تفعيلها من لوحة الإدارة.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sortProducts(products.filter((product) => product.active)).map((product) => (
        <div key={product.id} className="fade-up">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
