/**
 * Shared customer-facing approval presentation.
 * All Approval Center / ECC / Kompis surfaces should resolve labels through these helpers.
 */

import type { CustomerApproval } from "@/lib/app/customer-app/types";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import {
  normalizeApprovalDetail,
  type NormalizedApprovalDetail,
} from "./normalize-detail";

export type ApprovalPresentationLabels = {
  statusLabels: Record<string, string>;
  riskLevels: Record<string, string>;
  riskDescriptions: Record<string, string>;
  roleLabels: Record<string, string>;
  sourceLabels: Record<string, string>;
  categoryLabels: Record<string, string>;
  kompisPublishTitle: string;
  kompisRollbackTitle: string;
  kompisPublishDetailTitle: string;
  websiteKompisSource: string;
  localeNames: Record<string, string>;
  createdAtLabel: string;
  expiresAtLabel: string;
  validForLabel: string;
  expiresSoon: string;
  whatChangesTitle: string;
  whatUnchangedTitle: string;
  recommendationTitle: string;
  riskControlTitle: string;
  decisionTitle: string;
  technicalDetails: string;
  reviewCta: string;
  pendingCount: (count: number) => string;
  summaryWebsitePublish: string;
  recommendationWebsitePublish: string;
  reversibilityWebsitePublish: string;
  afterApproveWebsitePublish: string;
  afterRejectWebsitePublish: string;
  whatChangesWebsitePublish: string[];
  whatUnchangedWebsitePublish: string[];
  fallbackTitle: string;
  typeApproval: string;
};

export type ApprovalViewModel = NormalizedApprovalDetail & {
  displayTitle: string;
  displaySummary: string;
  statusLabel: string;
  riskLabel: string;
  riskDescription: string;
  riskTone: "info" | "low" | "moderate" | "high" | "critical";
  statusTone: "pending" | "success" | "danger" | "info" | "neutral" | "brand";
  sourceLabel: string;
  categoryLabel: string;
  roleLabel: string | null;
  localeLabel: string | null;
  createdAtDisplay: string | null;
  expiresAtDisplay: string | null;
  timeRemainingLabel: string | null;
  expiresSoon: boolean;
  recommendation: string;
  reversibility: string | null;
  whatChanges: string[];
  whatUnchanged: string[];
  afterApprove: string | null;
  afterReject: string | null;
  shortenedId: string;
  technicalRows: { key: string; label: string; value: string }[];
};

const SOON_THRESHOLD_MS = 6 * 60 * 60 * 1000;

export function resolveApprovalStatusLabel(
  status: string,
  labels: Record<string, string>,
): string {
  const key = status.trim().toLowerCase();
  return labels[key] ?? labels.pending ?? key;
}

export function resolveApprovalRiskKey(riskLevel: string | number | null | undefined): string {
  if (riskLevel == null || riskLevel === "") return "1";
  const raw = String(riskLevel).trim().toLowerCase();
  if (raw === "information" || raw === "none" || raw === "0") return "0";
  if (raw === "low" || raw === "1") return "1";
  if (raw === "medium" || raw === "moderate" || raw === "2") return "2";
  if (raw === "high" || raw === "3") return "3";
  if (raw === "critical" || raw === "4") return "4";
  if (/^\d+$/.test(raw)) return raw;
  return "1";
}

export function resolveApprovalRiskLabel(
  riskLevel: string | number | null | undefined,
  labels: Record<string, string>,
): string {
  const key = resolveApprovalRiskKey(riskLevel);
  return labels[key] ?? labels[key === "3" ? "high" : key] ?? labels["1"] ?? String(riskLevel ?? "");
}

export function resolveApprovalRiskTone(
  riskLevel: string | number | null | undefined,
): ApprovalViewModel["riskTone"] {
  switch (resolveApprovalRiskKey(riskLevel)) {
    case "0":
      return "info";
    case "1":
      return "low";
    case "2":
      return "moderate";
    case "3":
      return "high";
    case "4":
      return "critical";
    default:
      return "moderate";
  }
}

