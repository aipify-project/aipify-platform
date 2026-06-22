import { LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/translate";
import type { ConnectedIntegrationStatusMetadata } from "./integration-status-tool";
import type { IntegrationStatusCardPayload } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.integrationStatus";

const KNOWN_SCOPE_DESCRIPTION_KEYS: Record<string, string> = {
  "metadata.read": `${BASE}.card.scopes.metadataRead`,
  "organization.read": `${BASE}.card.scopes.organizationRead`,
  "integration.status.read": `${BASE}.card.scopes.integrationStatusRead`,
};

function resolveLanguageLabel(code: string, t: Translator): string {
  const normalized = code.toLowerCase().split("-")[0];
  const fromCatalog = LOCALE_LABELS[normalized as Locale];
  if (fromCatalog) return fromCatalog;
  return code.toUpperCase();
}

export function buildIntegrationStatusCardPayload(
  metadata: ConnectedIntegrationStatusMetadata,
  t: Translator,
): IntegrationStatusCardPayload {
  const scopeItems = metadata.scopes.map((scope) => ({
    scope,
    description: KNOWN_SCOPE_DESCRIPTION_KEYS[scope]
      ? t(KNOWN_SCOPE_DESCRIPTION_KEYS[scope])
      : t(`${BASE}.card.scopes.unknown`),
  }));

  const languageLabels = Object.fromEntries(
    metadata.supported_locales.map((code) => [code, resolveLanguageLabel(code, t)]),
  );

  return {
    provider: metadata.provider,
    organizationName: metadata.organization_name,
    organizationId: metadata.organization_id,
    apiVersion: metadata.api_version,
    baseUrl: metadata.base_url,
    scopes: metadata.scopes,
    supportedLocales: metadata.supported_locales,
    lastVerifiedAt: metadata.last_verified_at,
    lastUsedAt: metadata.last_used_at,
    checkedAt: metadata.checked_at,
    labels: {
      cardTitle: t(`${BASE}.card.title`),
      cardSupporting: t(`${BASE}.card.supporting`),
      fieldOrganization: t(`${BASE}.card.fieldOrganization`),
      fieldOrganizationId: t(`${BASE}.card.fieldOrganizationId`),
      fieldApiVersion: t(`${BASE}.card.fieldApiVersion`),
      fieldAccessMode: t(`${BASE}.card.fieldAccessMode`),
      fieldConnectionStatus: t(`${BASE}.card.fieldConnectionStatus`),
      fieldBaseUrl: t(`${BASE}.card.fieldBaseUrl`),
      fieldLastVerified: t(`${BASE}.card.fieldLastVerified`),
      fieldLastUsed: t(`${BASE}.card.fieldLastUsed`),
      fieldScopes: t(`${BASE}.card.fieldScopes`),
      fieldSupportedLanguages: t(`${BASE}.card.fieldSupportedLanguages`),
      accessModeReadOnly: t(`${BASE}.accessModeReadOnly`),
      statusConnectedVerified: t(`${BASE}.statusConnectedVerified`),
      timestampUnavailable: t(`${BASE}.card.timestampUnavailable`),
      scopesExplainShow: t(`${BASE}.card.scopesExplainShow`),
      scopesExplainHide: t(`${BASE}.card.scopesExplainHide`),
      sourceTitle: t(`${BASE}.card.sourceTitle`),
      sourceLabel: t(`${BASE}.sourceVerifiedIntegration`),
      sourceMeta: t(`${BASE}.card.sourceMeta`),
      languagesUnavailable: t(`${BASE}.localesUnavailable`),
      scopeItems,
      languageLabels,
      ariaCard: t(`${BASE}.card.ariaCard`),
      ariaScopesToggle: t(`${BASE}.card.ariaScopesToggle`),
    },
  };
}
