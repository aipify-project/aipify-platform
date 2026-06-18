import { NextResponse } from "next/server";
import { runLocalGovernanceScan } from "@/lib/build-governance/run-governance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const { data, error } = await supabase.rpc("get_route_registry_dashboard", {
      p_category: category && category !== "all" ? category : null,
    });
    if (error) {
      const scan = runLocalGovernanceScan();
      return NextResponse.json({
        scanned_at: scan.scannedAt,
        statistics: {
          total_routes: scan.statistics.totalRoutes,
          api_routes: scan.statistics.apiRoutes,
          marketing_routes: scan.statistics.marketingRoutes,
          customer_routes: scan.statistics.customerRoutes,
          platform_routes: scan.statistics.platformRoutes,
          super_routes: scan.statistics.superRoutes,
          business_pack_routes: scan.statistics.businessPackRoutes,
          dynamic_routes: scan.statistics.dynamicRoutes,
          page_routes: scan.statistics.pageRoutes,
        },
        routes: scan.routes
          .filter((route) => !category || category === "all" || route.category === category)
          .map((route) => ({
            id: route.filePath,
            file_path: route.filePath,
            url_pattern: route.urlPattern,
            category: route.category,
            owner: route.owner,
            module: route.module,
            kind: route.kind,
            last_modified: route.lastModified,
            status: route.status,
            status_label: route.status,
          })),
        categories: [
          "customer_app",
          "platform_admin",
          "super_admin",
          "api",
          "marketing",
          "business_packs",
          "other",
        ],
        fallback: true,
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load route registry" }, { status: 500 });
  }
}
