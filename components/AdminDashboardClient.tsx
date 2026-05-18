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
  const [analytics, setAnalytics] = useState({
    visitorsToday: 0,
    visitorsTotal: 0,
    ordersToday: 0,
    ordersTotal: 0,
    revenueToday: 0,
    revenueTotal: 0,
    aovToday: 0,
    aovTotal: 0,
    conversionToday: 0,
    conversionTotal: 0,
  });

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

        // Fetch live database conversion analytics
        const resAnalytics = await fetch("/api/admin/analytics");
        if (resAnalytics.ok) {
          const stats = await resAnalytics.json();
          setAnalytics(stats);
        }
      } catch (err) {
        console.error("Failed to fetch admin dashboard statistics:", err);
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
          value={String(analytics.ordersTotal || stats.totalOrders)}
          helper="إجمالي الطلبات الفعلي في قاعدة البيانات"
        />
        <AdminStatCard
          label="Orders Today"
          value={String(analytics.ordersToday)}
          helper={`طلبات اليوم بقيمة ${analytics.revenueToday} جنيه`}
        />
        <AdminStatCard
          label="Visitors Today"
          value={`${analytics.visitorsToday} / ${analytics.visitorsTotal}`}
          helper="الزوار اليوم مقارنة بإجمالي زوار المتجر"
        />
        <AdminStatCard
          label="Conversion Rate"
          value={`${analytics.conversionToday}%`}
          helper={`الإجمالي: ${analytics.conversionTotal}% (من قاعدة البيانات)`}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Revenue Today"
          value={`${analytics.revenueToday} EGP`}
          helper={`إجمالي المبيعات: ${analytics.revenueTotal} EGP`}
        />
        <AdminStatCard
          label="Average Order Value (AOV)"
          value={`${analytics.aovToday} EGP`}
          helper={`متوسط كل الطلبات: ${analytics.aovTotal} EGP`}
        />
        <AdminStatCard
          label="Top Product"
          value={stats.topProduct}
          helper="أعلى منتج طلباً في المتجر حالياً"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-6">
          <h2 className="headline text-2xl text-white">Overview</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            نظام التحليلات متصل الآن بقاعدة بيانات PostgreSQL مباشرة.
            يتم حساب معدل التحويل (Conversion Rate) ومعدلات المبيعات وزيارات الصفحة بشكل حقيقي ودقيق
            بناءً على جلسات الزوار الفريدين (Unique Visitors) المحفوظة في قاعدة البيانات مقارنة بالطلبات الفعلية.
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
              <span>PostgreSQL orders ready</span>
              <span>{analytics.ordersTotal}</span>
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
