import { runFrontendExperienceScan } from "./frontend-scanner";
import { getChecksForTenant, runAllQualityScanners, type ScannerContext } from "./scanners";
import type { QualityScanType } from "./types";

type RpcFetcher = (name: string, params: Record<string, unknown>) => Promise<unknown>;

export async function seedTenantQualityChecks(
  fetcher: RpcFetcher,
  tenantId: string,
  tenantSlug?: string | null
) {
  const checks = getChecksForTenant(tenantSlug);
  return fetcher("seed_quality_checks", {
    p_tenant_id: tenantId,
    p_checks: checks,
  });
}

const FRONTEND_SCAN_TYPES = new Set([
  "full_site",
  "images",
  "performance",
  "mobile",
  "localization",
  "seo",
  "frontend_journey",
]);

export async function runQualityScanJob(
  fetcher: RpcFetcher,
  scanType: QualityScanType = "full",
  ctx: ScannerContext = {}
) {
  if (scanType === "full") {
    const legacy = runAllQualityScanners(ctx);
    const frontend = runFrontendExperienceScan({
      tenantSlug: ctx.tenantSlug,
      scanType: "full_site",
    });
    return fetcher("run_quality_scan", {
      p_scan_type: scanType,
      p_results: [...legacy, ...frontend.results],
      p_assets: frontend.assets,
      p_snapshots: frontend.snapshots,
    });
  }

  if (FRONTEND_SCAN_TYPES.has(scanType)) {
    const { results, assets, snapshots } = runFrontendExperienceScan({
      tenantSlug: ctx.tenantSlug,
      scanType: scanType as "images" | "performance" | "mobile" | "full_site" | "localization",
    });
    return fetcher("run_quality_scan", {
      p_scan_type: scanType,
      p_results: results,
      p_assets: assets,
      p_snapshots: snapshots,
    });
  }

  const results = runAllQualityScanners(ctx);
  return fetcher("run_quality_scan", {
    p_scan_type: scanType,
    p_results: results,
    p_assets: [],
    p_snapshots: [],
  });
}

export async function generateGuardianReportJob(
  fetcher: RpcFetcher,
  reportType = "admin_summary"
) {
  return fetcher("generate_quality_guardian_report", { p_report_type: reportType });
}

export async function createQualitySummaryJob(fetcher: RpcFetcher) {
  return runQualityScanJob(fetcher, "summary");
}
