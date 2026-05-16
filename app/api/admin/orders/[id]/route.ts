import { NextRequest, NextResponse } from "next/server";
import { updateAdminOrderStatus } from "@/src/lib/server/admin-orders";
import { OrderStatus } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateAdminOrderStatus(id, body.status as OrderStatus);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin Order PATCH Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}
