"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/marketing/analytics";

const MILESTONES = [25, 50, 75, 90] as const;

export default function MarketingScrollTracker() {
  useEffect(() => {
    const seen = new Set<number>();

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;

      const pct = Math.round((window.scrollY / max) * 100);
      for (const milestone of MILESTONES) {
        if (pct >= milestone && !seen.has(milestone)) {
          seen.add(milestone);
          trackEvent("scroll_depth", { depth: milestone });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
