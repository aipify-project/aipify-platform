import { parseAssistantIdentityBundle } from "@/lib/aipify/assistant-identity/parse";
import type { AssistantIdentityBundle } from "@/lib/aipify/assistant-identity/types";
import { parseCompanionIdentityRelationshipCenter } from "@/lib/companion-identity-relationship/parse";
import type { CompanionIdentitySettings } from "@/lib/companion-identity-relationship/types";
import { parseIdentityCenter } from "@/lib/identity-engine/parse";
import type { IdentityCenterBundle, IdentityProfile } from "@/lib/identity-engine/types";
import { parsePersonalityCard } from "@/lib/aipify/personality/parse";
import type { PersonalityCard } from "@/lib/aipify/personality/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";

export type CompanionIdentityFreshness = "fresh" | "stale" | "unknown";

export type CompanionIdentityContext = {
  brand_name: string;
  preferred_name: string | null;
  language: CustomerActiveLocale;
  tone: string;
  formality: string;
  detail_level: string;
  empathy_enabled: boolean;
  humor_enabled: boolean;
  humor_style: string;
  warmth_level: string;
  organization_identity: string | null;
  user_preferences: Record<string, string | boolean | null>;
  safety_boundaries: string[];
  freshness: CompanionIdentityFreshness;
  identity_profile: IdentityProfile | null;
  personalization_enabled: boolean;
  crisis_mode_active: boolean;
  serious_context_only: boolean;
};

const FRESH_MS = 24 * 60 * 60 * 1000;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveFreshness(values: Array<string | null | undefined>): CompanionIdentityFreshness {
  let latest: number | null = null;
  for (const value of values) {
    if (!value) continue;
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) continue;
    if (latest === null || parsed > latest) latest = parsed;
  }
  if (latest === null) return "unknown";
  return Date.now() - latest <= FRESH_MS ? "fresh" : "stale";
}

function mapWarmthLevel(personalityMode: string | undefined): string {
  switch (personalityMode) {
    case "playful":
      return "high";
    case "warm_professional":
      return "moderate";
    case "professional":
      return "low";
    default:
      return "moderate";
  }
}

function mapFormality(profile: IdentityProfile | null, orgSettings: CompanionIdentitySettings | null): string {
  const style = profile?.communication_style ?? orgSettings?.tone_preference ?? "supportive";
  if (style === "formal" || style === "professional") return "formal";
  if (style === "minimal" || style === "short_effective") return "concise";
  return "balanced";
}

export function createEmptyCompanionIdentityContext(
  overrides?: Partial<CompanionIdentityContext>,
): CompanionIdentityContext {
  return {
    brand_name: "Aipify",
    preferred_name: null,
    language: "en",
    tone: "supportive",
    formality: "balanced",
    detail_level: "balanced",
    empathy_enabled: true,
    humor_enabled: false,
    humor_style: "subtle",
    warmth_level: "moderate",
    organization_identity: null,
    user_preferences: {},
    safety_boundaries: [],
    freshness: "unknown",
    identity_profile: null,
    personalization_enabled: false,
    crisis_mode_active: false,
    serious_context_only: false,
    ...overrides,
  };
}

export type NormalizeIdentityInput = {
  locale: CustomerActiveLocale;
  identityCenter: IdentityCenterBundle | null;
  assistantIdentity: AssistantIdentityBundle | null;
  personality: PersonalityCard | null;
  companionRelationship: ReturnType<typeof parseCompanionIdentityRelationshipCenter> | null;
  permissionDenied?: boolean;
};

