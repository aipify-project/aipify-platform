import { NextResponse } from "next/server";
import { normalizePublicSiteIndexDiscoveryMode } from "@/lib/marketing/website-kompis-public-site-index/discovery";
import { ingestTenantPublicSiteIndex } from "@/lib/marketing/website-kompis-public-site-index/ingest";
import { resolvePublicSiteIndexOperatorTrust } from "@/lib/marketing/website-kompis-public-site-index/operator-trust";
import {
  isPublicSiteIndexPersistEnabled,
  resolvePublicSiteIndexPersistGate,
} from "@/lib/marketing/website-kompis-public-site-index/write-gate";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };

/**
 * Platform-only operator entrypoint for public site index ingest batches.
 * Defaults to dryRun=true. Persist requires confirmation=true AND dryRun=false
 * AND server env AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true (default off).
 * Never trusts client-supplied tenantId/host alone — resolves Core trust first.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!UUID.test(id ?? "")) {
      return NextResponse.json(
        { error: "Invalid customer id.", code: "invalid_customer" },
        { status: 400, headers },
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const requestedHost =
      typeof body?.verifiedHost === "string"
        ? body.verifiedHost
        : typeof body?.domain === "string"
          ? body.domain
          : null;
    const dryRun = body?.dryRun !== false; // default true
    const confirmation = body?.confirmation === true;
    const localeHint =
      typeof body?.localeHint === "string" ? body.localeHint : "no";
    const seedUrls = Array.isArray(body?.seedUrls)
      ? body.seedUrls.filter((u): u is string => typeof u === "string").slice(0, 40)
      : [];
    const discoveryMode = normalizePublicSiteIndexDiscoveryMode(body?.discoveryMode);
    const cursor = typeof body?.cursor === "string" ? body.cursor : null;
    const maxPages =
      typeof body?.maxPages === "number" && Number.isFinite(body.maxPages)
        ? Math.floor(body.maxPages)
        : 30;

    if (discoveryMode === "seed_only" && seedUrls.length === 0) {
      return NextResponse.json(
        {
          error: "seed_only discovery requires non-empty seedUrls.",
          code: "seed_urls_required",
        },
        { status: 400, headers },
      );
    }

    const persistGate = resolvePublicSiteIndexPersistGate({
      dryRun,
      confirmation,
    });

    if (!dryRun && !confirmation) {
      return NextResponse.json(
        {
          error: "Persist ingest requires confirmation=true and dryRun=false.",
          code: "confirmation_required",
        },
        { status: 400, headers },
      );
    }

    if (!persistGate.allowPersist && !dryRun && confirmation) {
      return NextResponse.json(
        {
          error:
            "Public site index writes are disabled until owner-approved enablement.",
          code: "writes_disabled",
          writesEnabled: isPublicSiteIndexPersistEnabled(),
        },
        { status: 403, headers },
      );
    }

    const trust = await resolvePublicSiteIndexOperatorTrust({
      customerId: id,
      requestedHost,
    });
    if (!trust.ok) {
      const status =
        trust.reason === "unauthorized"
          ? 401
          : trust.reason === "invalid_customer"
            ? 400
            : 403;
      return NextResponse.json(
        { error: "Trust context rejected.", code: trust.reason },
        { status, headers },
      );
    }

    const result = await ingestTenantPublicSiteIndex({
      tenantId: trust.tenantId,
      installId: trust.installId,
      verifiedHost: trust.verifiedHost,
      seedUrls,
      discoveryMode,
      localeHint,
      maxPages,
      cursor,
      dryRun: dryRun || !confirmation || !persistGate.allowPersist,
      confirmation: confirmation && persistGate.allowPersist,
    });

    return NextResponse.json(
      {
        trust: {
          tenantId: trust.tenantId,
          installId: trust.installId,
          verifiedHost: trust.verifiedHost,
        },
        writesEnabled: isPublicSiteIndexPersistEnabled(),
        discoveryMode,
        result,
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to run public site index ingest.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
