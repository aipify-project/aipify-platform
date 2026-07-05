import "server-only";

import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";

export type PublicCompanionTenantFaqAnswer = {
  answer: {
    directAnswer: string;
    explanation: null;
    steps: [];
  };
  actions: [];
  sources: Array<{ title: string; route: string }>;
  confidence: {
    level: "high" | "medium" | "low";
    score: number;
  };
  supportEscalation: { offered: false; reason: null };
  locale: string;
};

export const PUBLIC_COMPANION_TENANT_FAQ_RPC = "search_tenant_public_visitor_knowledge" as const;
export const PUBLIC_COMPANION_TENANT_FAQ_MIN_QUERY_LENGTH = 2;
export const PUBLIC_COMPANION_TENANT_FAQ_MIN_RELEVANCE_SCORE = 10;
export const PUBLIC_COMPANION_DOMAIN_MAX_LENGTH = 253;
export const PUBLIC_COMPANION_INSTALL_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type PublicCompanionTenantFaqRow = {
  item_id: string;
  title: string;
  answer: string;
  category: string | null;
  content_type: string;
  locale: string;
  source_url: string | null;
  score: number | null;
  matched_reason: string | null;
};

export type PublicCompanionVisitorContext = {
  installId: string | null;
  domain: string | null;
};

export function sanitizePublicCompanionInstallId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !PUBLIC_COMPANION_INSTALL_ID_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}

export function sanitizePublicCompanionDomain(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  normalized = normalized.replace(/^https?:\/\//i, "");
  normalized = normalized.replace(/\/.*$/, "");
  normalized = normalized.replace(/:\d+$/, "");

  if (!normalized || normalized.length > PUBLIC_COMPANION_DOMAIN_MAX_LENGTH) {
    return null;
  }

  if (!/^[a-z0-9.-]+$/.test(normalized) || normalized.includes("..")) {
    return null;
  }

  return normalized;
}

export function resolvePublicCompanionVisitorContext(input: {
  clientDomain?: string | null;
  requestHost?: string | null;
  installId?: string | null;
}): PublicCompanionVisitorContext {
  const installId = sanitizePublicCompanionInstallId(input.installId ?? null);
  const clientDomain = sanitizePublicCompanionDomain(input.clientDomain ?? null);
  const hostDomain = sanitizePublicCompanionDomain(input.requestHost ?? null);

  return {
    installId,
    domain: clientDomain ?? hostDomain,
  };
}

export function hasPublicCompanionVisitorContext(
  context: PublicCompanionVisitorContext,
): boolean {
  return Boolean(context.installId || context.domain);
}

export function isRelevantPublicCompanionTenantFaqResult(
  rows: PublicCompanionTenantFaqRow[],
  query: string,
): boolean {
  if (rows.length === 0) return false;
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < PUBLIC_COMPANION_TENANT_FAQ_MIN_QUERY_LENGTH) {
    return false;
  }

  const topScore = rows[0]?.score ?? 0;
  return topScore >= PUBLIC_COMPANION_TENANT_FAQ_MIN_RELEVANCE_SCORE;
}

function mapRpcRow(row: Record<string, unknown>): PublicCompanionTenantFaqRow | null {
  const itemId = typeof row.item_id === "string" ? row.item_id : null;
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const answer = typeof row.answer === "string" ? row.answer.trim() : "";
  if (!itemId || !title || !answer) return null;

  return {
    item_id: itemId,
    title,
    answer,
    category: typeof row.category === "string" ? row.category : null,
    content_type: typeof row.content_type === "string" ? row.content_type : "faq",
    locale: typeof row.locale === "string" ? row.locale : "en",
    source_url: typeof row.source_url === "string" ? row.source_url.trim() || null : null,
    score: typeof row.score === "number" ? row.score : Number(row.score ?? 0) || 0,
    matched_reason: typeof row.matched_reason === "string" ? row.matched_reason : null,
  };
}

export async function searchPublicCompanionTenantFaq(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
  query: string;
  pathname?: string | null;
  limit?: number;
}): Promise<PublicCompanionTenantFaqRow[]> {
  const client = createPublicAnonSupabaseClient();
  const { data, error } = await client.rpc(PUBLIC_COMPANION_TENANT_FAQ_RPC, {
    p_install_id: input.installId ?? null,
    p_domain: input.domain ?? null,
    p_locale: input.locale,
    p_query: input.query.trim(),
    p_pathname: input.pathname ?? null,
    p_limit: input.limit ?? 5,
  });

  if (error) {
    return [];
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((row) => mapRpcRow(row as Record<string, unknown>))
    .filter((row): row is PublicCompanionTenantFaqRow => row !== null);
}

function isSafeTenantFaqSourceUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildPublicCompanionTenantFaqResponse(
  rows: PublicCompanionTenantFaqRow[],
  locale: string,
): PublicCompanionTenantFaqAnswer {
  const primary = rows[0];
  const supplemental = rows.slice(1, 3);

  const answerParts = [primary.answer.trim()];
  for (const row of supplemental) {
    const text = row.answer.trim();
    if (text && !answerParts.includes(text)) {
      answerParts.push(text);
    }
  }

  const sources = rows.slice(0, 3).map((row) => ({
    title: row.title,
    route:
      row.source_url && isSafeTenantFaqSourceUrl(row.source_url)
        ? row.source_url
        : `website-kompis-faq:${row.content_type}`,
  }));

  const topScore = primary.score ?? 0;
  const confidenceLevel = topScore >= 40 ? "high" : topScore >= 20 ? "medium" : "low";

  return {
    answer: {
      directAnswer: answerParts.join("\n\n"),
      explanation: null,
      steps: [],
    },
    actions: [],
    sources,
    confidence: {
      level: confidenceLevel,
      score: Math.min(0.95, Math.max(0.25, topScore / 100)),
    },
    supportEscalation: { offered: false, reason: null },
    locale,
  };
}
