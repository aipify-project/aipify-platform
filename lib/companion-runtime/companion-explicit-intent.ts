import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";

export type CompanionExplicitIntentKind =
  | "companion_registration_meta"
  | "knowledge_provider_fetch"
  | "media_verification"
  | "integration_install_check";

export type CompanionExplicitIntent = {
  kind: CompanionExplicitIntentKind;
  provider_hint: string | null;
  integration_hint: string | null;
};

const PROVIDER_ENTITY_PATTERNS = [
  /\b(?:fra|from|for)\s+([a-z0-9][a-z0-9_\s-]{2,}?)(?:\s+(?:faq|kunnskaps|knowledge|help|hjelp(?:e)?seksjon|artikkel|article|seksjon|section|provider|system|organisasjon|organization)\b|\s*$)/i,
  /\b(?:fra|from|for|i|in|på|on)\s+([a-z0-9][a-z0-9_-]{2,})\b/i,
];

const GENERIC_INTEGRATION_ALIASES: Readonly<Record<string, string>> = {
  shopify: "shopify",
  wordpress: "wordpress",
  canva: "canva",
  analytics: "google_analytics",
  "google analytics": "google_analytics",
};

function normalizeProviderHint(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/** Extract organization/provider entity from natural phrasing — no customer aliases. */
export function extractProviderEntityHint(query: string): string | null {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return null;

  for (const pattern of PROVIDER_ENTITY_PATTERNS) {
    const match = normalized.match(pattern);
    const candidate = match?.[1]?.trim();
    if (!candidate || candidate.length < 2) continue;
    const lowered = candidate.toLowerCase();
    if (lowered in GENERIC_INTEGRATION_ALIASES) continue;
    return normalizeProviderHint(candidate);
  }

  return null;
}

function extractIntegrationHint(normalized: string): string | null {
  if (/\bgoogle analytics\b/i.test(normalized)) return "google_analytics";
  for (const [alias, key] of Object.entries(GENERIC_INTEGRATION_ALIASES)) {
    if (alias.includes(" ")) {
      if (normalized.includes(alias)) return key;
      continue;
    }
    if (new RegExp(`\\b${alias}\\b`, "i").test(normalized)) return key;
  }
  return null;
}

/** Companion identity — not organization member data. */
export function isCompanionRegistrationMetaQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;

  const aboutCompanion =
    /\b(aipify|companion)\b/i.test(normalized) ||
    /\b(hvilken side|which page|hvilket domene|which domain|where are you)\b/i.test(normalized) ||
    (/\b(du|you)\b/i.test(normalized) &&
      /\b(hvilken side|which page|hvilket domene|which domain|registrert|registered)\b/i.test(normalized));

  const registrationMeta =
    /\b(hvilken side|which page|hvilket domene|which domain|where are you registered|registrert på|registered on)\b/i.test(
      normalized,
    );

  const memberDataSignal =
    /\b(medlem|member|medlemmer|members|antall|how many|hvor mange|kunde|customer)\b/i.test(normalized);

  return aboutCompanion && registrationMeta && !memberDataSignal;
}

export function isKnowledgeProviderFetchQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;

  const knowledgeFetchVerb =
    /\b(hent|get|fetch|vis|show|finn|find|list|liste|importer|import|load)\b/i.test(normalized);
  const knowledgeTarget =
    /\b(faq|kunnskaps\w*|knowledge center|knowledge base|help section|hjelp(?:e)?seksjon\w*|artikkel|article section|organisasjonskunnskap|organization knowledge|provider knowledge)\b/i.test(
      normalized,
    );

  return knowledgeFetchVerb && knowledgeTarget;
}

export function isMediaVerificationQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;

  return (
    /\b(bilde|bilder|image|images|photo|photos|foto|media)\b/i.test(normalized) &&
    /\b(verifis\w*|verify|verification|godkjen\w*|approve)\b/i.test(normalized)
  );
}

export function isIntegrationInstallCheckQuery(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  if (!normalized.trim()) return false;

  const integrationNamed =
    /\b(google analytics|analytics|integrasjon|integration|sporing|tracking|tag manager|shopify|wordpress|canva)\b/i.test(
      normalized,
    );
  const installCheck =
    /\b(installert|installed|installasjon|installation|koblet|connected|riktig|correctly|sjekk|check)\b/i.test(
      normalized,
    );

  return integrationNamed && installCheck;
}

export function resolveCompanionExplicitIntent(query: string): CompanionExplicitIntent | null {
  const normalized = normalizeIntegrationQuery(query);
  const providerHint = extractProviderEntityHint(query);
  const integrationHint = extractIntegrationHint(normalized);

  if (isCompanionRegistrationMetaQuery(query)) {
    return { kind: "companion_registration_meta", provider_hint: null, integration_hint: null };
  }
  if (isMediaVerificationQuery(query)) {
    return { kind: "media_verification", provider_hint: providerHint, integration_hint: null };
  }
  if (isKnowledgeProviderFetchQuery(query)) {
    return { kind: "knowledge_provider_fetch", provider_hint: providerHint, integration_hint: null };
  }
  if (isIntegrationInstallCheckQuery(query)) {
    return {
      kind: "integration_install_check",
      provider_hint: providerHint,
      integration_hint: integrationHint,
    };
  }
  return null;
}

export function blocksOrganizationMemberCapabilityQuery(query: string): boolean {
  return isCompanionRegistrationMetaQuery(query);
}
