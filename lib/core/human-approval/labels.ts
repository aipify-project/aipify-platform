import { readFileSync } from "node:fs";
import { readFile } from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { mergeDictionary } from "@/lib/i18n/merge-dictionary";
import type { Translator } from "@/lib/i18n/translate";
import type { Dictionary } from "@/lib/i18n/translate";
import {
  accessModeLabelKey,
  riskLabelKeyForLevel,
  statusLabelKey,
} from "./status-labels";

const LOCALES_ROOT = path.join(process.cwd(), "locales");

export type HumanApprovalUiLabels = {
  navLabel: string;
  title: string;
  subtitle: string;
  intro: string;
  loading: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  disabledTitle: string;
  disabledBody: string;
  forbiddenTitle: string;
  forbiddenBody: string;
  backToList: string;
  backToApp: string;
  viewDetail: string;
  latestAuditId: string;
  correlationId: string;
  auditTimelinePlaceholder: string;
  targetEnvironment: string;
  actionCategory: string;
  actionKey: string;
  scopeSummary: string;
  unchangedSummary: string;
  approvedBy: string;
  approverRole: string;
  executionResult: string;
  executionError: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  riskLevel: string;
  accessMode: string;
  status: string;
  summary: string;
  notAvailable: string;
  loadError: string;
  retry: string;
  statusLabels: Record<string, string>;
  riskLabels: Record<string, string>;
  accessModeLabels: Record<string, string>;
};

async function readHumanApprovalSplit(locale: Locale): Promise<Dictionary> {
  const filePath = path.join(LOCALES_ROOT, locale, "customer-app", "humanApproval.json");
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Dictionary;
  } catch {
    if (locale === DEFAULT_LOCALE) {
      throw new Error(`Human Approval locale file not found: ${filePath}`);
    }
    return readHumanApprovalSplit(DEFAULT_LOCALE);
  }
}

export async function loadHumanApprovalDictionary(locale: Locale): Promise<Dictionary> {
  const localized = await readHumanApprovalSplit(locale);
  const merged =
    locale === DEFAULT_LOCALE
      ? localized
      : mergeDictionary(await readHumanApprovalSplit(DEFAULT_LOCALE), localized);
  return { customerApp: { humanApproval: merged } };
}

export function readHumanApprovalLocaleFileSync(
  locale: string,
): Record<string, unknown> {
  const filePath = path.join(LOCALES_ROOT, locale, "customer-app", "humanApproval.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

export function buildHumanApprovalUiLabels(
  t: Translator,
): HumanApprovalUiLabels {
  const prefix = "customerApp.humanApproval";
  const statusKeys = [
    "pending",
    "approved",
    "denied",
    "expired",
    "revoked",
    "executing",
    "succeeded",
    "failed",
  ] as const;
  const riskKeys = ["information", "draft", "reversible", "sensitive", "critical"] as const;
  const accessKeys = ["oneTime", "ongoing"] as const;

  const statusLabels = Object.fromEntries(
    statusKeys.map((key) => [key, t(`${prefix}.status.${key}`)]),
  );
  const riskLabels = Object.fromEntries(
    riskKeys.map((key) => [key, t(`${prefix}.risk.${key}`)]),
  );
  const accessModeLabels = Object.fromEntries(
    accessKeys.map((key) => [key, t(`${prefix}.accessMode.${key}`)]),
  );

  return {
    navLabel: t(`${prefix}.navLabel`),
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    intro: t(`${prefix}.intro`),
    loading: t(`${prefix}.loading`),
    emptyTitle: t(`${prefix}.empty.title`),
    emptyBody: t(`${prefix}.empty.body`),
    emptyAction: t(`${prefix}.empty.action`),
    disabledTitle: t(`${prefix}.disabled.title`),
    disabledBody: t(`${prefix}.disabled.body`),
    forbiddenTitle: t(`${prefix}.forbidden.title`),
    forbiddenBody: t(`${prefix}.forbidden.body`),
    backToList: t(`${prefix}.backToList`),
    backToApp: t(`${prefix}.backToApp`),
    viewDetail: t(`${prefix}.viewDetail`),
    latestAuditId: t(`${prefix}.latestAuditId`),
    correlationId: t(`${prefix}.correlationId`),
    auditTimelinePlaceholder: t(`${prefix}.auditTimelinePlaceholder`),
    targetEnvironment: t(`${prefix}.targetEnvironment`),
    actionCategory: t(`${prefix}.actionCategory`),
    actionKey: t(`${prefix}.actionKey`),
    scopeSummary: t(`${prefix}.scopeSummary`),
    unchangedSummary: t(`${prefix}.unchangedSummary`),
    approvedBy: t(`${prefix}.approvedBy`),
    approverRole: t(`${prefix}.approverRole`),
    executionResult: t(`${prefix}.executionResult`),
    executionError: t(`${prefix}.executionError`),
    createdAt: t(`${prefix}.createdAt`),
    updatedAt: t(`${prefix}.updatedAt`),
    expiresAt: t(`${prefix}.expiresAt`),
    riskLevel: t(`${prefix}.riskLevel`),
    accessMode: t(`${prefix}.accessMode`),
    status: t(`${prefix}.statusLabel`),
    summary: t(`${prefix}.summary`),
    notAvailable: t(`${prefix}.notAvailable`),
    loadError: t(`${prefix}.loadError`),
    retry: t(`${prefix}.retry`),
    statusLabels,
    riskLabels,
    accessModeLabels,
  };
}

export function resolveHumanApprovalStatusLabel(
  labels: HumanApprovalUiLabels,
  status: string,
): string {
  const key = statusLabelKey(status).replace("status.", "");
  return labels.statusLabels[key] ?? status;
}

export function resolveHumanApprovalRiskLabel(
  labels: HumanApprovalUiLabels,
  level: number,
): string {
  const key = riskLabelKeyForLevel(level).replace("risk.", "");
  return labels.riskLabels[key] ?? String(level);
}

export function resolveHumanApprovalAccessModeLabel(
  labels: HumanApprovalUiLabels,
  mode: string,
): string {
  const key = accessModeLabelKey(mode).replace("accessMode.", "");
  return labels.accessModeLabels[key] ?? mode;
}

export function flattenHumanApprovalLabelKeys(value: unknown, prefix = ""): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }
  const entries: string[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      entries.push(...flattenHumanApprovalLabelKeys(nested, next));
    } else {
      entries.push(next);
    }
  }
  return entries;
}
