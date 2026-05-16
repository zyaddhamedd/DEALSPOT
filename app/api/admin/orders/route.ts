import { NextResponse } from "next/server";
import { getAllAdminOrders } from "@/src/lib/server/admin-orders";

export async function GET() {
  try {
    const orders = await getAllAdminOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin Orders GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
