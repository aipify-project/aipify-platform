import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  WebsiteStagingControlPlane,
  WebsiteStagingEnvironmentSummary,
  WebsiteStagingFixtureSummary,
  WebsiteStagingKpis,
  WebsiteStagingRunListItem,
  WebsiteStagingVerificationOverview,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function mapWebsiteStagingEnvironment(raw: unknown): WebsiteStagingEnvironmentSummary | null {
  const row = asRecord(raw);
  if (row.id == null) return null;
  return {
    id: String(row.id),
    organizationId: String(row.organization_id ?? ""),
    websiteId: asStringOrNull(row.website_id),
    installationId: asStringOrNull(row.installation_id),
    domainId: asStringOrNull(row.domain_id),
    stagingHostKey: typeof row.staging_host_key === "string" ? row.staging_host_key : "",
    status: (row.status as WebsiteStagingEnvironmentSummary["status"]) ?? "active",
    retention: typeof row.retention === "string" ? row.retention : "standard",
    accessTokenPresent: row.access_token_present === true,
    createdAt: asStringOrNull(row.created_at),
    updatedAt: asStringOrNull(row.updated_at),
  };
}

export function mapWebsiteStagingFixture(raw: unknown): WebsiteStagingFixtureSummary {
  const row = asRecord(raw);
  return {
    id: String(row.id ?? ""),
    fixtureKey: typeof row.fixture_key === "string" ? row.fixture_key : "",
    pagePath: typeof row.page_path === "string" ? row.page_path : "",
    locale: typeof row.locale === "string" ? row.locale : "en",
    status: (row.status as WebsiteStagingFixtureSummary["status"]) ?? "active",
    retention: typeof row.retention === "string" ? row.retention : "standard",
    initialChecksum: asStringOrNull(row.initial_checksum),
    updatedChecksum: asStringOrNull(row.updated_checksum),
    createdAt: asStringOrNull(row.created_at),
    updatedAt: asStringOrNull(row.updated_at),
  };
}

export function mapWebsiteStagingRunListItem(raw: unknown): WebsiteStagingRunListItem {
  const row = asRecord(raw);
  return {
    id: String(row.id ?? ""),
    fixtureId: asStringOrNull(row.fixture_id),
    status: (row.status as WebsiteStagingRunListItem["status"]) ?? "pending",
    currentPhase: (row.current_phase as WebsiteStagingRunListItem["currentPhase"]) ?? "initialized",
    safeErrorCode: asStringOrNull(row.safe_error_code),
    startedAt: asStringOrNull(row.started_at),
    completedAt: asStringOrNull(row.completed_at),
    updatedAt: asStringOrNull(row.updated_at),
    firstPublishOperationId: asStringOrNull(row.first_publish_operation_id),
    secondPublishOperationId: asStringOrNull(row.second_publish_operation_id),
    rollbackOperationId: asStringOrNull(row.rollback_operation_id),
    expectedChecksums: asRecord(row.expected_checksums),
    actualChecksums: asRecord(row.actual_checksums),
  };
}

export function emptyWebsiteStagingControlPlane(): WebsiteStagingControlPlane {
  return {
    appLicenseActive: false,
    websiteKompisCapability: false,
    canonicalDelivery: false,
    acknowledgementOk: false,
    noindexRequired: true,
    productionIsolation: true,
    currentVersionId: null,
    currentVersionNumber: null,
    latestRunId: null,
    latestPhase: null,
    firstPublishPresent: false,
    secondPublishPresent: false,
    rollbackPresent: false,
    expectedChecksum: null,
    actualChecksum: null,
    checksumMatch: false,
    durationSeconds: null,
    auditReference: null,
    blockers: [],
  };
}

export function mapWebsiteStagingControlPlane(raw: unknown): WebsiteStagingControlPlane {
  const row = asRecord(raw);
  const blockers = Array.isArray(row.blockers)
    ? row.blockers.filter((item): item is string => typeof item === "string")
    : [];
  return {
    appLicenseActive: row.app_license_active === true,
    websiteKompisCapability: row.website_kompis_capability === true,
    canonicalDelivery: row.canonical_delivery === true,
    acknowledgementOk: row.acknowledgement_ok === true,
    noindexRequired: row.noindex_required !== false,
    productionIsolation: row.production_isolation === true,
    currentVersionId: asStringOrNull(row.current_version_id),
    currentVersionNumber:
      typeof row.current_version_number === "number"
        ? row.current_version_number
        : row.current_version_number != null
          ? Number(row.current_version_number)
          : null,
    latestRunId: asStringOrNull(row.latest_run_id),
    latestPhase: (asStringOrNull(row.latest_phase) as WebsiteStagingControlPlane["latestPhase"]) ?? null,
    firstPublishPresent: row.first_publish_present === true,
    secondPublishPresent: row.second_publish_present === true,
    rollbackPresent: row.rollback_present === true,
    expectedChecksum: asStringOrNull(row.expected_checksum),
    actualChecksum: asStringOrNull(row.actual_checksum),
    checksumMatch: row.checksum_match === true,
    durationSeconds:
      typeof row.duration_seconds === "number"
        ? row.duration_seconds
        : row.duration_seconds != null
          ? Number(row.duration_seconds)
          : null,
    auditReference: asStringOrNull(row.audit_reference),
    blockers,
  };
}

export function mapWebsiteStagingKpis(raw: unknown): WebsiteStagingKpis {
  const row = asRecord(raw);
  return {
    totalRuns: Number(row.total_runs ?? 0),
    passedRuns: Number(row.passed_runs ?? 0),
    failedRuns: Number(row.failed_runs ?? 0),
    blockedRuns: Number(row.blocked_runs ?? 0),
    lastRunAt: asStringOrNull(row.last_run_at),
  };
}

export function emptyWebsiteStagingOverview(): WebsiteStagingVerificationOverview {
  return {
    environment: null,
    fixtures: [],
    runs: [],
    kpis: { totalRuns: 0, passedRuns: 0, failedRuns: 0, blockedRuns: 0, lastRunAt: null },
    control: emptyWebsiteStagingControlPlane(),
  };
}

export async function fetchWebsiteStagingVerificationOverview(
  supabase: SupabaseClient,
): Promise<WebsiteStagingVerificationOverview> {
  const { data, error } = await supabase.rpc("get_website_staging_verification_overview");
  if (error) return emptyWebsiteStagingOverview();

  const payload = asRecord(data);
  return {
    environment: mapWebsiteStagingEnvironment(payload.environment),
    fixtures: asArray(payload.fixtures).map(mapWebsiteStagingFixture),
    runs: asArray(payload.runs).map(mapWebsiteStagingRunListItem),
    kpis: mapWebsiteStagingKpis(payload.kpis),
    control: mapWebsiteStagingControlPlane(payload.control),
  };
}
