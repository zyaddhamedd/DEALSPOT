"use client";

import { CountdownTimer } from "@/components/product/CountdownTimer";
import { formatPrice } from "@/lib/utils";

type ProductInfoCardProps = {
  name: string;
  description: string;
  price: number;
  salePrice: number;
  productSlug: string;
};

const trustChips = [
  { icon: "💳", label: "دفع عند الاستلام" },
  { icon: "👟", label: "استبدال مقاس" },
  { icon: "⚡", label: "تأكيد سريع" },
  { icon: "🌟", label: "خامة مريحة" },
];

export function ProductInfoCard({
  name,
  description,
  price,
  salePrice,
  productSlug,
}: ProductInfoCardProps) {
  const savePct = price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Name + price */}
      <div
        className="card"
        style={{ padding: "20px 20px 16px" }}
      >
        {/* Tag */}
        <span
          className="section-badge"
          style={{ marginBottom: 10, display: "inline-flex" }}
        >
          <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#e11d2f" }} />
          عرض محدود
        </span>

        {name === "...Loading" ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-3/4 rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-5/6 rounded bg-gray-100" />
            </div>
            <div className="h-10 w-32 rounded-xl bg-gray-200" />
          </div>
        ) : (
          <>
            <h1
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 22,
                fontWeight: 900,
                color: "#111",
                lineHeight: 1.3,
                margin: "8px 0 4px",
              }}
            >
              {name}
            </h1>

            <div style={{ margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {description
                .split("\n")
                .map((line) => line.trimEnd())
                .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
                .map((line, index) => {
                  const isEmpty = line.trim() === "";
                  const isHeader =
                    !isEmpty &&
                    (line.trimStart().endsWith(":") ||
                      /^[\u0600-\u06FF\w\s]+\s*:/.test(line.trimStart()) &&
                      line.trim().length < 60);
                  const isBullet =
                    !isEmpty && (line.includes("✓") || line.trimStart().startsWith("-") || line.trimStart().startsWith("•"));

                  if (isEmpty) {
                    return <div key={index} style={{ height: 4 }} />;
                  }

                  if (isHeader) {
                    return (
                      <p
                        key={index}
                        style={{
                          fontFamily: "'Cairo', sans-serif",
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#111",
                          lineHeight: 1.5,
                          margin: 0,
                          paddingTop: index > 0 ? 4 : 0,
                        }}
                      >
                        {line}
                      </p>
                    );
                  }

                  if (isBullet) {
                    return (
                      <p
                        key={index}
                        style={{
                          fontFamily: "'Cairo', sans-serif",
                          fontSize: 12,
                          color: "#374151",
                          lineHeight: 1.65,
                          margin: 0,
                          paddingRight: 8,
                          borderRight: "2px solid #fecaca",
                        }}
                      >
                        {line}
                      </p>
                    );
                  }

                  return (
                    <p
                      key={index}
                      style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: 13,
                        color: "#6b7280",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {line}
                    </p>
                  );
                })}
            </div>

            {/* Price row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#111",
                  lineHeight: 1,
                }}
              >
                {formatPrice(salePrice)}
                <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 700, marginRight: 4, color: "#374151" }}> ج.م</span>
              </span>

              {price > salePrice && (
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: 15,
                    color: "#9ca3af",
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(price)}
                  <span style={{ fontFamily: "'Cairo', sans-serif", marginRight: 4 }}> ج.م</span>
                </span>
              )}

              {savePct > 0 && (
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "white",
                    background: "#e11d2f",
                    borderRadius: 100,
                    padding: "3px 10px",
                  }}
                >
                  <span style={{ fontFamily: "'Cairo', sans-serif" }}>وفّر </span>
                  {savePct}%
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Countdown timer */}
      <CountdownTimer productSlug={productSlug} variant="card" />

      {/* Trust chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
        }}
        className="scrollbar-hide"
      >
        {trustChips.map((chip) => (
          <div key={chip.label} className="trust-chip">
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
