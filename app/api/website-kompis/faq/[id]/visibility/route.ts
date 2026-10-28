import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveWebsiteKompisSiteContextForRequest } from "@/lib/website-kompis-site-context";
import { buildFaqVisibilityDiagnosticForItem } from "@/lib/website-kompis-faq/visibility-diagnostic-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ITEM_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!ITEM_ID_PATTERN.test(id)) {
      return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
    }

    const url = new URL(request.url);
    const siteContext = await resolveWebsiteKompisSiteContextForRequest(
      supabase,
      url.searchParams.get("installId") || url.searchParams.get("site"),
    );

    if (siteContext.state === "unauthenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (siteContext.state === "invalid_selection") {
      return NextResponse.json(
        { error: "Invalid website selection", code: "invalid_site_selection" },
        { status: 400 },
      );
    }

    const result = await buildFaqVisibilityDiagnosticForItem({
      supabase,
      itemId: id.toLowerCase(),
      selectedInstallId: siteContext.selectedInstallId,
      selectedDomain: siteContext.selectedDomain,
    });

    if (!result.ok) {
      return NextResponse.json({ error: "FAQ not found", code: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      outcome: "ok",
      report: result.report,
    });
  } catch {
    return NextResponse.json({ error: "FAQ visibility diagnostic failed" }, { status: 500 });
  }
}
