export const trackMetaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
};

type TrackPurchaseParams = {
  order: { id?: string | number };
  product: { id: string | number; name: string };
  quantity: number;
  total: number;
};

export const trackPurchaseEvent = ({
  order,
  product,
  quantity,
  total,
}: TrackPurchaseParams) => {
  if (typeof window === 'undefined') return;

  let eventId = '';
  let storageKey = '';

  if (order && order.id) {
    eventId = `purchase_${order.id}`;
    storageKey = `fb_purchase_${order.id}`;
  } else {
    // Fallback if order.id is not available
    const fallbackId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
    eventId = `purchase_${fallbackId}`;
    storageKey = `fb_purchase_${fallbackId}`;
  }

  // Prevent duplicate purchase events for the same order
  if (sessionStorage.getItem(storageKey)) {
    console.log(`[Meta Pixel] Purchase event for order ${eventId} already tracked. Skipping.`);
    return;
  }

  const currency = "EGP".trim().toUpperCase();

  if (typeof window.fbq === "function") {
    window.fbq(
      "track",
      "Purchase",
      {
        value: total,
        currency: "EGP",
        content_name: product.name,
        content_ids: [String(product.id)],
        content_type: "product",
        num_items: quantity,
      },
      {
        eventID: eventId,
      }
    );
    // Mark as tracked in sessionStorage to prevent duplicate event on reload/refresh
    sessionStorage.setItem(storageKey, "true");
    console.log(`[Meta Pixel] Tracked Purchase event successfully:`, { eventId, total, currency: "EGP", productName: product.name });
  } else {
    console.warn('[Meta Pixel] fbq is not loaded or available on window.');
  }
};
