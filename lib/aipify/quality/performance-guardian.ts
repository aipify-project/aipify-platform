import type { QualityScanResult } from "./types";

export type PageSnapshotInput = {
  page_url: string;
  viewport: "mobile_small" | "mobile_standard" | "tablet" | "desktop";
  status_code?: number;
  load_time_ms?: number;
  total_page_weight_bytes?: number;
  request_count?: number;
  image_weight_bytes?: number;
  script_weight_bytes?: number;
  css_weight_bytes?: number;
  layout_issue_count?: number;
};

export type PerformanceThresholds = {
  pageWeightWarningMb: number;
  pageWeightHighMb: number;
  loadTimeWarningMs: number;
  loadTimeHighMs: number;
};

const DEFAULT: PerformanceThresholds = {
  pageWeightWarningMb: 3,
  pageWeightHighMb: 6,
  loadTimeWarningMs: 3000,
  loadTimeHighMs: 5000,
};

function mb(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function evaluatePageSnapshot(
  snap: PageSnapshotInput,
  thresholds: PerformanceThresholds = DEFAULT
): { snapshot: Record<string, unknown>; incidents: QualityScanResult[] } {
  const record: Record<string, unknown> = {
    page_url: snap.page_url,
    viewport: snap.viewport,
    status_code: snap.status_code ?? 200,
    load_time_ms: snap.load_time_ms,
    total_page_weight_bytes: snap.total_page_weight_bytes,
    request_count: snap.request_count,
    image_weight_bytes: snap.image_weight_bytes,
    script_weight_bytes: snap.script_weight_bytes,
    css_weight_bytes: snap.css_weight_bytes,
    layout_issue_count: snap.layout_issue_count ?? 0,
    metrics: {},
  };

  const incidents: QualityScanResult[] = [];
  const keyBase = `${snap.page_url}.${snap.viewport}`.replace(/[^a-z0-9]/gi, "_");

  if (snap.status_code && snap.status_code >= 500) {
    incidents.push({
      incident_key: `quality.page.error.${keyBase}`,
      title: "Page returned server error",
      passed: false,
      severity: "critical",
      scanner_type: "performance_guardian",
      category: "performance",
      incident_type: "slow_page",
      page_url: snap.page_url,
      expected_behavior: "Page should return HTTP 200.",
      observed_behavior: `HTTP ${snap.status_code} on ${snap.viewport}.`,
      impact: "Core user flows may be broken.",
      suggested_fix: "Investigate server error and restore page availability.",
    });
  }

  const weight = snap.total_page_weight_bytes ?? 0;
  if (weight > thresholds.pageWeightHighMb * 1024 * 1024) {
    incidents.push({
      incident_key: `quality.page.heavy.high.${keyBase}`,
      title: "Heavy page detected",
      passed: false,
      severity: snap.viewport.startsWith("mobile") ? "high" : "medium",
      scanner_type: "performance_guardian",
      category: "performance",
      incident_type: "slow_page",
      page_url: snap.page_url,
      expected_behavior: `Page weight should stay under ${thresholds.pageWeightHighMb} MB.`,
      observed_behavior: `Total page weight is ${mb(weight).toFixed(1)} MB on ${snap.viewport}.`,
      impact: "Slow loading especially on mobile networks.",
      suggested_fix: "Compress images, reduce JS bundle, defer non-critical scripts.",
      recommendation_type: "reduce_bundle",
      evidence: { total_page_weight_bytes: weight, viewport: snap.viewport },
    });
  } else if (weight > thresholds.pageWeightWarningMb * 1024 * 1024) {
    incidents.push({
      incident_key: `quality.page.heavy.warn.${keyBase}`,
      title: "Page weight above recommended threshold",
      passed: false,
      severity: "medium",
      scanner_type: "performance_guardian",
      category: "performance",
      incident_type: "slow_page",
      page_url: snap.page_url,
      expected_behavior: `Page weight should ideally stay under ${thresholds.pageWeightWarningMb} MB.`,
      observed_behavior: `Page weighs ${mb(weight).toFixed(1)} MB.`,
      suggested_fix: "Review largest assets and lazy-load below-the-fold media.",
      recommendation_type: "reduce_bundle",
    });
  }

  const load = snap.load_time_ms ?? 0;
  if (load > thresholds.loadTimeHighMs) {
    incidents.push({
      incident_key: `quality.page.slow.high.${keyBase}`,
      title: "Slow page load",
      passed: false,
      severity: "high",
      scanner_type: "performance_guardian",
      category: "performance",
      incident_type: "slow_page",
      page_url: snap.page_url,
      expected_behavior: `Load time should stay under ${thresholds.loadTimeHighMs / 1000}s.`,
      observed_behavior: `Load time ${(load / 1000).toFixed(1)}s on ${snap.viewport}.`,
      suggested_fix: "Optimize critical path, caching, and heavy assets.",
    });
  } else if (load > thresholds.loadTimeWarningMs) {
    incidents.push({
      incident_key: `quality.page.slow.warn.${keyBase}`,
      title: "Page load slower than recommended",
      passed: false,
      severity: "medium",
      scanner_type: "performance_guardian",
      category: "performance",
      incident_type: "slow_page",
      page_url: snap.page_url,
      expected_behavior: `Load time should stay under ${thresholds.loadTimeWarningMs / 1000}s.`,
      observed_behavior: `Load time ${(load / 1000).toFixed(1)}s.`,
      suggested_fix: "Review render-blocking resources and image weight.",
    });
  }

  const js = snap.script_weight_bytes ?? 0;
  if (js > 1024 * 1024) {
    incidents.push({
      incident_key: `quality.page.js.heavy.${keyBase}`,
      title: "Heavy JavaScript bundle",
      passed: false,
      severity: "medium",
      scanner_type: "performance_guardian",
      category: "frontend",
      incident_type: "heavy_javascript",
      page_url: snap.page_url,
      expected_behavior: "Initial JavaScript load should stay under 1 MB where possible.",
      observed_behavior: `JS weight ${formatBytes(js)}.`,
      suggested_fix: "Split bundles, remove unused scripts, defer third-party tags.",
      recommendation_type: "reduce_bundle",
    });
  }

  if ((snap.request_count ?? 0) > 100) {
    incidents.push({
      incident_key: `quality.page.requests.${keyBase}`,
      title: "High number of network requests",
      passed: false,
      severity: "low",
      scanner_type: "performance_guardian",
      category: "performance",
      incident_type: "slow_page",
      page_url: snap.page_url,
      expected_behavior: "Page should avoid excessive network requests on first load.",
      observed_behavior: `${snap.request_count} requests on page load.`,
      suggested_fix: "Combine assets, use HTTP caching, reduce third-party tags.",
    });
  }

  return { snapshot: record, incidents };
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
