import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import { buildEntityLabelMap } from "./entity-resolution";
import { getIntegrationProviderManifest } from "./manifest-registry";
import { humanizeEntityKey, isMissingReportedVersion } from "./normalize-text";
import type {
  GenericIntegrationIntent,
  IntegrationPresentationMode,
  NormalizedPlatformSnapshotData,
} from "./types";

const BASE = "customerApp.companionPlatformKnowledge.integrationIntelligence";
const LEGACY_SNAPSHOT = "customerApp.companionPlatformKnowledge.platformSnapshot";

function interpolate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

function formatTimestamp(value: string, locale: string, unavailable: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function resolveEnvironmentLabel(environment: string, t: Translator): string {
  const normalized = environment.trim().toLowerCase();
  const key = `${LEGACY_SNAPSHOT}.environments.${normalized}`;
  const translated = t(key);
  return translated !== key ? translated : humanizeEntityKey(normalized);
}

function resolveAvailabilityLabel(
  availability: NormalizedPlatformSnapshotData["availability"],
  t: Translator,
): string {
  if (availability === "degraded") return t(`${LEGACY_SNAPSHOT}.card.availabilityDegraded`);
  if (availability === "maintenance") return t(`${LEGACY_SNAPSHOT}.card.availabilityMaintenance`);
  return t(`${LEGACY_SNAPSHOT}.card.availabilityAvailable`);
}

function resolveLocaleLabel(localeCode: string, t: Translator): string {
  const normalized = localeCode.toLowerCase().split("-")[0];
  const key = `${LEGACY_SNAPSHOT}.reportedLocales.${normalized}`;
  const translated = t(key);
  return translated !== key ? translated : normalized.toUpperCase();
}

function resolveProviderName(providerKey: string, t: Translator): string {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (manifest?.displayNameKey) {
    const translated = t(manifest.displayNameKey);
    if (translated !== manifest.displayNameKey) return translated;
  }
  return manifest?.displayName ?? humanizeEntityKey(providerKey);
}

export function buildLiveMetadataFooter(
  data: NormalizedPlatformSnapshotData,
  providerKey: string,
  t: Translator,
  locale: string,
): string {
  const unavailable = t(`${LEGACY_SNAPSHOT}.card.timestampUnavailable`);
  const checkedAt = formatTimestamp(data.checkedAt, locale, unavailable);
  const providerName = resolveProviderName(providerKey, t);
  return [
    interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.checkedAtFooter`), { checkedAt }),
    interpolate(t(`${BASE}.directAnswers.sourceFooterVerified`), { provider: providerName }),
  ].join("\n");
}

function buildEntityStatusAnswer(
  data: NormalizedPlatformSnapshotData,
  providerKey: string,
  targetEntityKeys: readonly string[],
  locale: CustomerActiveLocale,
  t: Translator,
): string {
  const labels = buildEntityLabelMap(providerKey, targetEntityKeys, locale, t);
  const activeSet = new Set(
    data.activeModules.filter((entry) => entry.active).map((entry) => entry.key),
  );

  return targetEntityKeys
    .map((entityKey) => {
      const label = labels[entityKey] ?? humanizeEntityKey(entityKey);
      return activeSet.has(entityKey)
        ? interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.moduleActiveLine`), { module: label })
        : interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.moduleInactiveLine`), { module: label });
    })
    .join("\n");
}

function buildActiveCapabilitiesAnswer(
  data: NormalizedPlatformSnapshotData,
  providerKey: string,
  locale: CustomerActiveLocale,
  t: Translator,
  providerName: string,
): string {
  const activeKeys = data.activeModules.filter((entry) => entry.active).map((entry) => entry.key);
  const labels = buildEntityLabelMap(providerKey, activeKeys, locale, t);
  const lines = activeKeys.map((key) => `• ${labels[key] ?? humanizeEntityKey(key)}`);
  return [
    interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.activeModulesIntro`), { provider: providerName }),
    ...lines,
  ].join("\n");
}

export function buildGenericPlatformAnswer(
  data: NormalizedPlatformSnapshotData,
  providerKey: string,
  locale: CustomerActiveLocale,
  uiLocale: string,
  t: Translator,
  intent: Pick<GenericIntegrationIntent, "queryKind" | "presentationMode" | "targetEntityKeys">,
): { directAnswer: string; explanation?: string } {
  const unavailable = t(`${LEGACY_SNAPSHOT}.card.timestampUnavailable`);
  const checkedAt = formatTimestamp(data.checkedAt, uiLocale, unavailable);
  const environment = resolveEnvironmentLabel(data.environment, t);
  const availability = resolveAvailabilityLabel(data.availability, t);
  const providerName = resolveProviderName(providerKey, t);

  let directAnswer = t(`${LEGACY_SNAPSHOT}.variants.fullSnapshot.intro`);
  switch (intent.queryKind) {
    case "entity_active_status":
      directAnswer = buildEntityStatusAnswer(
        data,
        providerKey,
        intent.targetEntityKeys ?? [],
        locale,
        t,
      );
      break;
    case "platform_supported_languages": {
      const names = data.supportedLocales.map((code) => resolveLocaleLabel(code, t));
      directAnswer = [
        interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.languagesIntro`), { provider: providerName }),
        ...names.map((name) => `• ${name}`),
      ].join("\n");
      break;
    }
    case "platform_version":
      directAnswer =
        data.version === null
          ? interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.versionMissing`), { provider: providerName })
          : interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.versionReported`), {
              version: data.version,
              provider: providerName,
            });
      break;
    case "platform_checked_at":
      directAnswer = interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.checkedAtDirect`), {
        checkedAt,
        provider: providerName,
      });
      break;
    case "platform_availability":
    case "platform_environment":
      directAnswer = interpolate(t(`${LEGACY_SNAPSHOT}.directAnswers.availabilityYes`), {
        status: availability,
        environment,
        provider: providerName,
      });
      break;
    case "list_capabilities":
    case "visibility_summary":
      directAnswer = buildActiveCapabilitiesAnswer(data, providerKey, locale, t, providerName);
      break;
    default:
      directAnswer = interpolate(t(`${BASE}.directAnswers.fullSummaryIntro`), { provider: providerName });
  }

  const explanation =
    intent.presentationMode === "direct_fact"
      ? buildLiveMetadataFooter(data, providerKey, t, uiLocale)
      : undefined;

  return { directAnswer, explanation };
}

export function shouldIncludePlatformCard(mode: IntegrationPresentationMode): boolean {
  return mode === "full_snapshot" || mode === "multi_item_summary";
}

export function buildNormalizedCardModules(
  data: NormalizedPlatformSnapshotData,
  providerKey: string,
  locale: CustomerActiveLocale,
  t: Translator,
): Record<string, string> {
  const activeKeys = data.activeModules.filter((entry) => entry.active).map((entry) => entry.key);
  return buildEntityLabelMap(providerKey, activeKeys, locale, t);
}

export function buildNormalizedCardLocales(
  data: NormalizedPlatformSnapshotData,
  t: Translator,
): Record<string, string> {
  return Object.fromEntries(
    data.supportedLocales.map((code) => {
      const normalized = code.toLowerCase().split("-")[0];
      return [normalized, resolveLocaleLabel(normalized, t)];
    }),
  );
}

export function resolveNormalizedVersionDisplay(version: string | null, t: Translator): string {
  if (version === null || isMissingReportedVersion(version)) {
    return t(`${LEGACY_SNAPSHOT}.card.platformVersionUnavailable`);
  }
  return version.trim();
}
