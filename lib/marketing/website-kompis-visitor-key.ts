/** Browser-only visitor key for public Website Kompis feedback binding. */

export const WEBSITE_KOMPIS_VISITOR_KEY_STORAGE = "aipify.wk.visitor.v1" as const;

function createVisitorKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `wk-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function readOrCreateWebsiteKompisVisitorKey(): string {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return createVisitorKey();
  }
  try {
    const existing = window.sessionStorage.getItem(WEBSITE_KOMPIS_VISITOR_KEY_STORAGE);
    if (existing && existing.trim().length >= 8) {
      return existing.trim();
    }
    const next = createVisitorKey();
    window.sessionStorage.setItem(WEBSITE_KOMPIS_VISITOR_KEY_STORAGE, next);
    return next;
  } catch {
    return createVisitorKey();
  }
}
