import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FAQ_MATCH_PAGE_CAP, FAQ_MATCH_PAGE_SIZE, authoritativeMatchAllowed } from "@/lib/website-kompis-faq/bulk-review";
import { faqCountContractMissing, faqCountSiteScope, parseFaqCountTotal } from "@/lib/website-kompis-faq/count-contract";
import { parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";
import {
  filterWebsiteKompisFaqItemsForSiteContext,
  resolveWebsiteKompisSiteContextForRequest,
} from "@/lib/website-kompis-site-context";
import { WPKF_CONTENT_TYPES, WPKF_STATUSES, type WpkfContentType, type WpkfStatus } from "@/lib/website-kompis-faq/constants";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const statusRaw = url.searchParams.get("status");
    const status = WPKF_STATUSES.includes(statusRaw as WpkfStatus) ? statusRaw : null;
    const contentRaw = url.searchParams.get("contentType");
    const contentType = WPKF_CONTENT_TYPES.includes(contentRaw as WpkfContentType) ? contentRaw : null;
    const locale = url.searchParams.get("locale")?.trim() || null;
    const query = url.searchParams.get("query")?.trim() || null;
    const siteContext = await resolveWebsiteKompisSiteContextForRequest(
      supabase,
      url.searchParams.get("installId") || url.searchParams.get("site"),
    );
    if (siteContext.state === "unauthenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const scope = faqCountSiteScope(siteContext.state, siteContext.selectedInstallId ?? null);
    if (!scope) {
      return NextResponse.json({ code: "count_unavailable" }, { status: 409 });
    }

    const { data: countData, error: countError } = await supabase.rpc(
      "count_tenant_public_companion_faq_items",
      {
        p_status: status,
        p_locale: locale,
        p_content_type: contentType,
        p_query: query,
        p_install_id: scope.installId,
        p_site_scope: scope.scope,
      },
    );
    if (countError || faqCountContractMissing(countError)) {
      return NextResponse.json({ code: "count_unavailable" }, { status: 409 });
    }
    const total = parseFaqCountTotal(countData);
    if (total == null) {
      return NextResponse.json({ code: "count_unavailable" }, { status: 409 });
    }

    const ids: string[] = [];
    for (let page = 0; page < FAQ_MATCH_PAGE_CAP; page += 1) {
      const { data, error } = await supabase.rpc("list_tenant_public_companion_faq_items", {
        p_status: status,
        p_locale: locale,
        p_content_type: contentType,
        p_query: query,
        p_limit: FAQ_MATCH_PAGE_SIZE,
        p_offset: page * FAQ_MATCH_PAGE_SIZE,
      });
      if (error) {
        return NextResponse.json({ code: "count_mismatch" }, { status: 409 });
      }
      const parsed = filterWebsiteKompisFaqItemsForSiteContext(parseWebsiteKompisFaqList(data), siteContext);
      ids.push(...parsed.map((row) => row.id));
      if (parseWebsiteKompisFaqList(data).length < FAQ_MATCH_PAGE_SIZE) break;
    }

    if (!authoritativeMatchAllowed({ countAvailable: true, reportedTotal: total, collectedIds: ids.length })) {
      return NextResponse.json({ code: "count_mismatch", total }, { status: 409 });
    }
    return NextResponse.json({ ids, total });
  } catch {
    return NextResponse.json({ error: "FAQ match request failed" }, { status: 500 });
  }
}
