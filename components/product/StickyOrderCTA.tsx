"use client";

import { formatPrice } from "@/lib/utils";

type StickyOrderCTAProps = {
  price: number;
  onClick: () => void;
};

export function StickyOrderCTA({ price, onClick }: StickyOrderCTAProps) {
  return (
    <div className="sticky-bottom-bar md:hidden">
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Price */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#9ca3af",
              marginBottom: 2,
            }}
          >
            السعر
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 20,
                fontWeight: 900,
                color: "#111",
              }}
            >
              {formatPrice(price)}
            </span>
            <span
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#6b7280",
              }}
            >
              ج.م
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onClick}
          className="btn-red"
          style={{ flex: 1, fontSize: 15 }}
        >
          اطلب دلوقتي 🔥
        </button>
      </div>
    </div>
  );
}
