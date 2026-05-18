import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/src/lib/server/orders";
import { sendMetaCAPIPurchaseEvent } from "@/src/lib/server/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // The payload coming from the client might need the productSlug
    // We expect the body to contain the OrderPayload + productSlug
    const order = await createOrder(body);

    // Fire-and-forget server-side CAPI Purchase event tracking in the background
    sendMetaCAPIPurchaseEvent({
      request,
      order,
      payload: body,
    }).catch((err) => {
      console.warn("[Meta CAPI Warning] Fire-and-forget background CAPI event failed:", err.message);
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      },
      { status: 400 }
    );
  }
}
