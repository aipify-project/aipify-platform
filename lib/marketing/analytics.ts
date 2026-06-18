/** Lightweight marketing analytics scaffold — wire to external SDK when approved. */

export type MarketingEventName =
  | "page_view"
  | "cta_click"
  | "early_access_submit"
  | "book_demo_submit"
  | "growth_partner_signup"
  | "orb_state_change"
  | "demo_step_view"
  | "scroll_depth";

export type MarketingEventPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(
  name: MarketingEventName,
  payload: MarketingEventPayload = {}
): void {
  if (typeof window === "undefined") return;

  const detail = { name, ...payload, ts: Date.now() };

  window.dispatchEvent(new CustomEvent("aipify:marketing", { detail }));

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info("[marketing]", name, payload);
  }
}

export const marketingDataAttr = (event: MarketingEventName, label?: string) => ({
  "data-aipify-event": event,
  ...(label ? { "data-aipify-label": label } : {}),
});
