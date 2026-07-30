import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { ensureCustomerWebsite, resolveWebsiteCmsContext } from "@/lib/website-cms/context";
import { fetchWebsiteReleaseChainReadiness } from "@/lib/website-staging-verification/readiness";

const headers = { "Cache-Control": "no-store" };

/**
 * Loads the Website CMS context for the current organization. Idempotently
 * provisions the `customer_websites` row on first access (status
 * `provisioned`, no pages, no publish) so downstream candidate/publish/
 * rollback calls always have an authoritative website to attach to.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const organizationId = access.context.organization_id ?? "unknown";
    const rate = await assertKompisOperatorRateLimit({
      supabase,
      userId: user.id,
      organizationId,
      kind: "plan",
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests.", code: "rate_limited", resetInSeconds: rate.resetInSeconds ?? 60 },
        { status: 429, headers },
      );
    }

    const ensured = await ensureCustomerWebsite(
      supabase,
      "Website CMS context requested from the Customer App.",
    );
    if (!ensured.ok) {
      const mapped = mapKompisOperatorRpcError(ensured.rawMessage);
      return NextResponse.json(
        { error: "Website could not be provisioned.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }

    const context = await resolveWebsiteCmsContext(supabase);
    // Aggregate readiness only — never staging org/fixture/token internals.
    const releaseChainReadiness = await fetchWebsiteReleaseChainReadiness(supabase);
    return NextResponse.json({ context, releaseChainReadiness }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const mapped = mapKompisOperatorRpcError(message);
    return NextResponse.json(
      { error: "Unable to load website context.", code: mapped.code },
      { status: mapped.status, headers },
    );
  }
}
