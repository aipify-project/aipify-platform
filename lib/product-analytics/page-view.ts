import {
  isAnalyticsConsentAllowed,
  readAnalyticsConsentFromDocument,
  type AnalyticsConsentState,
} from "@/lib/product-analytics/consent";
import { sanitizeAnalyticsPagePath } from "@/lib/product-analytics/events";
import { resolveGaMeasurementId, type Ga4Window } from "@/lib/product-analytics/ga4";

/** Module-scoped dedup survives React Strict Mode remounts for the same path. */
let lastGa4PageViewPath: string | null = null;

export function resetGa4PageViewDedupForTests(): void {
  lastGa4PageViewPath = null;
}

export function shouldSendGa4PageView(pagePath: string): boolean {
  if (lastGa4PageViewPath === pagePath) return false;
  lastGa4PageViewPath = pagePath;
  return true;
}

export type SendGa4PageViewOptions = {
  consent?: AnalyticsConsentState;
  windowLike?: Ga4Window;
  title?: string;
  force?: boolean;
};

/**
 * SPA-safe page_view. Config uses send_page_view:false so this is the single source.
 * Never throws.
 */
export function sendGa4PageView(
  pathname: string,
  search = "",
  options: SendGa4PageViewOptions = {},
): boolean {
  try {
    const pagePath = sanitizeAnalyticsPagePath(pathname, search);
    if (!options.force && !shouldSendGa4PageView(pagePath)) return false;

    const consent = options.consent ?? readAnalyticsConsentFromDocument();
    if (!isAnalyticsConsentAllowed(consent)) return false;

    const measurementId = resolveGaMeasurementId();
    if (!measurementId) return false;

    const windowLike =
      options.windowLike ??
      (typeof window !== "undefined" ? (window as unknown as Ga4Window) : null);
    if (!windowLike || typeof windowLike.gtag !== "function") return false;

    windowLike.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: (options.title ?? (typeof document !== "undefined" ? document.title : "")).slice(
        0,
        120,
      ),
      // Never send raw location.href — query strings may contain sensitive params.
      page_location: pagePath,
      send_to: measurementId,
    });
    return true;
  } catch {
    return false;
  }
}
