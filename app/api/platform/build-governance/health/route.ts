import { NextResponse } from "next/server";
import { runLocalGovernanceScan, readLatestBuildDurationMs } from "@/lib/build-governance/run-governance";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const scan = runLocalGovernanceScan();
    const { data: stored, error } = await supabase.rpc("get_build_health_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    const latest = (stored as { latest_snapshot?: Record<string, unknown> | null })?.latest_snapshot;

    return NextResponse.json({
      scan: {
        scanned_at: scan.scannedAt,
        passed: scan.passed,
        critical_count: scan.criticalCount,
        warning_count: scan.warningCount,
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
        issues: scan.issues.map((issue) => ({
          code: issue.code,
          severity: issue.severity,
          message: issue.message,
          file_path: issue.filePath,
          url_pattern: issue.urlPattern,
          related_paths: issue.relatedPaths,
        })),
        routes: scan.routes.slice(0, 120).map((route) => ({
          file_path: route.filePath,
          url_pattern: route.urlPattern,
          category: route.category,
          owner: route.owner,
          module: route.module,
          kind: route.kind,
          last_modified: route.lastModified,
          status: route.status,
        })),
      },
      build_status: latest?.passed ? "pass" : scan.passed ? "pass" : "fail",
      typecheck_status: latest?.typecheck_status ?? "unknown",
      build_duration_ms: readLatestBuildDurationMs(process.cwd()) ?? latest?.build_duration_ms ?? null,
      last_successful_deployment: latest?.last_successful_deployment ?? null,
      warnings: scan.issues.filter((issue) => issue.severity === "warning").map((issue) => issue.message),
      trend: (stored as { trend?: unknown })?.trend ?? [],
      privacy_note: (stored as { privacy_note?: string })?.privacy_note,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load build health center" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const scan = runLocalGovernanceScan();
    const payload = {
      scanned_at: scan.scannedAt,
      passed: scan.passed,
      critical_count: scan.criticalCount,
      warning_count: scan.warningCount,
      build_status: scan.passed ? "pass" : "fail",
      typecheck_status: "not_run",
      build_duration_ms: readLatestBuildDurationMs(process.cwd()),
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
      issues: scan.issues,
      routes: scan.routes,
    };

    const { data, error } = await supabase.rpc("record_build_governance_snapshot", {
      p_payload: payload,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, snapshot: data, scan: payload });
  } catch {
    return NextResponse.json({ error: "Failed to record governance snapshot" }, { status: 500 });
  }
}
