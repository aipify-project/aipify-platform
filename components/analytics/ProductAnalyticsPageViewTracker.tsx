"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAnalyticsConsent } from "@/components/analytics/AnalyticsConsentProvider";
import { sendGa4PageView } from "@/lib/product-analytics/page-view";

/**
 * Records GA4 page_view on App Router navigations without full reloads.
 * Dedupes identical paths; respects consent. Failures never block UI.
 */
export default function ProductAnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { consent, isAnalyticsAllowed } = useAnalyticsConsent();

  useEffect(() => {
    if (!isAnalyticsAllowed || !pathname) return;
    const search = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    sendGa4PageView(pathname, search, { consent });

    // Lightweight module_view for APP module routes — path segments only, no PII.
    if (pathname.startsWith("/app/")) {
      const segment = pathname.split("/").filter(Boolean)[1];
      if (segment && segment !== "command-center" && segment !== "settings") {
        void import("@/lib/product-analytics/track").then(({ trackModuleView }) => {
          trackModuleView(segment, "app");
        });
      }
    }
  }, [pathname, searchParams, consent, isAnalyticsAllowed]);

  return null;
}
