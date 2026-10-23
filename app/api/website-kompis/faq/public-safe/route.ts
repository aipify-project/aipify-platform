import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  FAQ_MATCH_PAGE_CAP,
  FAQ_MATCH_PAGE_SIZE,
  FAQ_PUBLIC_SAFE_BATCH_SIZE,
  faqLookupStop,
  planPublicSafeReview,
  type FaqReviewLookup,
} from "@/lib/website-kompis-faq/bulk-review";
import { WPKF_CONTENT_TYPES, WPKF_STATUSES, type WpkfContentType, type WpkfStatus } from "@/lib/website-kompis-faq/constants";
import { parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";
import {
  filterWebsiteKompisFaqItemsForSiteContext,
  resolveWebsiteKompisSiteContextForRequest,
} from "@/lib/website-kompis-site-context";
import type { WebsiteKompisFaqItem } from "@/lib/website-kompis-faq/types";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function lookupFromBody(body: Record<string, unknown>): FaqReviewLookup {
  const statusRaw = typeof body.status === "string" ? body.status : "";
  const contentRaw = typeof body.contentType === "string" ? body.contentType : "";
  return {
    status: WPKF_STATUSES.includes(statusRaw as WpkfStatus) ? statusRaw : null,
    locale: typeof body.locale === "string" && body.locale.trim() ? body.locale.trim() : null,
    contentType: WPKF_CONTENT_TYPES.includes(contentRaw as WpkfContentType) ? contentRaw : null,
    query: typeof body.query === "string" && body.query.trim() ? body.query.trim() : null,
  };
}

async function loadVisibleRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  siteContext: Parameters<typeof filterWebsiteKompisFaqItemsForSiteContext>[1],
  lookup: FaqReviewLookup,
  wanted: ReadonlySet<string>,
): Promise<{ rows: WebsiteKompisFaqItem[]; error: string | null; status: number }> {
  const found: WebsiteKompisFaqItem[] = [];
  const foundWanted = new Set<string>();
  for (let page = 0; page < FAQ_MATCH_PAGE_CAP; page += 1) {
    const { data, error } = await supabase.rpc("list_tenant_public_companion_faq_items", {
      p_status: lookup.status,
      p_locale: lookup.locale,
      p_content_type: lookup.contentType,
      p_query: lookup.query,
      p_limit: FAQ_MATCH_PAGE_SIZE,
      p_offset: page * FAQ_MATCH_PAGE_SIZE,
    });
    if (error) {
      const status = /owner or admin/i.test(error.message) ? 403 : 400;
      return { rows: [], error: error.message, status };
    }
    const parsed = parseWebsiteKompisFaqList(data);
    const visible = filterWebsiteKompisFaqItemsForSiteContext(parsed, siteContext);
    for (const row of visible) {
      found.push(row);
      if (wanted.has(row.id)) foundWanted.add(row.id);
    }
    const stop = faqLookupStop({
      pageReturned: parsed.length,
      pageSize: FAQ_MATCH_PAGE_SIZE,
      pagesRead: page + 1,
      pageCap: FAQ_MATCH_PAGE_CAP,
      wanted: wanted.size,
      foundWanted: foundWanted.size,
    });
    if (stop !== "continue") break;
  }
  return { rows: found, error: null, status: 200 };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    if (body.confirm !== true) {
      return NextResponse.json({ error: "Confirmation is required", code: "confirmation_required" }, { status: 400 });
    }
    if (!Array.isArray(body.itemIds) || body.itemIds.length === 0 || body.itemIds.length > FAQ_PUBLIC_SAFE_BATCH_SIZE) {
      return NextResponse.json({ error: "Select a limited batch", code: "batch_limit" }, { status: 400 });
    }
    const itemIds = body.itemIds
      .filter((id): id is string => typeof id === "string")
      .map((id) => id.trim().toLowerCase())
      .filter((id) => UUID.test(id));
    if (itemIds.length !== body.itemIds.length) {
      return NextResponse.json({ error: "Invalid FAQ selection", code: "invalid_ids" }, { status: 400 });
    }

    const requestedInstallId = typeof body.installId === "string" ? body.installId : null;
    const siteContext = await resolveWebsiteKompisSiteContextForRequest(supabase, requestedInstallId);
    if (siteContext.state === "unauthenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (siteContext.state === "invalid_selection" || (siteContext.state === "multi_site" && !siteContext.selectedInstallId)) {
      return NextResponse.json({ error: "Invalid website selection", code: "invalid_site_selection" }, { status: 400 });
    }

    const loaded = await loadVisibleRows(supabase, siteContext, lookupFromBody(body), new Set(itemIds));
    if (loaded.error) {
      return NextResponse.json({ error: loaded.error }, { status: loaded.status });
    }

    const plan = planPublicSafeReview(loaded.rows, itemIds);
    const byId = new Map(loaded.rows.map((row) => [row.id, row]));
    const results: Array<{ id: string; outcome: string }> = plan.skipped.map((row) => ({
      id: row.id,
      outcome: row.reason,
    }));

    for (const id of plan.readyIds) {
      const row = byId.get(id);
      if (!row) {
        results.push({ id, outcome: "not_visible" });
        continue;
      }
      const { error } = await supabase.rpc("upsert_tenant_public_companion_faq_item", {
        p_item_id: row.id,
        p_install_id: row.installId,
        p_domain: row.domain,
        p_locale: row.locale,
        p_title: row.title,
        p_question: row.question,
        p_answer: row.answer,
        p_category: row.category,
        p_content_type: row.contentType,
        p_public_safe: true,
        p_priority: row.priority,
        p_tags: row.tags,
        p_source_url: row.sourceUrl,
        p_valid_from: row.validFrom,
        p_valid_until: row.validUntil,
        p_last_reviewed_at: new Date().toISOString(),
      });
      results.push({ id, outcome: error ? "failed" : "marked" });
    }

    return NextResponse.json({
      results,
      marked: results.filter((row) => row.outcome === "marked").map((row) => row.id),
      alreadySafe: plan.alreadySafeIds,
      manual: plan.manualIds,
    });
  } catch {
    return NextResponse.json({ error: "Public-safe review failed" }, { status: 500 });
  }
}