export function resolveApprovalStatusTone(status: string): ApprovalViewModel["statusTone"] {
  switch (status.trim().toLowerCase()) {
    case "pending":
    case "awaiting_approval":
      return "pending";
    case "approved":
    case "completed":
    case "consumed":
      return "success";
    case "rejected":
    case "failed":
    case "blocked":
      return "danger";
    case "executing":
    case "verifying":
      return "info";
    case "expired":
    case "cancelled":
    case "canceled":
      return "neutral";
    default:
      return "neutral";
  }
}

export function resolveApprovalRoleLabel(
  role: string | null | undefined,
  labels: Record<string, string>,
): string | null {
  if (!role) return null;
  const key = role.trim().toLowerCase().replace(/\s+/g, "_");
  return labels[key] ?? labels[role.trim().toLowerCase()] ?? null;
}

export function resolveApprovalSourceLabel(
  source: string,
  detail: NormalizedApprovalDetail,
  labels: Record<string, string>,
): string {
  if (detail.isWebsiteKompisPublish || detail.isWebsiteKompisRollback || source === "kompis") {
    return labels.kompis ?? labels.website_kompis ?? labels.websiteKompis ?? "Website Kompis";
  }
  const key = source.trim().toLowerCase();
  return labels[key] ?? labels.aipify ?? labels.default ?? source;
}

export function resolveApprovalDisplayTitle(
  detail: NormalizedApprovalDetail,
  labels: Pick<
    ApprovalPresentationLabels,
    "kompisPublishTitle" | "kompisRollbackTitle" | "kompisPublishDetailTitle" | "fallbackTitle"
  >,
): string {
  if (detail.isWebsiteKompisPublish) {
    return labels.kompisPublishDetailTitle || labels.kompisPublishTitle;
  }
  if (detail.isWebsiteKompisRollback) {
    return labels.kompisRollbackTitle;
  }
  const title = detail.title.trim();
  if (
    !title ||
    /^approval$/i.test(title) ||
    /pending trust approval/i.test(title) ||
    (detail.actionName && title.toLowerCase() === detail.actionName) ||
    /^[a-z0-9]+(?:_[a-z0-9]+)+$/i.test(title)
  ) {
    return labels.fallbackTitle;
  }
  if (/kompis website publish/i.test(title)) {
    return labels.kompisPublishTitle;
  }
  return title;
}

export function shortenTechnicalId(value: string | null | undefined, length = 8): string {
  if (!value) return "—";
  const trimmed = value.trim();
  if (trimmed.length <= length) return trimmed;
  return `${trimmed.slice(0, length)}…`;
}

export function isApprovalExpiringSoon(expiresAt: string | null | undefined, now = Date.now()): boolean {
  if (!expiresAt) return false;
  const ts = new Date(expiresAt).getTime();
  if (Number.isNaN(ts)) return false;
  const delta = ts - now;
  return delta > 0 && delta <= SOON_THRESHOLD_MS;
}

