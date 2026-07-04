import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

/** Capability/help questions ask what Aipify or Companion can do — never lightweight smalltalk. */
export function isCapabilityHelpQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;

  if (!/\b(aipify|companion)\b/i.test(normalized)) return false;

  return (
    (/\b(hva kan|what can|how can|hvordan kan)\b/i.test(normalized) &&
      /\b(hjelpe|help|assist|assistere|støtte|support)\b/i.test(normalized)) ||
    /\b(how can|how does)\b.*\b(aipify|companion)\b.*\b(help|assist)\b/i.test(normalized)
  );
}
