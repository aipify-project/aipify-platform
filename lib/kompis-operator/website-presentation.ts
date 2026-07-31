/**
 * Central presentation contract for Kompis website workspace.
 * Status labels, locale names, SEO findings, drafts, and publish capability
 * must resolve here — never raw enums, ISO timestamps, or CSS capitalize.
 */

import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";
import type { KompisOperatorSeverityTone } from "./severity";

export const KOMPIS_WEBSITE_STATUS_CODES = [
  "active",
  "completed",
  "failed",
  "awaiting_approval",
  "ready",
  "draft",
  "published",
  "superseded",
  "candidate",
  "archived",
  "pending",
  "executing",
  "verifying",
  "cancelled",
  "canceled",
  "expired",
  "rejected",
  "approved",
  "consumed",
  "attention",
  "blocked",
  "partial",
  "provisioned",
  "not_configured",
  "fully_verified",
  "awaiting_acknowledgement",
  "http_verification_missing",
  "verification_failed",
  "ready_for_publish",
  "publish_requires_approval",
  "publish_temporarily_blocked",
  "publish_not_configured",
  "current",
  "unknown",
] as const;

export type KompisWebsiteStatusCode = (typeof KOMPIS_WEBSITE_STATUS_CODES)[number];

/** Locale keys under customerApp.kompisOperator.statuses.* */
export const KOMPIS_WEBSITE_STATUS_LOCALE_KEYS: Record<KompisWebsiteStatusCode, string> = {
  active: "active",
  completed: "completed",
  failed: "failed",
  awaiting_approval: "awaitingApproval",
  ready: "ready",
  draft: "draft",
  published: "published",
  superseded: "superseded",
  candidate: "candidate",
  archived: "archived",
  pending: "pending",
  executing: "executing",
  verifying: "verifying",
  cancelled: "cancelled",
  canceled: "cancelled",
  expired: "expired",
  rejected: "rejected",
  approved: "approved",
  consumed: "consumed",
  attention: "attention",
  blocked: "blocked",
  partial: "partial",
  provisioned: "provisioned",
  not_configured: "notConfigured",
  fully_verified: "fullyVerified",
  awaiting_acknowledgement: "awaitingAcknowledgement",
  http_verification_missing: "httpVerificationMissing",
  verification_failed: "verificationFailed",
  ready_for_publish: "readyForPublish",
  publish_requires_approval: "publishRequiresApproval",
  publish_temporarily_blocked: "publishTemporarilyBlocked",
  publish_not_configured: "publishNotConfigured",
  current: "currentVersion",
  unknown: "unknown",
};

const STATUS_SEVERITY: Record<string, KompisOperatorSeverityTone> = {
  active: "success",
  completed: "success",
  ready: "success",
  published: "success",
  approved: "success",
  fully_verified: "success",
  ready_for_publish: "success",
  current: "success",
  draft: "info",
  candidate: "info",
  provisioned: "info",
  pending: "warning",
  executing: "warning",
  verifying: "warning",
  awaiting_approval: "warning",
  awaiting_acknowledgement: "warning",
  http_verification_missing: "warning",
  attention: "warning",
  partial: "warning",
  publish_requires_approval: "warning",
  publish_temporarily_blocked: "warning",
  superseded: "muted",
  archived: "muted",
  consumed: "muted",
  cancelled: "muted",
  canceled: "muted",
  expired: "muted",
  not_configured: "muted",
  publish_not_configured: "muted",
  failed: "danger",
  rejected: "danger",
  blocked: "danger",
  verification_failed: "danger",
  unknown: "muted",
};

export function normalizeKompisWebsiteStatus(
  value: string | null | undefined,
): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

export function resolveKompisWebsiteStatusLabel(
  status: string | null | undefined,
  labels: Record<string, string>,
  unknownFallback: string,
): string {
  const code = normalizeKompisWebsiteStatus(status);
  if (!code) return unknownFallback;
  const localeKey = KOMPIS_WEBSITE_STATUS_LOCALE_KEYS[code as KompisWebsiteStatusCode];
  const fromKey = localeKey ? labels[localeKey] : undefined;
  const fromCode = labels[code] ?? labels[code.replace(/_/g, "")];
  const resolved = (fromKey ?? fromCode ?? "").trim();
  if (resolved) return resolved;
  return unknownFallback;
}

export function resolveKompisWebsiteStatusTone(
  status: string | null | undefined,
): KompisOperatorSeverityTone {
  const code = normalizeKompisWebsiteStatus(status);
  if (!code) return "muted";
  return STATUS_SEVERITY[code] ?? "info";
}

