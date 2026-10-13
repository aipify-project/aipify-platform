import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadWebsiteKompisOwnedSites } from "@/lib/website-kompis-site-context";
import { maskWebsiteKompisInstallId } from "@/lib/website-kompis-connection/status-model";

/**
 * Server-owned Kompis Web sites for the authenticated tenant.
 * Presentation + FAQ scoping only — no inventing domains/installs.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { context, sites } = await loadWebsiteKompisOwnedSites(supabase);
    if (!context.authenticated || context.state === "unauthenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      sites: sites.map((site) => ({
        installId: site.installId,
        installIdMasked: maskWebsiteKompisInstallId(site.installId),
        domain: site.domain,
        verificationStatus: site.verificationStatus,
        domainStatus: site.domainStatus,
        isPrimaryCandidate: site.isPrimaryCandidate,
      })),
      state:
        sites.length === 0 ? "no_sites" : sites.length === 1 ? "single_site" : "multi_site",
      visitorIsolation: "partial_null_legacy_shared",
    });
  } catch {
    return NextResponse.json({ error: "Site list failed" }, { status: 500 });
  }
}
