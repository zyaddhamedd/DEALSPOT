"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Exclude admin pages and API endpoints from conversion statistics
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Strict Mode double-render debounce
    if (lastTracked.current === pathname) {
      return;
    }
    lastTracked.current = pathname;

    // Retrieve or initialize unique visitor ID
    let visitorId = localStorage.getItem("dealspot_visitor_id");
    if (!visitorId) {
      visitorId = "vis_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("dealspot_visitor_id", visitorId);
    }

    // SessionStorage duplicate visit prevention (refreshes/history navigation)
    const sessionKey = `dealspot_visit_tracked_${pathname}`;
    const sessionTracked = sessionStorage.getItem(sessionKey);
    if (sessionTracked === "true") {
      return;
    }

    const logVisit = async () => {
      try {
        const res = await fetch("/api/analytics/visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            pathname,
            referrer: typeof document !== "undefined" ? document.referrer : "",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            sessionStorage.setItem(sessionKey, "true");
          }
        }
      } catch (err) {
        console.warn("[Analytics Warning] Failed to log visit:", err);
      }
    };

    void logVisit();
  }, [pathname]);

  return null;
}