export function assertStatusLabelCapitalized(label: string): boolean {
  if (!label.trim()) return false;
  const first = label.trim()[0]!;
  return first === first.toLocaleUpperCase();
}

/** Content-locale display names — never show raw `en` / `no` as primary text. */
export const CONTENT_LOCALE_LABEL_KEYS: Record<string, string> = {
  en: "english",
  no: "norwegian",
  nb: "norwegian",
  nn: "norwegian",
  sv: "swedish",
  da: "danish",
  pl: "polish",
  uk: "ukrainian",
  es: "spanish",
};

export function resolveContentLocaleLabel(
  localeCode: string | null | undefined,
  labels: Record<string, string>,
  unknownFallback: string,
): string {
  if (!localeCode || !String(localeCode).trim()) return unknownFallback;
  const key = CONTENT_LOCALE_LABEL_KEYS[String(localeCode).trim().toLowerCase()];
  const label = key ? labels[key] : undefined;
  if (label?.trim()) return label.trim();
  return unknownFallback;
}

export function formatKompisWebsiteDateTime(
  value: string | null | undefined,
  locale: string,
  emptyFallback: string,
  invalidFallback: string,
): string {
  return formatPlatformDateTimeFull(value, {
    locale,
    emptyFallback,
    invalidFallback,
  });
}

export function shortenTechnicalId(id: string | null | undefined, visible = 8): string | null {
  if (!id || typeof id !== "string") return null;
  const trimmed = id.trim();
  if (trimmed.length <= visible + 1) return trimmed;
  return `${trimmed.slice(0, visible)}…`;
}

export type WebsiteSeoFindingCode =
  | "runtime_acknowledgement_missing"
  | "primary_domain_missing"
  | "crawl_unavailable"
  | "missing_title"
  | "missing_meta_description"
  | "missing_canonical"
  | "missing_alt_text"
  | "empty_content"
  | "raw_translation_key"
  | "forbidden_markup";

export const WEBSITE_SEO_FINDING_LOCALE_KEYS: Record<WebsiteSeoFindingCode, string> = {
  runtime_acknowledgement_missing: "runtimeAcknowledgementMissing",
  primary_domain_missing: "primaryDomainMissing",
  crawl_unavailable: "crawlUnavailable",
  missing_title: "missingTitle",
  missing_meta_description: "missingMetaDescription",
  missing_canonical: "missingCanonical",
  missing_alt_text: "missingAltText",
  empty_content: "emptyContent",
  raw_translation_key: "rawTranslationKey",
  forbidden_markup: "forbiddenMarkup",
};

export type WebsiteSeoFinding = {
  code: WebsiteSeoFindingCode | string;
  severity: "info" | "warning" | "danger";
  pageId: string | null;
  locale: string | null;
  revision: string | number | null;
  /** Stable dedupe key — never use English detail as identity. */
  dedupeKey: string;
};

export function buildSeoFindingDedupeKey(input: {
  code: string;
  pageId: string | null;
  locale: string | null;
  revision: string | number | null;
}): string {
  return [
    input.code,
    input.pageId ?? "global",
    input.locale ?? "-",
    input.revision == null ? "-" : String(input.revision),
  ].join("|");
}

export function dedupeWebsiteSeoFindings(findings: WebsiteSeoFinding[]): WebsiteSeoFinding[] {
  const seen = new Set<string>();
  const out: WebsiteSeoFinding[] = [];
  for (const finding of findings) {
    const key = finding.dedupeKey || buildSeoFindingDedupeKey(finding);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...finding, dedupeKey: key });
  }
  return out;
}

export type WebsiteDraftPresentationRow = {
  id: string;
  title: string;
  locale: string | null;
  status: string;
  draftKind: string | null;
  revisionNumber: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  candidateId: string | null;
  groupKey: string;
};

/**
 * Collapse duplicate join rows and group revisions under the same logical draft.
 * Same id rendered twice is removed; distinct ids with same title+locale stay
 * as separate drafts with revision metadata when available.
 */
