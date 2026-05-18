import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Secure SHA-256 Hashing Helper
function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Egypt-focused phone number normalization
function normalizePhone(phone: string): string {
  let clean = phone.replace(/\D/g, "");
  // Standardize Egypt mobile numbers to international format (prefixing with 2)
  if (clean.startsWith("01") && clean.length === 11) {
    clean = "2" + clean;
  } else if (clean.startsWith("1") && clean.length === 10) {
    clean = "20" + clean;
  }
  return clean;
}

// Dynamic cookie retrieval helper
function getCookie(cookieString: string | null, name: string): string | null {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

type CAPIPurchaseParams = {
  request: Request;
  order: { id: string; totalAmount: string };
  payload: {
    fullName: string;
    phone: string;
    governorate: string;
    address: string;
    quantity: number;
    productSlug: string;
  };
};

export async function sendMetaCAPIPurchaseEvent({
  request,
  order,
  payload,
}: CAPIPurchaseParams) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_GRAPH_API_VERSION || "v20.0";
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    console.warn("[Meta CAPI Warning] META_PIXEL_ID or META_ACCESS_TOKEN is missing in environmental variables. Skipping CAPI event.");
    return;
  }

  // 1. Fetch authentic product info from DB using client productSlug to ensure metadata integrity
  const dbProduct = await db.query.products.findFirst({
    where: eq(products.slug, payload.productSlug),
  });

  if (!dbProduct) {
    console.warn(`[Meta CAPI Warning] Product with slug ${payload.productSlug} not found in DB. Skipping CAPI event.`);
    return;
  }

  // 2. Parse client IP and User Agent from request headers
  const userAgent = request.headers.get("user-agent") || "";
  
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  let clientIp = "";
  if (xForwardedFor) {
    // Retrieve the first IP address from the x-forwarded-for list
    const parts = xForwardedFor.split(",");
    clientIp = parts[0].trim();
  } else if (xRealIp) {
    clientIp = xRealIp.trim();
  } else if (cfConnectingIp) {
    clientIp = cfConnectingIp.trim();
  }

  // 3. Extract FBP and FBC cookies from client request headers
  const cookieHeader = request.headers.get("cookie");
  const fbp = getCookie(cookieHeader, "_fbp");
  const fbc = getCookie(cookieHeader, "_fbc");

  // 4. Hash user data defensively (phone is mandatory and must be SHA-256 hashed)
  const normalizedPhone = normalizePhone(payload.phone);
  const hashedPhone = normalizedPhone ? sha256(normalizedPhone) : "";

  // 5. Structure payload parameters
  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = `purchase_${order.id}`;

  const userData: Record<string, any> = {};
  if (hashedPhone) userData.ph = [hashedPhone];
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const total = Number(order.totalAmount) || 0;

  const customData = {
    currency: "EGP",
    value: total,
    content_ids: [dbProduct.id],
    content_type: "product",
    content_name: dbProduct.name,
    num_items: payload.quantity || 1,
  };

  const capiPayload = {
    data: [
      {
        event_name: "Purchase",
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        event_source_url: request.url || "",
        user_data: userData,
        custom_data: customData,
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  // 6. Perform POST request with AbortController timeout (2000ms limit)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(capiPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      console.warn(
        `[Meta CAPI Warning] Request failed with status ${response.status}:`,
        errorJson.error?.message || "Unknown Meta CAPI Graph API Error"
      );
    } else {
      console.log(`[Meta CAPI Success] Server-side Purchase event processed successfully for eventId: ${eventId}`);
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.warn(`[Meta CAPI Warning] Server-side request timed out after 2000ms for eventId: ${eventId}`);
    } else {
      console.warn(`[Meta CAPI Warning] Non-blocking server failure for eventId ${eventId}:`, error.message);
    }
  }
}
