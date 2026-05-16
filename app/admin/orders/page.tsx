import { OrdersTable } from "@/components/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="headline text-3xl text-white">Orders</h2>
        <p className="mt-2 text-sm text-white/60">إدارة الطلبات المرسلة من صفحات المنتجات.</p>
      </div>
      <OrdersTable />
    </div>
  );
}
