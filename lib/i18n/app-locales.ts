import { DEFAULT_LOCALE, type Locale } from "./config";
import {
  CUSTOMER_ACTIVE_LOCALE_ORDER,
  coerceToCustomerActiveLocale,
  getCustomerActiveLocaleDefinitions,
  isCustomerActiveLocale,
  resolveCustomerActiveLocale,
  type CustomerActiveLocale,
  type CustomerActiveLocaleDefinition,
} from "./customer-active-locale-registry";

/** @deprecated Prefer CUSTOMER_ACTIVE_LOCALE_ORDER — kept for existing imports. */
export const APP_LOCALE_ORDER = CUSTOMER_ACTIVE_LOCALE_ORDER;

export type AppLocale = CustomerActiveLocale;

export const APP_LOCALES: readonly AppLocale[] = APP_LOCALE_ORDER;

export function isAppLocale(value: string): value is AppLocale {
  return isCustomerActiveLocale(value);
}

export function resolveAppLocale(value: string | null | undefined): AppLocale {
  return resolveCustomerActiveLocale(value);
}

export type AppLocaleOption = CustomerActiveLocaleDefinition;

export function appLocaleOptions(): AppLocaleOption[] {
  return getCustomerActiveLocaleDefinitions();
}

/** Map any locale code to the nearest supported APP locale. */
export function coerceToAppLocale(value: string | null | undefined): AppLocale {
  return coerceToCustomerActiveLocale(value);
}

export function isLocaleUsableInApp(value: string): value is Locale {
  return isAppLocale(value);
}

export {
  CUSTOMER_ACTIVE_LOCALE_ORDER,
  getCustomerActiveLocaleDefinitions,
  isCustomerActiveLocale,
  coerceToCustomerActiveLocale,
  resolveCustomerActiveLocale,
} from "./customer-active-locale-registry";