export function presentWebsiteDraftRows(
  pages: Array<Record<string, unknown>>,
): WebsiteDraftPresentationRow[] {
  const byId = new Map<string, WebsiteDraftPresentationRow>();
  for (const page of pages) {
    const id = typeof page.id === "string" ? page.id : null;
    if (!id) continue;
    if (byId.has(id)) continue;
    const title =
      typeof page.title === "string" && page.title.trim() ? page.title.trim() : "—";
    const locale = typeof page.locale === "string" ? page.locale : null;
    const status = typeof page.status === "string" ? page.status : "draft";
    const draftKind = typeof page.draftKind === "string" ? page.draftKind : null;
    const revisionRaw = page.version ?? page.revisionNumber ?? page.revision_number;
    const revisionNumber =
      typeof revisionRaw === "number"
        ? revisionRaw
        : typeof revisionRaw === "string" && /^\d+$/.test(revisionRaw)
          ? Number(revisionRaw)
          : null;
    const createdAt =
      typeof page.createdAt === "string"
        ? page.createdAt
        : typeof page.created_at === "string"
          ? page.created_at
          : null;
    const updatedAt =
      typeof page.updatedAt === "string"
        ? page.updatedAt
        : typeof page.updated_at === "string"
          ? page.updated_at
          : null;
    const candidateId =
      typeof page.candidateId === "string"
        ? page.candidateId
        : typeof page.candidate_id === "string"
          ? page.candidate_id
          : null;
    const groupKey = `${draftKind ?? "website"}:${locale ?? "-"}:${title.toLowerCase()}`;
    byId.set(id, {
      id,
      title,
      locale,
      status,
      draftKind,
      revisionNumber,
      createdAt,
      updatedAt,
      candidateId,
      groupKey,
    });
  }
  return Array.from(byId.values()).sort((a, b) => {
    const ta = a.updatedAt ?? a.createdAt ?? "";
    const tb = b.updatedAt ?? b.createdAt ?? "";
    return tb.localeCompare(ta);
  });
}

export type PublishCapabilityPresentation =
  | "ready_for_publish"
  | "publish_requires_approval"
  | "publish_temporarily_blocked"
  | "publish_not_configured";

export function resolvePublishCapabilityPresentation(input: {
  organizationReady: boolean;
  appAccessValid: boolean;
  websiteKompisEntitled: boolean;
  canonicalDeliveryValid: boolean;
  websiteExists: boolean;
  domainInstallationValid: boolean;
  hasMountedPath: boolean;
  publishToolAllowed: boolean;
  cmsPublishContractAvailable: boolean;
  conflictingOperation: boolean;
  expectedCurrentVersionAvailable: boolean;
  approvalContractAvailable: boolean;
  coreApprovalRequired: boolean;
}): { code: PublishCapabilityPresentation; blockers: string[] } {
  const blockers: string[] = [];
  if (!input.organizationReady) blockers.push("organization_not_ready");
  if (!input.appAccessValid) blockers.push("app_access_invalid");
  if (!input.websiteKompisEntitled) blockers.push("website_kompis_not_entitled");
  if (!input.canonicalDeliveryValid) blockers.push("canonical_delivery_invalid");
  if (!input.websiteExists) blockers.push("website_missing");
  if (!input.domainInstallationValid) blockers.push("domain_installation_invalid");
  if (!input.hasMountedPath) blockers.push("mounted_path_missing");
  if (!input.publishToolAllowed) blockers.push("publish_tool_not_allowed");
  if (!input.cmsPublishContractAvailable) blockers.push("cms_publish_contract_unavailable");
  if (input.conflictingOperation) blockers.push("conflicting_operation");
  if (!input.approvalContractAvailable) blockers.push("approval_contract_unavailable");

  if (blockers.length > 0) {
    const notConfigured =
      !input.websiteExists ||
      !input.cmsPublishContractAvailable ||
      !input.websiteKompisEntitled ||
      !input.canonicalDeliveryValid;
    return {
      code: notConfigured ? "publish_not_configured" : "publish_temporarily_blocked",
      blockers,
    };
  }

  if (input.coreApprovalRequired) {
    return { code: "publish_requires_approval", blockers: [] };
  }

  if (!input.expectedCurrentVersionAvailable && !input.hasMountedPath) {
    return { code: "publish_temporarily_blocked", blockers: ["expected_version_unavailable"] };
  }

  return { code: "ready_for_publish", blockers: [] };
}

export type RuntimeBusinessStatus =
  | "fully_verified"
  | "awaiting_acknowledgement"
  | "http_verification_missing"
  | "verification_failed"
  | "not_configured"
  | "attention";

