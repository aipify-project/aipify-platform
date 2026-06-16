/**
 * Organizational Benchmarking Engine helpers (Phase A.58).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const BENCHMARK_CATEGORIES = [
  "internal",
  "industry",
  "maturity",
  "performance",
  "adoption",
] as const;
export type BenchmarkCategory = (typeof BENCHMARK_CATEGORIES)[number];

export const BENCHMARK_PERIODS = ["weekly", "monthly", "quarterly", "annually"] as const;
export type BenchmarkPeriod = (typeof BENCHMARK_PERIODS)[number];

export const BENCHMARK_METRIC_KEYS = [
  "support_response_time",
  "training_completion",
  "workflow_adoption",
  "incident_resolution",
  "maturity_level",
  "health_score",
] as const;
export type BenchmarkMetricKey = (typeof BENCHMARK_METRIC_KEYS)[number];

export const BENCHMARK_POSITIONS = ["at_or_above", "near", "below"] as const;
export type BenchmarkPosition = (typeof BENCHMARK_POSITIONS)[number];

export const BENCHMARK_RECOMMENDATION_STATUSES = [
  "pending",
  "accepted",
  "dismissed",
  "implemented",
] as const;
export type BenchmarkRecommendationStatus = (typeof BENCHMARK_RECOMMENDATION_STATUSES)[number];

export const BENCHMARK_REPORT_TYPES = [
  "benchmark_summary",
  "executive_overview",
  "industry_comparison",
  "adoption_comparison",
] as const;
export type BenchmarkReportType = (typeof BENCHMARK_REPORT_TYPES)[number];

export async function getOrganizationalBenchmarkingEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_benchmarking_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationalBenchmarkingEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_benchmarking_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveBenchmarkSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_benchmark_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createOrganizationalBenchmarkingAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
