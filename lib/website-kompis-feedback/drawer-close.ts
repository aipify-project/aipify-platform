/**
 * One close path for the feedback drawer.
 * A dirty form asks once. The same action again, Escape, or the scrim then closes.
 * Closing never publishes and never removes the feedback row.
 */

export function resolveFeedbackDrawerClose(input: {
  dirty: boolean;
  confirmVisible: boolean;
}): "close" | "confirm" {
  if (!input.dirty || input.confirmVisible) return "close";
  return "confirm";
}

export function existingPublishedFaqHref(faqBase: string, faqId: string, question: string): string {
  const params = new URLSearchParams();
  params.set("edit", faqId);
  const query = question.trim().slice(0, 180);
  if (query) params.set("query", query);
  return `${faqBase}?${params.toString()}`;
}