export function normalizeCompanionIdentityContext(
  input: NormalizeIdentityInput,
): CompanionIdentityContext {
  if (input.permissionDenied) {
    return createEmptyCompanionIdentityContext({
      language: input.locale,
      empathy_enabled: false,
      humor_enabled: false,
      personalization_enabled: false,
      safety_boundaries: ["permission_denied"],
    });
  }

  const orgSettings = input.companionRelationship?.settings ?? null;
  const profile = input.identityCenter?.profile ?? null;
  const preferences = input.assistantIdentity?.preferences ?? null;
  const personalityMode =
    input.personality?.personality_mode ??
    orgSettings?.tone_preference ??
    "warm_professional";

  const humorPreference = orgSettings?.humor_preference ?? "subtle";
  const humorEnabled =
    Boolean(input.personality?.humor_enabled ?? humorPreference !== "off") &&
    humorPreference !== "none" &&
    humorPreference !== "off";

  const empathyEnabled =
    Boolean(preferences?.allow_encouragement ?? orgSettings?.encouragement_preference !== "minimal") &&
    Boolean(profile?.boundaries?.no_emotional_pressure ?? true);

  const safetyBoundaries = [
    ...(input.identityCenter?.boundary_principles ?? []),
    ...(profile?.boundaries?.no_guilt ? ["no_guilt"] : []),
    ...(profile?.boundaries?.no_emotional_pressure ? ["no_emotional_pressure"] : []),
    ...(profile?.boundaries?.no_dependency_encouragement ? ["no_dependency_encouragement"] : []),
  ];

  const preferredName =
    str(input.assistantIdentity?.profile?.preferred_address_name) ||
    str(input.assistantIdentity?.profile?.assistant_owner_name) ||
    str(input.assistantIdentity?.display_name) ||
    str(input.identityCenter?.user_name) ||
    null;

  return createEmptyCompanionIdentityContext({
    brand_name: str(orgSettings?.official_name) || "Aipify",
    preferred_name: preferredName,
    language: input.locale,
    tone: profile?.tone ?? orgSettings?.tone_preference ?? "supportive",
    formality: mapFormality(profile, orgSettings),
    detail_level: profile?.response_length ?? "balanced",
    empathy_enabled: empathyEnabled,
    humor_enabled: humorEnabled,
    humor_style: humorPreference,
    warmth_level: mapWarmthLevel(personalityMode),
    organization_identity: orgSettings?.relationship_mode ?? null,
    user_preferences: {
      communication_style: profile?.communication_style ?? null,
      proactivity_level: profile?.proactivity_level ?? orgSettings?.proactivity_level ?? null,
      name_usage: profile?.name_usage ?? null,
      notification_style: profile?.notification_style ?? orgSettings?.notification_style ?? null,
      allow_personalized_phrases: preferences?.allow_personalized_phrases ?? null,
      allow_encouragement: preferences?.allow_encouragement ?? null,
      briefing_style: orgSettings?.briefing_style ?? null,
      personalization_enabled: orgSettings?.personalization_enabled ?? null,
    },
    safety_boundaries: [...new Set(safetyBoundaries.filter(Boolean))],
    freshness: resolveFreshness([
      profile?.updated_at,
      input.assistantIdentity?.profile?.welcome_completed_at ?? null,
    ]),
    identity_profile: profile,
    personalization_enabled: Boolean(orgSettings?.personalization_enabled ?? input.assistantIdentity?.enabled),
    crisis_mode_active: false,
    serious_context_only: false,
  });
}

export function parseIdentityRpcPayloads(input: {
  identityCenterRaw: unknown;
  assistantIdentityRaw: unknown;
  personalityRaw: unknown;
  companionRelationshipRaw: unknown;
}): {
  identityCenter: IdentityCenterBundle | null;
  assistantIdentity: AssistantIdentityBundle | null;
  personality: PersonalityCard | null;
  companionRelationship: ReturnType<typeof parseCompanionIdentityRelationshipCenter> | null;
} {
  return {
    identityCenter:
      input.identityCenterRaw && typeof input.identityCenterRaw === "object"
        ? parseIdentityCenter(input.identityCenterRaw)
        : null,
    assistantIdentity:
      input.assistantIdentityRaw && typeof input.assistantIdentityRaw === "object"
        ? parseAssistantIdentityBundle(input.assistantIdentityRaw)
        : null,
    personality:
      input.personalityRaw && typeof input.personalityRaw === "object"
        ? parsePersonalityCard(input.personalityRaw)
        : null,
    companionRelationship:
      input.companionRelationshipRaw && typeof input.companionRelationshipRaw === "object"
        ? parseCompanionIdentityRelationshipCenter(input.companionRelationshipRaw)
        : null,
  };
}
