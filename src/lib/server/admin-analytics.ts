import { db } from "@/src/db";
import { orders, analyticsVisits } from "@/src/db/schema";
import { gte, sql } from "drizzle-orm";

export async function getAdminAnalytics() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 1. Aggregated unique visitor counts
  const [visitorsTodayRes] = await db
    .select({ count: sql<number>`count(distinct ${analyticsVisits.visitorId})` })
    .from(analyticsVisits)
    .where(gte(analyticsVisits.createdAt, startOfToday));
  const visitorsToday = Number(visitorsTodayRes?.count) || 0;

  const [visitorsTotalRes] = await db
    .select({ count: sql<number>`count(distinct ${analyticsVisits.visitorId})` })
    .from(analyticsVisits);
  const visitorsTotal = Number(visitorsTotalRes?.count) || 0;

  // 2. Aggregated orders count
  const [ordersTodayRes] = await db
    .select({ count: sql<number>`count(${orders.id})` })
    .from(orders)
    .where(gte(orders.createdAt, startOfToday));
  const ordersToday = Number(ordersTodayRes?.count) || 0;

  const [ordersTotalRes] = await db
    .select({ count: sql<number>`count(${orders.id})` })
    .from(orders);
  const ordersTotal = Number(ordersTotalRes?.count) || 0;

  // 3. Aggregated revenue sums
  const [revenueTodayRes] = await db
    .select({ sum: sql<string>`sum(${orders.totalAmount})` })
    .from(orders)
    .where(gte(orders.createdAt, startOfToday));
  const revenueToday = Number(revenueTodayRes?.sum) || 0;

  const [revenueTotalRes] = await db
    .select({ sum: sql<string>`sum(${orders.totalAmount})` })
    .from(orders);
  const revenueTotal = Number(revenueTotalRes?.sum) || 0;

  // 4. Conversion and Average Order Value calculations
  const aovToday = ordersToday > 0 ? (revenueToday / ordersToday) : 0;
  const aovTotal = ordersTotal > 0 ? (revenueTotal / ordersTotal) : 0;

  const conversionToday = visitorsToday > 0 ? ((ordersToday / visitorsToday) * 100) : 0;
  const conversionTotal = visitorsTotal > 0 ? ((ordersTotal / visitorsTotal) * 100) : 0;

  return {
    visitorsToday,
    visitorsTotal,
    ordersToday,
    ordersTotal,
    revenueToday,
    revenueTotal,
    aovToday: Number(aovToday.toFixed(2)),
    aovTotal: Number(aovTotal.toFixed(2)),
    conversionToday: Number(conversionToday.toFixed(2)),
    conversionTotal: Number(conversionTotal.toFixed(2)),
  };
}
