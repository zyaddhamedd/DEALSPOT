"use client";

import Link from "next/link";

type ProductNavbarProps = {
  onOrderClick: () => void;
};

export function ProductNavbar({ onOrderClick }: ProductNavbarProps) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        maxWidth: "100vw",
      }}
    >
      {/* Logo — right side for RTL */}
      <Link
        href="/"
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 22,
          fontWeight: 900,
          color: "#111",
          letterSpacing: "-0.02em",
          textDecoration: "none",
        }}
      >
        Deal<span style={{ color: "#e11d2f" }}>Spot</span>
      </Link>

      {/* CTA — left side for RTL */}
      <button
        type="button"
        onClick={onOrderClick}
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 12,
          fontWeight: 800,
          color: "#e11d2f",
          background: "#fef2f2",
          border: "1.5px solid #fecaca",
          borderRadius: 100,
          padding: "6px 16px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
      >
        اطلب دلوقتي
      </button>
    </header>
  );
}
