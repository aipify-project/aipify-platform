import { shortenTechnicalId } from "@/lib/companion-action-approval/presentation";

export function isGenericKompisHistoryTitle(title: string | null | undefined): boolean {
  const value = String(title ?? "").trim();
  return !value || /^kompis$/i.test(value) || /^activity summary$/i.test(value);
}

/**
 * Prefer a concrete conversation/run title over the generic default "Kompis".
 */
export function resolveKompisHistoryTitle(input: {
  title?: string | null;
  latestRequestText?: string | null;
  latestResultSummary?: string | null;
  latestToolKey?: string | null;
  toolLabel?: string | null;
  fallback: string;
}): string {
  const title = String(input.title ?? "").trim();
  if (!isGenericKompisHistoryTitle(title)) return title;

  const toolLabel = String(input.toolLabel ?? "").trim();
  if (toolLabel) return toolLabel;

  const request = String(input.latestRequestText ?? "").trim();
  if (request) return request.length > 72 ? `${request.slice(0, 72)}…` : request;

  const summary = String(input.latestResultSummary ?? "").trim();
  if (summary && !/^loaded \d+/i.test(summary)) {
    return summary.length > 72 ? `${summary.slice(0, 72)}…` : summary;
  }

  return input.fallback;
}

export function formatKompisAuditReference(id: string | null | undefined): string {
  return shortenTechnicalId(id, 8);
}
