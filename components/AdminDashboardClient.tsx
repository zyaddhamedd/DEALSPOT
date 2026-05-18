"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminStatCard } from "@/components/AdminStatCard";
import { defaultProducts } from "@/lib/products";
import { loadOrders } from "@/lib/storage";
import { loadProducts } from "@/lib/productStorage";
import { Order, Product } from "@/lib/types";
import { isToday } from "@/lib/utils";

export function AdminDashboardClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setOrders(loadOrders());
        }
      } catch (err) {
        console.error("Failed to fetch admin orders:", err);
        setOrders(loadOrders());
      }
      setProducts(loadProducts());
      setReady(true);
    };

    void fetchRealData();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const ordersToday = orders.filter((order) => isToday(order.createdAt)).length;
    const topProductMap = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.productName] = (acc[order.productName] || 0) + order.quantity;
      return acc;
    }, {});
    const topProduct =
      Object.entries(topProductMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "No orders yet";
    const activeProducts = products.filter((product) => product.active).length;

    return { totalOrders, ordersToday, topProduct, activeProducts };
  }, [orders, products]);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Orders"
          value={String(stats.totalOrders)}
          helper="كل الطلبات المخزنة محليا"
        />
        <AdminStatCard
          label="Orders Today"
          value={String(stats.ordersToday)}
          helper="طلبات اليوم حسب المتصفح الحالي"
        />
        <AdminStatCard label="Top Product" value={stats.topProduct} helper="أعلى منتج في الطلبات الحالية" />
        <AdminStatCard
          label="Conversion"
          value="--"
          helper="Placeholder لحد وجود tracking حقيقي"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-6">
          <h2 className="headline text-2xl text-white">Overview</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            DealSpot حاليا شغال كنظام landing pages خفيف لتجميع الطلبات، وبعدها الإدارة تنقل الطلبات
            يدويا للمنصة الخارجية. أول ما تضيف backend أو auth هتقدر تحول نفس الواجهة لنظام إنتاجي كامل.
          </p>
        </div>

        <div className="panel p-6">
          <h2 className="headline text-2xl text-white">Store Status</h2>
          <div className="mt-5 space-y-4 text-sm text-white/72">
            <div className="flex items-center justify-between">
              <span>Active products</span>
              <span>{stats.activeProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Local orders ready</span>
              <span>{orders.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>UI hydrated</span>
              <span>{ready ? "Yes" : "Loading..."}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
