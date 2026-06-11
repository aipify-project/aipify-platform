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

export async function runQualityScanJob(
  fetcher: RpcFetcher,
  scanType: QualityScanType = "full",
  ctx: ScannerContext = {}
) {
  const results = runAllQualityScanners(ctx);
  return fetcher("run_quality_scan", {
    p_scan_type: scanType,
    p_results: results,
  });
}

export async function createQualitySummaryJob(fetcher: RpcFetcher) {
  return runQualityScanJob(fetcher, "summary");
}
