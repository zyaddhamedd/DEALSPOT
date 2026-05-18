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
          glowColor="blue"
        />
        <AdminStatCard
          label="Orders Today"
          value={String(analytics.ordersToday)}
          helper={`طلبات اليوم بقيمة ${analytics.revenueToday} جنيه`}
          glowColor="cyan"
          pulse={analytics.ordersToday > 0}
        />
        <AdminStatCard
          label="Visitors Today"
          value={`${analytics.visitorsToday} / ${analytics.visitorsTotal}`}
          helper="الزوار اليوم مقارنة بإجمالي زوار المتجر"
          glowColor="purple"
        />
        <AdminStatCard
          label="Conversion Rate"
          value={`${analytics.conversionToday}%`}
          helper={`الإجمالي: ${analytics.conversionTotal}% (من قاعدة البيانات)`}
          glowColor="green"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Revenue Today"
          value={`${analytics.revenueToday} EGP`}
          helper={`إجمالي المبيعات: ${analytics.revenueTotal} EGP`}
          glowColor="amber"
          pulse={analytics.revenueToday > 0}
        />
        <AdminStatCard
          label="Average Order Value (AOV)"
          value={`${analytics.aovToday} EGP`}
          helper={`متوسط كل الطلبات: ${analytics.aovTotal} EGP`}
          glowColor="amber"
        />
        <AdminStatCard
          label="Top Product"
          value={stats.topProduct}
          helper="أعلى منتج طلباً في المتجر حالياً"
          glowColor="red"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="cockpit-panel p-6">
          <div className="radar-scan hidden md:block opacity-[0.05]"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_var(--cockpit-blue)]"></div>
            <h2 className="text-xl font-bold cockpit-digital-font cockpit-neon-blue tracking-wide uppercase">System Overview</h2>
          </div>
          <p className="max-w-2xl text-xs font-mono leading-loose text-white/70">
            نظام التحليلات متصل الآن بقاعدة بيانات PostgreSQL مباشرة.
            يتم حساب معدل التحويل (Conversion Rate) ومعدلات المبيعات وزيارات الصفحة بشكل حقيقي ودقيق
            بناءً على جلسات الزوار الفريدين (Unique Visitors) المحفوظة في قاعدة البيانات مقارنة بالطلبات الفعلية.
          </p>
        </div>

        <div className="cockpit-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${ready ? "bg-green-500 shadow-[0_0_8px_var(--cockpit-green)] animate-blink" : "bg-red-500 shadow-[0_0_8px_var(--cockpit-red)]"}`}></div>
              <h2 className="text-xl font-bold cockpit-digital-font tracking-wide uppercase text-white">Diagnostics</h2>
            </div>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">Live</span>
          </div>
          <div className="space-y-4 text-xs font-mono text-white/70">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="uppercase tracking-wider">Active products</span>
              <span className="cockpit-neon-cyan cockpit-digital-font text-sm">{stats.activeProducts}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="uppercase tracking-wider">PostgreSQL orders ready</span>
              <span className="cockpit-neon-cyan cockpit-digital-font text-sm">{analytics.ordersTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wider">UI hydrated</span>
              <span className={`cockpit-digital-font text-sm ${ready ? "text-green-400" : "text-amber-400"}`}>{ready ? "ONLINE" : "BOOTING..."}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
