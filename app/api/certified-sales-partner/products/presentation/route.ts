import { NextResponse } from "next/server";
import {
  buildUnifiedCatalog,
  filterSalesCatalogProducts,
  type ProductCatalogLocaleCode,
} from "@/lib/product-catalog";
import { enrichCatalogProductsWithApprovedMedia } from "@/lib/product-catalog/content-media-enrich";
import { overviewProductsToCoreRows } from "@/lib/product-catalog/partner-storefront-view-model";
import { parsePartnerOverview } from "@/lib/certified-sales-partner/partner-overview";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";
import { createClient } from "@/lib/supabase/server";

/**
 * Partner SALE presentation — approved locale + short-lived signed media.
 * Same Core content as APP; channel=sale; no buy CTA / no APP commission strip needed here.
 * Feature owner: AIPIFY PARTNER / CUSTOMER APP.
 */

const NO_STORE = { "Cache-Control": "no-store" } as const;
const LOCALES = new Set<ProductCatalogLocaleCode>(["en", "no", "sv", "da", "pl", "uk", "es"]);

export async function GET(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const supabase = await createClient();
    const url = new URL(request.url);
    const localeRaw = (url.searchParams.get("locale") ?? "en").trim().toLowerCase();
    const locale: ProductCatalogLocaleCode = LOCALES.has(localeRaw as ProductCatalogLocaleCode)
      ? (localeRaw as ProductCatalogLocaleCode)
      : "en";

    const overviewResult = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overviewResult.ready) {
      return NextResponse.json(
        { ok: false, error: overviewResult.error ?? "overview_unavailable" },
        { status: 503, headers: NO_STORE },
      );
    }

    const overview = parsePartnerOverview(overviewResult.data);
    const coreRows = overviewProductsToCoreRows(overview.products);
    const unified = filterSalesCatalogProducts(
      buildUnifiedCatalog({
        locale,
        coreProducts: coreRows,
        coreChannelApplied: true,
      }),
    ).filter((p) => p.sale.visibleInStore && p.sale.source === "core");

    const enriched = await enrichCatalogProductsWithApprovedMedia(supabase, {
      products: unified,
      locale,
      channel: "sale",
    });

    return NextResponse.json(
      {
        ok: true,
        locale,
        channel: "sale",
        products: enriched.map((p) => ({
          product_key: p.productKey,
          title: p.title,
          tagline: p.tagline,
          description: p.description,
          benefits: p.benefits ?? [],
          locale_approved: p.localeApproved,
          content_source: p.contentSource ?? "registry_fallback",
          logo_src: p.logoSrc,
          hero_src: p.heroImagePath,
          // Never return commission on presentation endpoint — partner card uses Core rates API.
        })),
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "presentation_failed" }, { status: 500, headers: NO_STORE });
  }
}
