import { NextRequest, NextResponse } from "next/server";
import { getAllAdminProducts, createAdminProduct } from "@/src/lib/server/admin-products";

export async function GET() {
  try {
    const products = await getAllAdminProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin Products GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await createAdminProduct(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin Products POST Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}
