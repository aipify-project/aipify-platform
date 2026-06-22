import { LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/translate";
import type { UnonightPlatformSnapshotMetadata } from "./platform-snapshot-tool";
import type { PlatformSnapshotCardLabels, PlatformSnapshotCardPayload } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.platformSnapshot";

const MODULE_LABEL_KEYS: Record<string, string> = {
  chat: `${BASE}.modules.chat`,
  marketplace: `${BASE}.modules.marketplace`,
  wishlist: `${BASE}.modules.wishlist`,
  gifts: `${BASE}.modules.gifts`,
  verification: `${BASE}.modules.verification`,
  rewards: `${BASE}.modules.rewards`,
};

function resolveLanguageLabel(code: string): string {
  const normalized = code.toLowerCase().split("-")[0];
  return LOCALE_LABELS[normalized as Locale] ?? code.toUpperCase();
}

function resolveModuleLabel(moduleKey: string, t: Translator): string {
  const key = MODULE_LABEL_KEYS[moduleKey];
  return key ? t(key) : moduleKey;
}

function availabilityLabel(
  status: UnonightPlatformSnapshotMetadata["status"],
  t: Translator,
): string {
  if (status === "degraded") return t(`${BASE}.card.availabilityDegraded`);
  if (status === "maintenance") return t(`${BASE}.card.availabilityMaintenance`);
  return t(`${BASE}.card.availabilityAvailable`);
}

export function buildPlatformSnapshotCardPayload(
  metadata: UnonightPlatformSnapshotMetadata,
  t: Translator,
): PlatformSnapshotCardPayload {
  const languageLabels = Object.fromEntries(
    metadata.supported_locales.map((code) => [code, resolveLanguageLabel(code)]),
  );
  const moduleLabels = Object.fromEntries(
    metadata.active_modules.map((moduleKey) => [moduleKey, resolveModuleLabel(moduleKey, t)]),
  );

  const labels: PlatformSnapshotCardLabels = {
    cardTitle: t(`${BASE}.card.title`),
    cardSupporting: t(`${BASE}.card.supporting`),
    fieldEnvironment: t(`${BASE}.card.fieldEnvironment`),
    fieldPlatformVersion: t(`${BASE}.card.fieldPlatformVersion`),
    fieldAvailability: t(`${BASE}.card.fieldAvailability`),
    fieldActiveModules: t(`${BASE}.card.fieldActiveModules`),
    fieldSupportedLanguages: t(`${BASE}.card.fieldSupportedLanguages`),
    fieldCheckedAt: t(`${BASE}.card.fieldCheckedAt`),
    timestampUnavailable: t(`${BASE}.card.timestampUnavailable`),
    availabilityAvailable: t(`${BASE}.card.availabilityAvailable`),
    availabilityDegraded: t(`${BASE}.card.availabilityDegraded`),
    availabilityMaintenance: t(`${BASE}.card.availabilityMaintenance`),
    sourceTitle: t(`${BASE}.card.sourceTitle`),
    sourceLabel: t(`${BASE}.sourceVerifiedIntegration`),
    sourceMeta: t(`${BASE}.card.sourceMeta`),
    languagesUnavailable: t(`${BASE}.card.languagesUnavailable`),
    languageLabels,
    moduleLabels,
    ariaCard: t(`${BASE}.card.ariaCard`),
  };

  return {
    provider: metadata.provider,
    environment: metadata.environment,
    platformVersion: metadata.platform_version,
    availabilityStatus: metadata.status,
    activeModules: metadata.active_modules,
    supportedLocales: metadata.supported_locales,
    checkedAt: metadata.checked_at,
    labels,
  };
}

export function getPlatformSnapshotAvailabilityLabel(
  card: PlatformSnapshotCardPayload,
): string {
  if (card.availabilityStatus === "degraded") return card.labels.availabilityDegraded;
  if (card.availabilityStatus === "maintenance") return card.labels.availabilityMaintenance;
  return card.labels.availabilityAvailable;
}

export { availabilityLabel };
