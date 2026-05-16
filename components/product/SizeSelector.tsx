"use client";

import { useRef } from "react";

type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
  hasError?: boolean;
};

export function SizeSelector({ sizes, selectedSize, onChange, hasError }: SizeSelectorProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      id="size-selector"
      className="card"
      style={{
        padding: "20px",
        border: hasError ? "2px solid #e11d2f" : undefined,
        transition: "border 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: "#111",
          }}
        >
          اختار مقاسك
        </p>
        <span
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          {sizes.length} مقاس متاح
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`size-pill ${selectedSize === size ? "active" : ""} ${hasError && !selectedSize ? "error" : ""}`}
          >
            {size}
          </button>
        ))}
      </div>

      {hasError && !selectedSize && (
        <p
          className="animate-fade-up"
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "#e11d2f",
            marginTop: 10,
          }}
        >
          ⚠️ لازم تختار المقاس الأول
        </p>
      )}
    </div>
  );
}
