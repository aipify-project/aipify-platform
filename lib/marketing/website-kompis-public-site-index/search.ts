import "server-only";

import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";
import type { PublicSiteIndexHit } from "./answer";

export const PUBLIC_SITE_INDEX_SEARCH_RPC = "search_tenant_public_site_index" as const;

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

export async function searchTenantPublicSiteIndex(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
  query: string;
  limit?: number;
}): Promise<PublicSiteIndexHit[]> {
  const client = createPublicAnonSupabaseClient();
  const { data, error } = await client.rpc(PUBLIC_SITE_INDEX_SEARCH_RPC, {
    p_install_id: input.installId ?? null,
    p_domain: input.domain ?? null,
    p_locale: input.locale,
    p_query: input.query.trim(),
    p_limit: input.limit ?? 5,
  });

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data
    .map((row) => mapRow(row as Record<string, unknown>))
    .filter((row): row is PublicSiteIndexHit => row !== null);
}
