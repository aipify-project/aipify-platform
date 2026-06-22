import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import { getIntegrationProviderManifest } from "./manifest-registry";
import { humanizeEntityKey, normalizeIntegrationQuery, phraseMatchesQuery } from "./normalize-text";
import type { IntegrationIntelligenceContext, IntegrationManifestEntity, IntegrationProviderManifest } from "./types";

type AliasMatch = {
  entityKey: string;
  phrase: string;
  length: number;
};

function collectAliasMatches(
  query: string,
  manifest: IntegrationProviderManifest,
  locale: CustomerActiveLocale,
): AliasMatch[] {
  const matches: AliasMatch[] = [];

  for (const entity of manifest.entities) {
    const aliasGroups = entity.aliases ?? {};
    const localeAliases = [
      ...(aliasGroups[locale] ?? []),
      ...(aliasGroups.en ?? []),
      ...Object.values(aliasGroups).flat(),
    ];

    for (const phrase of localeAliases) {
      if (phraseMatchesQuery(query, phrase)) {
        matches.push({ entityKey: entity.key, phrase, length: phrase.length });
      }
    }

    if (phraseMatchesQuery(query, entity.key.replace(/_/g, " "))) {
      matches.push({ entityKey: entity.key, phrase: entity.key, length: entity.key.length });
    }
  }

  return matches.sort((a, b) => b.length - a.length);
}

function dedupeEntityKeys(keys: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const key of keys) {
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(key);
  }
  return result;
}

function refineModuleMatches(entityKeys: string[]): string[] {
  const hasSpecificChat = entityKeys.some((key) => key === "public_chat" || key === "private_chat");
  if (!hasSpecificChat) return entityKeys;
  return entityKeys.filter((key) => key !== "chat");
}

export function resolveEntityKeysFromQuery(
  query: string,
  providerKey: string,
  locale: CustomerActiveLocale,
): string[] {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest) return [];

  const matches = collectAliasMatches(query, manifest, locale);
  const keys = dedupeEntityKeys(matches.map((match) => match.entityKey));
  return refineModuleMatches(keys);
}

export function resolveFollowUpEntityKeys(
  query: string,
  providerKey: string,
  locale: CustomerActiveLocale,
  context?: IntegrationIntelligenceContext["snapshotContext"],
): string[] {
  const normalized = normalizeIntegrationQuery(query);

  if (
    /(begge chattypen|both chat types|bada chatttyper|begge chat|ambos tipos de chat|oba typy czatu|obydva typy chatu)/.test(
      normalized,
    )
  ) {
    return ["public_chat", "private_chat"];
  }

  const extracted = resolveEntityKeysFromQuery(query, providerKey, locale);
  if (/(blant dem|among them|bland dem|entre ellos|wsrod nich|seredi nych)/.test(normalized)) {
    return extracted;
  }

  void context;
  return extracted;
}

export function resolveEntityDisplayName(
  entity: IntegrationManifestEntity,
  locale: CustomerActiveLocale,
  t: Translator,
): string {
  if (entity.displayNameKey) {
    const translated = t(entity.displayNameKey);
    if (translated !== entity.displayNameKey) return translated;
  }
  return entity.displayNames?.[locale] ?? entity.displayNames?.en ?? humanizeEntityKey(entity.key);
}

export function buildEntityLabelMap(
  providerKey: string,
  entityKeys: readonly string[],
  locale: CustomerActiveLocale,
  t: Translator,
): Record<string, string> {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest) {
    return Object.fromEntries(entityKeys.map((key) => [key, humanizeEntityKey(key)]));
  }

  const entityByKey = new Map(manifest.entities.map((entity) => [entity.key, entity]));
  return Object.fromEntries(
    entityKeys.map((key) => {
      const entity = entityByKey.get(key);
      return [key, entity ? resolveEntityDisplayName(entity, locale, t) : humanizeEntityKey(key)];
    }),
  );
}

export function mentionsProvider(
  query: string,
  manifest: IntegrationProviderManifest,
): boolean {
  const normalized = normalizeIntegrationQuery(query);
  const providerKey = normalizeIntegrationQuery(manifest.provider).replace(/_/g, " ");
  const displayName = normalizeIntegrationQuery(manifest.displayName);
  return (
    normalized.includes(providerKey) ||
    normalized.includes(displayName) ||
    normalized.includes(normalizeIntegrationQuery(manifest.provider))
  );
}

export function hasProviderContext(
  manifest: IntegrationProviderManifest,
  options?: IntegrationIntelligenceContext,
): boolean {
  return options?.activeProviderKey === manifest.provider;
}
