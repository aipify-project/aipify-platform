import "server-only";

import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";
import {
  filterAndRankPublicSiteIndexHits,
  focusPublicSiteIndexQuery,
  type PublicSiteIndexHit,
} from "./answer";
import {
  expandPublicSiteIndexSearchLocales,
  mergePublicSiteIndexHitsByChunkId,
  normalizePublicSiteIndexLocaleTag,
} from "./locale-contract";

export const PUBLIC_SITE_INDEX_SEARCH_RPC = "search_tenant_public_site_index" as const;

export type PublicSiteIndexSearchRpcParams = {
  p_install_id: string | null;
  p_domain: string | null;
  p_locale: string;
  p_query: string;
  p_limit: number;
};

export type PublicSiteIndexSearchRpc = (
  params: PublicSiteIndexSearchRpcParams,
) => Promise<{ data: unknown; error: unknown }>;

function mapRow(row: Record<string, unknown>): PublicSiteIndexHit | null {
  const documentId = typeof row.document_id === "string" ? row.document_id : null;
  const chunkId = typeof row.chunk_id === "string" ? row.chunk_id : null;
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const canonicalUrl = typeof row.canonical_url === "string" ? row.canonical_url.trim() : "";
  const pathname = typeof row.pathname === "string" ? row.pathname.trim() : "";
  const chunkContent =
    typeof row.chunk_content === "string" ? row.chunk_content.trim() : "";
  const excerpt = typeof row.excerpt === "string" ? row.excerpt.trim() : "";

  if (!documentId || !chunkId || (!title && !chunkContent && !excerpt)) {
    return null;
  }

  return {
    documentId,
    chunkId,
    title: title || pathname || "Public page",
    canonicalUrl,
    pathname,
    locale: typeof row.locale === "string" ? row.locale : "no",
    excerpt,
    chunkContent,
    score: typeof row.score === "number" ? row.score : Number(row.score ?? 0) || 0,
    matchedReason: typeof row.matched_reason === "string" ? row.matched_reason : null,
    crawledAt: typeof row.crawled_at === "string" ? row.crawled_at : null,
  };
}

function defaultPublicSiteIndexSearchRpc(
  params: PublicSiteIndexSearchRpcParams,
): Promise<{ data: unknown; error: unknown }> {
  const client = createPublicAnonSupabaseClient();
  return client.rpc(PUBLIC_SITE_INDEX_SEARCH_RPC, params);
}

export async function searchTenantPublicSiteIndex(
  input: {
    installId?: string | null;
    domain?: string | null;
    locale: string;
    query: string;
    limit?: number;
  },
  options?: {
    rpc?: PublicSiteIndexSearchRpc;
  },
): Promise<PublicSiteIndexHit[]> {
  const limit = Math.max(1, Math.min(input.limit ?? 5, 8));
  const originalQuery = input.query.trim();
  const focusedQuery = focusPublicSiteIndexQuery(originalQuery);
  // Fetch a slightly wider window so client topic re-rank can demote boilerplate.
  const fetchLimit = Math.min(8, Math.max(limit, 6));
  const searchLocales = expandPublicSiteIndexSearchLocales(input.locale);
  const rpc = options?.rpc ?? defaultPublicSiteIndexSearchRpc;

  const windows: PublicSiteIndexHit[][] = [];
  for (const locale of searchLocales) {
    const { data, error } = await rpc({
      p_install_id: input.installId ?? null,
      p_domain: input.domain ?? null,
      p_locale: normalizePublicSiteIndexLocaleTag(locale),
      p_query: focusedQuery,
      p_limit: fetchLimit,
    });

    if (error || !Array.isArray(data)) {
      continue;
    }

    windows.push(
      data
        .map((row) => mapRow(row as Record<string, unknown>))
        .filter((row): row is PublicSiteIndexHit => row !== null),
    );
  }

  const mapped = mergePublicSiteIndexHitsByChunkId(windows);
  return filterAndRankPublicSiteIndexHits(mapped, originalQuery).slice(0, limit);
}