export function resolveRuntimeBusinessStatus(input: {
  websiteProvisioned: boolean;
  mountedPaths: string[];
  activeVersionNumber: number | null;
  acknowledgementStatus: string | null;
  httpStatus: string | null;
  fullyVerified: boolean;
}): RuntimeBusinessStatus {
  if (!input.websiteProvisioned) return "not_configured";
  if (input.fullyVerified) return "fully_verified";
  const ack = normalizeKompisWebsiteStatus(input.acknowledgementStatus);
  const http = normalizeKompisWebsiteStatus(input.httpStatus);
  if (ack === "failed" || http === "failed" || ack === "mismatch" || http === "mismatch") {
    return "verification_failed";
  }
  if (!ack || ack === "pending" || ack === "awaiting_confirmation") {
    return "awaiting_acknowledgement";
  }
  if (!http || http === "pending") {
    return "http_verification_missing";
  }
  if (input.mountedPaths.length === 0 || input.activeVersionNumber == null) {
    return "attention";
  }
  return "attention";
}

/** Map known English planner/tool strings and summary codes to locale keys. */
export const KOMPIS_TOOL_LABEL_KEYS: Record<string, string> = {
  website_overview_read: "websiteOverviewRead",
  website_health_read: "websiteHealthRead",
  website_pages_read: "websitePagesRead",
  website_kompis_status_read: "websiteKompisStatusRead",
  domain_installation_status_read: "domainInstallationStatusRead",
  knowledge_search: "knowledgeSearch",
  support_case_create: "supportCaseCreate",
  website_seo_audit: "websiteSeoAudit",
  website_content_quality_audit: "websiteContentQualityAudit",
  website_locale_coverage_read: "websiteLocaleCoverageRead",
  website_publish_history_read: "websitePublishHistoryRead",
  website_preview_status_read: "websitePreviewStatusRead",
  website_page_read: "websitePageRead",
  website_navigation_read: "websiteNavigationRead",
  website_publish_approved_draft: "websitePublishApprovedDraft",
  website_publish_rollback: "websitePublishRollback",
  customer_profile_read: "customerProfileRead",
  agreement_status_read: "agreementStatusRead",
  license_status_read: "licenseStatusRead",
  app_access_status_read: "appAccessStatusRead",
  support_cases_read: "supportCasesRead",
  notifications_read: "notificationsRead",
  organization_members_read: "organizationMembersRead",
  activity_summary_read: "activitySummaryRead",
  content_inventory_read: "contentInventoryRead",
  operator_history_read: "operatorHistoryRead",
};

export const KOMPIS_PLAN_TITLE_KEYS: Record<string, string> = {
  "Website overview": "planWebsiteOverview",
  "Search authorized knowledge": "planKnowledgeSearch",
  "Create a support case": "planCreateSupportCase",
  website_overview: "planWebsiteOverview",
  knowledge_search: "planKnowledgeSearch",
  create_support_case: "planCreateSupportCase",
};

export const KOMPIS_RESULT_SUMMARY_KEYS: Record<string, string> = {
  "Task completed and authoritatively verified.": "resultTaskCompletedVerified",
  "Task stopped before all steps completed.": "resultTaskStoppedPartial",
  "Task finished but result verification needs follow-up.": "resultTaskNeedsFollowUp",
  "Knowledge search failed.": "resultKnowledgeSearchFailed",
  task_completed_verified: "task_completed_verified",
  task_stopped_partial: "task_stopped_partial",
  task_needs_follow_up: "task_needs_follow_up",
  knowledge_search_failed: "knowledge_search_failed",
  knowledge_search_hits: "knowledgeSearchHits",
  knowledge_search_empty: "knowledgeSearchEmpty",
  knowledgeSearchFailed: "knowledgeSearchFailed",
};

export function resolveKompisToolLabel(
  toolKey: string,
  labels: Record<string, string>,
  fallback: string,
): string {
  const key = KOMPIS_TOOL_LABEL_KEYS[toolKey];
  const label = key ? labels[key] : undefined;
  return label?.trim() || fallback;
}

export function resolveKompisResultSummary(
  summary: string | null | undefined,
  labels: Record<string, string>,
  fallback: string,
): string {
  if (!summary?.trim()) return fallback;
  const mappedKey = KOMPIS_RESULT_SUMMARY_KEYS[summary.trim()];
  if (mappedKey && labels[mappedKey]?.trim()) return labels[mappedKey]!.trim();
  if (labels[summary]?.trim()) return labels[summary]!.trim();
  // Prefer localized fallback over leaking known English templates.
  if (KOMPIS_RESULT_SUMMARY_KEYS[summary.trim()]) return fallback;
  return summary;
}
