"use client";

import { useEffect, useMemo, useState } from "react";
import { exportOrdersToCsv, loadOrders, updateOrderStatus } from "@/lib/storage";
import { Order, OrderStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const statusOptions: OrderStatus[] = ["New", "Confirmed", "Sent to supplier", "Cancelled"];

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return orders;
    }

    return orders.filter((order) =>
      [order.fullName, order.phone, order.productName].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [orders, query]);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const nextOrders = updateOrderStatus(orderId, status);
    setOrders(nextOrders);
    setSelectedOrder(nextOrders.find((order) => order.id === orderId) || null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <input
          className="field max-w-xl"
          placeholder="Search by phone / name / product"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="button" onClick={() => exportOrdersToCsv(filteredOrders)} className="btn-secondary">
          Export CSV
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="panel p-10 text-center text-white/65">
          لا توجد طلبات حتى الآن. اطلب من صفحات المنتجات لتجربة التدفق.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm text-white/80">
              <thead className="bg-white/5 text-white/45">
                <tr>
                  <th className="px-4 py-4">العميل</th>
                  <th className="px-4 py-4">المنتج</th>
                  <th className="px-4 py-4">اللون</th>
                  <th className="px-4 py-4">المقاس</th>
                  <th className="px-4 py-4">الحالة</th>
                  <th className="px-4 py-4">التاريخ</th>
                  <th className="px-4 py-4">تفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{order.fullName}</div>
                      <div className="text-xs text-white/55">{order.phone}</div>
                    </td>
                    <td className="px-4 py-4">{order.productName}</td>
                    <td className="px-4 py-4">{order.color}</td>
                    <td className="px-4 py-4">{order.size}</td>
                    <td className="px-4 py-4">
                      <select
                        className="field min-w-40 py-2"
                        value={order.status}
                        onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} className="bg-black">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-white/60">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => setSelectedOrder(order)} className="btn-secondary px-4 py-2">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#111111] p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="headline text-2xl text-white">Order Detail</h3>
                <p className="mt-2 text-sm text-white/50">{selectedOrder.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="btn-secondary px-4 py-2">
                Close
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel p-4">
                <p className="text-xs text-white/45">Customer</p>
                <p className="mt-2 font-semibold text-white">{selectedOrder.fullName}</p>
                <p className="mt-1 text-sm text-white/65">{selectedOrder.phone}</p>
              </div>

              <div className="panel p-4">
                <p className="text-xs text-white/45">Product</p>
                <p className="mt-2 font-semibold text-white">{selectedOrder.productName}</p>
                <p className="mt-1 text-sm text-white/65">
                  Color {selectedOrder.color} / Size {selectedOrder.size} / Qty {selectedOrder.quantity}
                </p>
              </div>

              <div className="panel p-4 sm:col-span-2">
                <p className="text-xs text-white/45">Address</p>
                <p className="mt-2 text-sm leading-7 text-white/75">
                  {selectedOrder.governorate} - {selectedOrder.address}
                </p>
              </div>

              <div className="panel p-4 sm:col-span-2">
                <p className="text-xs text-white/45">Notes</p>
                <p className="mt-2 text-sm leading-7 text-white/75">{selectedOrder.notes || "No notes"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
