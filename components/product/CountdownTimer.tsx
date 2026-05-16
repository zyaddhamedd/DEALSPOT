"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  productSlug: string;
  durationMs?: number; // default 2 hours
  variant?: "bar" | "card"; // bar = compact urgency bar style, card = big display
};

function getOrSetExpiry(slug: string, durationMs: number): number {
  if (typeof window === "undefined") return Date.now() + durationMs;
  const key = `dealspot_timer_${slug}`;
  const stored = window.localStorage.getItem(key);
  if (stored) {
    const expiry = Number(stored);
    if (!isNaN(expiry) && expiry > Date.now()) return expiry;
  }
  const expiry = Date.now() + durationMs;
  window.localStorage.setItem(key, String(expiry));
  return expiry;
}

function formatTime(ms: number) {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export function CountdownTimer({
  productSlug,
  durationMs = 2 * 60 * 60 * 1000,
  variant = "card",
}: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(durationMs);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setMounted(true);
    const expiry = getOrSetExpiry(productSlug, durationMs);

    const tick = () => {
      const left = expiry - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setExpired(true);
        // Soft reset: give 30 more mins
        const newExpiry = Date.now() + 30 * 60 * 1000;
        window.localStorage.setItem(`dealspot_timer_${productSlug}`, String(newExpiry));
      } else {
        setRemaining(left);
        setExpired(false);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [productSlug, durationMs]);

  // Don't render until client-side to avoid hydration mismatch
  if (!mounted) return null;

  const { h, m, s } = formatTime(remaining);

  if (variant === "bar") {
    return (
      <span className="timer-block" aria-live="polite" aria-label="العد التنازلي">
        <span className="timer-digit">{h}</span>
        <span className="timer-sep">:</span>
        <span className="timer-digit">{m}</span>
        <span className="timer-sep">:</span>
        <span className="timer-digit">{s}</span>
      </span>
    );
  }

  // Card variant
  return (
    <div
      className="card"
      style={{
        padding: "16px 20px",
        background: "#fff8f8",
        borderColor: "#fecaca",
      }}
    >
      <p
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "#e11d2f",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {expired ? "العرض قرب يخلص 🔥" : "العرض ينتهي خلال"}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {[h, m, s].map((unit, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontFamily: "'Cairo', monospace",
                fontSize: 28,
                fontWeight: 900,
                color: "#111",
                background: "white",
                border: "1.5px solid #fecaca",
                borderRadius: 10,
                minWidth: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: 1,
              }}
            >
              {unit}
            </span>
            {i < 2 && (
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#e11d2f",
                  opacity: 0.7,
                }}
              >
                :
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
