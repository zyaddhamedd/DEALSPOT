import { NextRequest, NextResponse } from "next/server";
import { updateAdminProduct, deleteAdminProduct } from "@/src/lib/server/admin-products";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateAdminProduct(id, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin Product PUT Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteAdminProduct(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin Product DELETE Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}
