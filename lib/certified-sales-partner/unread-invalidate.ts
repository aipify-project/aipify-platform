/**
 * Lightweight same-tab bus so mark-read / send flows refresh unread badges
 * without restarting polling timers or waiting a full interval.
 * No cross-tab broadcast — polling + visibility still cover that.
 */

export const CSP_UNREAD_INVALIDATE_EVENT = "aipify:csp-unread-invalidate";

export type CspUnreadInvalidateDetail = {
  /** Partner portal topbar / notifications. */
  partner?: boolean;
  /** Platform seller alerts menu. */
  platform?: boolean;
};

const bus: EventTarget =
  typeof window !== "undefined" && typeof window.dispatchEvent === "function"
    ? window
    : new EventTarget();

export function invalidateCspUnreadBadges(
  detail: CspUnreadInvalidateDetail = { partner: true, platform: true },
): void {
  bus.dispatchEvent(
    new CustomEvent<CspUnreadInvalidateDetail>(CSP_UNREAD_INVALIDATE_EVENT, { detail }),
  );
}

export function subscribeCspUnreadInvalidate(
  handler: (detail: CspUnreadInvalidateDetail) => void,
): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<CspUnreadInvalidateDetail>).detail ?? {};
    handler(detail);
  };
  bus.addEventListener(CSP_UNREAD_INVALIDATE_EVENT, listener);
  return () => bus.removeEventListener(CSP_UNREAD_INVALIDATE_EVENT, listener);
}
