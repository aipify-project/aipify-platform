import type { Translator } from "@/lib/i18n/translate";
import {
  buildLocalizedModuleLabelMap,
  buildReportedLocaleLabelMap,
  resolveEnvironmentLabel,
  resolvePlatformVersionDisplay,
} from "@/lib/live-platform-snapshot/presentation-registry";
import type { UnonightPlatformSnapshotMetadata } from "./platform-snapshot-tool";
import type { PlatformSnapshotCardLabels, PlatformSnapshotCardPayload } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.platformSnapshot";

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
  const languageLabels = buildReportedLocaleLabelMap(metadata.supported_locales, t);
  const moduleLabels = buildLocalizedModuleLabelMap(metadata.active_modules, t, "unonight");

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
    environmentDisplay: resolveEnvironmentLabel(metadata.environment, t),
    platformVersionDisplay: resolvePlatformVersionDisplay(metadata.platform_version, t),
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
