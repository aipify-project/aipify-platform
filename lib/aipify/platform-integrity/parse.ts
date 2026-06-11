import type { PlatformIntegrityCard, PlatformIntegrityDashboard, IntegrityActionResult } from "./types";

export function parsePlatformIntegrityCard(data: unknown): PlatformIntegrityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    integrity_score: d.integrity_score as number | undefined,
    integrity_band: d.integrity_band as string | undefined,
    integrity_band_label: d.integrity_band_label as string | undefined,
    open_findings: d.open_findings as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_oversight_required: d.human_oversight_required as boolean | undefined,
  };
}

export function parsePlatformIntegrityDashboard(data: unknown): PlatformIntegrityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: d.human_oversight_required as boolean | undefined,
    reviews_enabled: d.reviews_enabled as boolean | undefined,
    show_critical_findings: d.show_critical_findings as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    integrity_score: d.integrity_score as number | undefined,
    integrity_band: d.integrity_band as string | undefined,
    integrity_band_label: d.integrity_band_label as string | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    review_queue: Array.isArray(d.review_queue) ? (d.review_queue as PlatformIntegrityDashboard["review_queue"]) : [],
    findings: Array.isArray(d.findings) ? (d.findings as PlatformIntegrityDashboard["findings"]) : [],
    actions: Array.isArray(d.actions) ? (d.actions as PlatformIntegrityDashboard["actions"]) : [],
    deprecated_assets: Array.isArray(d.deprecated_assets)
      ? (d.deprecated_assets as PlatformIntegrityDashboard["deprecated_assets"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as PlatformIntegrityDashboard["briefings"]) : [],
    integrity_trends: Array.isArray(d.integrity_trends)
      ? (d.integrity_trends as PlatformIntegrityDashboard["integrity_trends"])
      : [],
    review_domains: Array.isArray(d.review_domains)
      ? (d.review_domains as PlatformIntegrityDashboard["review_domains"])
      : [],
    review_frequencies: Array.isArray(d.review_frequencies)
      ? (d.review_frequencies as PlatformIntegrityDashboard["review_frequencies"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseIntegrityActionResult(data: unknown): IntegrityActionResult {
  return (data ?? {}) as IntegrityActionResult;
}
