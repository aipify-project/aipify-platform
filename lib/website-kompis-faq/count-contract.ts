export type FaqCountSiteScope = "tenant" | "single_site" | "multi_site";

export function faqCountSiteScope(
  state: string,
  installId: string | null,
): { scope: FaqCountSiteScope; installId: string | null } | null {
  if (state === "no_sites") return { scope: "tenant", installId: null };
  if (state === "single_site" && installId) return { scope: "single_site", installId };
  if (state === "multi_site" && installId) return { scope: "multi_site", installId };
  return null;
}

export function faqCountContractMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = error.message ?? "";
  return (
    error.code === "PGRST202" ||
    /does not exist/i.test(message) ||
    /could not find the function/i.test(message)
  );
}

export function parseFaqCountTotal(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const total = (data as { total?: unknown }).total;
  if (typeof total !== "number" || !Number.isInteger(total) || total < 0) return null;
  return total;
}

export type FaqCountBreakdown = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  draftPublicSafe: number;
  draftNeedsReview: number;
};

function readCount(data: Record<string, unknown>, key: string): number | null {
  const value = data[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return null;
  return value;
}

/** Status totals from the installed count function. A total-only payload is not a library breakdown. */
export function parseFaqCountBreakdown(data: unknown): FaqCountBreakdown | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const total = parseFaqCountTotal(data);
  const published = readCount(row, "published");
  const draft = readCount(row, "draft");
  const archived = readCount(row, "archived");
  const draftPublicSafe = readCount(row, "draftPublicSafe");
  const draftNeedsReview = readCount(row, "draftNeedsReview");
  if (
    total == null ||
    published == null ||
    draft == null ||
    archived == null ||
    draftPublicSafe == null ||
    draftNeedsReview == null
  ) {
    return null;
  }
  return { total, published, draft, archived, draftPublicSafe, draftNeedsReview };
}
