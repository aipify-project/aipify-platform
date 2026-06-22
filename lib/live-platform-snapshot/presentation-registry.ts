import type { Translator } from "@/lib/i18n/translate";

export const LIVE_PLATFORM_SNAPSHOT_I18N_BASE =
  "customerApp.companionPlatformKnowledge.platformSnapshot";

const MODULE_KEY_PATTERN = /^[a-z][a-z0-9_]{0,48}$/;

export type LivePlatformProviderKey = "unonight";

export function moduleLabelKey(moduleKey: string): string {
  return `${LIVE_PLATFORM_SNAPSHOT_I18N_BASE}.modules.${moduleKey}`;
}

export function reportedLocaleLabelKey(localeCode: string): string {
  const normalized = localeCode.toLowerCase().split("-")[0];
  return `${LIVE_PLATFORM_SNAPSHOT_I18N_BASE}.reportedLocales.${normalized}`;
}

export function environmentLabelKey(environment: string): string {
  const normalized = environment.trim().toLowerCase();
  return `${LIVE_PLATFORM_SNAPSHOT_I18N_BASE}.environments.${normalized}`;
}

export function humanizeModuleKeyFallback(moduleKey: string): string {
  return moduleKey
    .trim()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isMissingPlatformVersion(value: string | null | undefined): boolean {
  const trimmed = String(value ?? "").trim().toLowerCase();
  return !trimmed || trimmed === "unknown" || trimmed === "undefined" || trimmed === "null";
}

export function resolveProviderModuleLabel(
  moduleKey: string,
  t: Translator,
  provider: LivePlatformProviderKey = "unonight",
): string {
  void provider;
  const normalized = moduleKey.trim().toLowerCase();
  if (!MODULE_KEY_PATTERN.test(normalized)) {
    return humanizeModuleKeyFallback(moduleKey);
  }

  const key = moduleLabelKey(normalized);
  const translated = t(key);
  if (translated !== key) return translated;

  const fallback = humanizeModuleKeyFallback(normalized);
  console.info("[live-platform-snapshot] missing module label", {
    provider,
    module_key: normalized,
    fallback,
  });
  return fallback;
}

export function resolveReportedLocaleLabel(localeCode: string, t: Translator): string {
  const normalized = localeCode.toLowerCase().split("-")[0];
  const key = reportedLocaleLabelKey(normalized);
  const translated = t(key);
  if (translated !== key) return translated;
  return normalized.toUpperCase();
}

export function resolveEnvironmentLabel(environment: string, t: Translator): string {
  const normalized = environment.trim().toLowerCase();
  const key = environmentLabelKey(normalized);
  const translated = t(key);
  if (translated !== key) return translated;
  return humanizeModuleKeyFallback(normalized);
}

export function resolvePlatformVersionDisplay(version: string, t: Translator): string {
  if (isMissingPlatformVersion(version)) {
    return t(`${LIVE_PLATFORM_SNAPSHOT_I18N_BASE}.card.platformVersionUnavailable`);
  }
  return version.trim();
}

export function buildLocalizedModuleLabelMap(
  moduleKeys: readonly string[],
  t: Translator,
  provider: LivePlatformProviderKey = "unonight",
): Record<string, string> {
  return Object.fromEntries(
    moduleKeys.map((moduleKey) => [moduleKey, resolveProviderModuleLabel(moduleKey, t, provider)]),
  );
}

export function buildReportedLocaleLabelMap(
  localeCodes: readonly string[],
  t: Translator,
): Record<string, string> {
  return Object.fromEntries(
    localeCodes.map((code) => {
      const normalized = code.toLowerCase().split("-")[0];
      return [normalized, resolveReportedLocaleLabel(normalized, t)];
    }),
  );
}
