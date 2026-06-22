/**
 * Backward-compatible shim — entity aliases live in provider manifests.
 * @see lib/integration-intelligence/providers/unonight/manifest.ts
 */
import {
  resolveEntityKeysFromQuery,
  resolveFollowUpEntityKeys,
} from "@/lib/integration-intelligence/entity-resolution";
import { UNONIGHT_INTEGRATION_MANIFEST } from "@/lib/integration-intelligence/providers/unonight/manifest";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";

const MODULE_KEYS = [
  "registration",
  "marketplace",
  "chat",
  "public_chat",
  "private_chat",
  "referrals",
  "gifts",
  "birthday_rewards",
  "mobile_api",
] as const;

export type UnonightModuleKey = (typeof MODULE_KEYS)[number];

export const UNONIGHT_MODULE_KEYS: readonly UnonightModuleKey[] = UNONIGHT_INTEGRATION_MANIFEST.entities
  .filter((entity) => entity.type === "module")
  .map((entity) => entity.key)
  .filter((key): key is UnonightModuleKey => (MODULE_KEYS as readonly string[]).includes(key));

const MODULE_KEY_SET = new Set<string>(UNONIGHT_MODULE_KEYS);

export type PlatformSnapshotFollowUpContext = {
  activeModules?: readonly string[];
};

export function extractUnonightModuleKeysFromQuery(
  query: string,
  locale: CustomerActiveLocale = "no",
): UnonightModuleKey[] {
  return resolveEntityKeysFromQuery(query, "unonight", locale).filter(isUnonightModuleKey);
}

export function resolveFollowUpModuleKeys(
  query: string,
  context?: PlatformSnapshotFollowUpContext,
  locale: CustomerActiveLocale = "no",
): UnonightModuleKey[] {
  return resolveFollowUpEntityKeys(query, "unonight", locale, {
    activeModuleKeys: context?.activeModules,
  }).filter(isUnonightModuleKey);
}

export function isUnonightModuleKey(value: string): value is UnonightModuleKey {
  return MODULE_KEY_SET.has(value);
}
