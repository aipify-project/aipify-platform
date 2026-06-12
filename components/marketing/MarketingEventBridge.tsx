"use client";

import { useEffect } from "react";
import type { MarketingEventName } from "@/lib/marketing/analytics";
import { trackEvent } from "@/lib/marketing/analytics";

export default function MarketingEventBridge() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest("[data-aipify-event]");
      if (!target) return;

      const name = target.getAttribute("data-aipify-event") as MarketingEventName | null;
      const label = target.getAttribute("data-aipify-label") ?? undefined;
      if (name) trackEvent(name, { label });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
