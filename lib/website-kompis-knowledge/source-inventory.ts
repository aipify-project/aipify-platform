/**
 * Job 65 — Website Kompis Knowledge Center source inventory (presentation contract).
 * No new schema; honest capability flags for APP UI.
 */

export const WEBSITE_KOMPIS_KNOWLEDGE_CENTER_VERSION = "65.1";

export type KnowledgeSourceCapability =
  | "full_app_read_write"
  | "app_read_signals_only"
  | "unavailable_needs_list_rpc"
  | "unavailable_not_in_product"
  | "platform_operator_only";

export type KnowledgeSourceInventoryRow = {
  id: "faq" | "public_pages" | "public_documents" | "answer_feedback" | "domain_connection";
  authoritative: string;
  readPath: string;
  writePath: string;
  tenantGate: string;
  statuses: string[];
  usedByFrozenRuntime: boolean;
  customerCanMutate: boolean;
  capability: KnowledgeSourceCapability;
};

export const WEBSITE_KOMPIS_KNOWLEDGE_SOURCE_INVENTORY: KnowledgeSourceInventoryRow[] = [
  {
    id: "faq",
    authoritative: "tenant_public_companion_faq_items + list/upsert/publish/archive RPCs",
    readPath: "GET /api/website-kompis/faq",
    writePath: "POST /api/website-kompis/faq + publish/unpublish/archive/restore",
    tenantGate: "RPC owner/admin + tenant scope",
    statuses: ["draft", "published", "archived"],
    usedByFrozenRuntime: true,
    customerCanMutate: true,
    capability: "full_app_read_write",
  },
  {
    id: "public_pages",
    authoritative: "tenant_public_site_index_documents (+ chunks/crawl_runs, service_role)",
    readPath: "search_tenant_public_site_index (ask-only, limit ≤8) — no APP inventory RPC",
    writePath: "Platform ingest only (POST platform-portal …/public-site-index/ingest)",
    tenantGate: "service_role / platform operator",
    statuses: ["unknown_to_app"],
    usedByFrozenRuntime: true,
    customerCanMutate: false,
    capability: "unavailable_needs_list_rpc",
  },
  {
    id: "public_documents",
    authoritative: "none for Website Kompis public product",
    readPath: "none",
    writePath: "none (Bedrift documents are a different product)",
    tenantGate: "n/a",
    statuses: [],
    usedByFrozenRuntime: false,
    customerCanMutate: false,
    capability: "unavailable_not_in_product",
  },
  {
    id: "answer_feedback",
    authoritative: "website_kompis_answer_feedback + receipts overview RPC",
    readPath: "GET /api/website-kompis/feedback",
    writePath: "Visitor public record only; APP does not write FAQ from votes",
    tenantGate: "overview RPC owner/admin",
    statuses: ["helpful", "not_helpful"],
    usedByFrozenRuntime: false,
    customerCanMutate: false,
    capability: "app_read_signals_only",
  },
  {
    id: "domain_connection",
    authoritative: "domain license center + WK domain settings APIs",
    readPath: "GET /api/app/domains*, /api/app/domains/website-kompis",
    writePath: "activate/deactivate + settings PATCH (existing)",
    tenantGate: "APP domain APIs",
    statuses: ["verified", "pending", "inactive", "…existing license statuses"],
    usedByFrozenRuntime: true,
    customerCanMutate: true,
    capability: "full_app_read_write",
  },
];

export type FaqKnowledgeCounts = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  lastUpdatedAt: string | null;
};

export function summarizeFaqItems(
  items: Array<{ status: string; updatedAt?: string | null; publishedAt?: string | null }>,
): FaqKnowledgeCounts {
  let published = 0;
  let draft = 0;
  let archived = 0;
  let lastUpdatedAt: string | null = null;

  for (const item of items) {
    if (item.status === "published") published += 1;
    else if (item.status === "archived") archived += 1;
    else draft += 1;

    const stamp = item.updatedAt || item.publishedAt || null;
    if (stamp && (!lastUpdatedAt || stamp > lastUpdatedAt)) {
      lastUpdatedAt = stamp;
    }
  }

  return {
    total: items.length,
    published,
    draft,
    archived,
    lastUpdatedAt,
  };
}

export const KNOWLEDGE_CENTER_UNSUPPORTED_WITHOUT_MIGRATION = [
  "list_tenant_public_site_index_pages_for_app",
  "app_visible_crawl_run_status",
  "website_kompis_public_document_upload_pipeline",
  "feedback_to_faq_draft_link_table",
  "unanswered_question_inbox",
] as const;