export function buildApprovalViewModel(
  item: CustomerApproval,
  options: {
    locale: string;
    labels: ApprovalPresentationLabels;
    emergencyActive?: boolean;
    technicalLabels: Record<string, string>;
  },
): ApprovalViewModel | null {
  const detail = normalizeApprovalDetail(item, { emergencyActive: options.emergencyActive });
  if (!detail) return null;

  const { labels, locale, technicalLabels } = options;
  const displayTitle = resolveApprovalDisplayTitle(detail, labels);
  const riskKey = resolveApprovalRiskKey(detail.riskLevel);
  const statusLabel = resolveApprovalStatusLabel(detail.status, labels.statusLabels);
  const riskLabel = resolveApprovalRiskLabel(detail.riskLevel, labels.riskLevels);
  const riskDescription = labels.riskDescriptions[riskKey] ?? labels.riskDescriptions["3"] ?? "";
  const roleLabel = resolveApprovalRoleLabel(detail.approverRoleRequired, labels.roleLabels);
  const sourceLabel = resolveApprovalSourceLabel(detail.source, detail, labels.sourceLabels);
  const categoryLabel =
    labels.categoryLabels[detail.category] ?? labels.typeApproval;
  const localeLabel = detail.websiteLocale
    ? labels.localeNames[detail.websiteLocale] ?? detail.websiteLocale.toUpperCase()
    : null;

  const isWebsite = detail.isWebsiteKompisPublish || detail.isWebsiteKompisRollback;
  const displaySummary = isWebsite
    ? labels.summaryWebsitePublish.replace("{path}", detail.websitePath ?? "—")
    : detail.description || displayTitle;
  const recommendation = isWebsite
    ? labels.recommendationWebsitePublish
    : detail.description || labels.recommendationWebsitePublish;
  const whatChanges = isWebsite ? labels.whatChangesWebsitePublish : [];
  const whatUnchanged = isWebsite ? labels.whatUnchangedWebsitePublish : [];

  const technicalRows: ApprovalViewModel["technicalRows"] = [];
  const pushTech = (key: string, value: string | null) => {
    if (!value) return;
    technicalRows.push({
      key,
      label: technicalLabels[key] ?? key,
      value,
    });
  };
  pushTech("approvalId", detail.id);
  pushTech("candidate", detail.candidateId);
  pushTech("currentVersion", detail.currentVersionId);
  pushTech("expectedVersion", detail.expectedCurrentVersionId);
  pushTech("checksum", detail.actionChecksum);
  pushTech("audit", detail.auditReference);
  pushTech("run", detail.runId);
  pushTech("step", detail.stepId);
  pushTech("tool", detail.toolKey);

  return {
    ...detail,
    displayTitle,
    displaySummary,
    statusLabel,
    riskLabel,
    riskDescription,
    riskTone: resolveApprovalRiskTone(detail.riskLevel),
    statusTone: resolveApprovalStatusTone(detail.status),
    sourceLabel,
    categoryLabel,
    roleLabel,
    localeLabel,
    createdAtDisplay: detail.createdAt ? formatDateTime(detail.createdAt, locale) : null,
    expiresAtDisplay: detail.expiresAt ? formatDateTime(detail.expiresAt, locale) : null,
    timeRemainingLabel: detail.expiresAt ? formatRelativeTime(detail.expiresAt, locale) : null,
    expiresSoon: isApprovalExpiringSoon(detail.expiresAt),
    recommendation,
    reversibility: isWebsite ? labels.reversibilityWebsitePublish : null,
    whatChanges,
    whatUnchanged,
    afterApprove: isWebsite ? labels.afterApproveWebsitePublish : null,
    afterReject: isWebsite ? labels.afterRejectWebsitePublish : null,
    shortenedId: shortenTechnicalId(detail.id),
    technicalRows,
  };
}

export const APPROVAL_STATUS_CHIP_CLASSES: Record<ApprovalViewModel["statusTone"], string> = {
  pending:
    "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100",
  success:
    "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100",
  danger: "bg-rose-100 text-rose-950 dark:bg-rose-950/40 dark:text-rose-100",
  info: "bg-sky-100 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100",
  brand:
    "bg-violet-100 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100",
  neutral: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100",
};

export const APPROVAL_RISK_CHIP_CLASSES: Record<ApprovalViewModel["riskTone"], string> = {
  info: "bg-sky-100 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100",
  low: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100",
  moderate: "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100",
  high: "bg-orange-100 text-orange-950 dark:bg-orange-950/40 dark:text-orange-100",
  critical: "bg-rose-100 text-rose-950 dark:bg-rose-950/40 dark:text-rose-100",
};
