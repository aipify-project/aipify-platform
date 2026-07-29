import { CORE_LOCALES, EXTENDED_LOCALES, LOCALES, type Locale } from "@/lib/i18n/config";

/** Dynamic locale registry for Operator Workspace — no hardcoded language switches. */
export function discoverOperatorLocales(): readonly Locale[] {
  return LOCALES;
}

export function discoverCoreOperatorLocales() {
  return CORE_LOCALES;
}

export function discoverExtendedOperatorLocales() {
  return EXTENDED_LOCALES;
}
