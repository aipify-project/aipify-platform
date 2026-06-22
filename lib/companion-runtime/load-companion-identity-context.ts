import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  createEmptyCompanionIdentityContext,
  normalizeCompanionIdentityContext,
  parseIdentityRpcPayloads,
  type CompanionIdentityContext,
} from "./companion-identity-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

export async function loadCompanionIdentityContext(
  supabase: SupabaseClient,
  locale: CustomerActiveLocale,
): Promise<CompanionIdentityContext> {
  const requests = await Promise.all([
    supabase.rpc("get_customer_identity_center").then(({ data, error }) => ({
      kind: "identity" as const,
      data,
      error: error?.message ?? null,
    })),
    supabase.rpc("get_assistant_identity_profile").then(({ data, error }) => ({
      kind: "assistant" as const,
      data,
      error: error?.message ?? null,
    })),
    supabase.rpc("get_personality_card").then(({ data, error }) => ({
      kind: "personality" as const,
      data,
      error: error?.message ?? null,
    })),
    supabase.rpc("get_companion_identity_relationship_center").then(({ data, error }) => ({
      kind: "relationship" as const,
      data,
      error: error?.message ?? null,
    })),
  ]);

  let identityCenterRaw: unknown = null;
  let assistantIdentityRaw: unknown = null;
  let personalityRaw: unknown = null;
  let companionRelationshipRaw: unknown = null;
  let permissionDenied = false;

  for (const result of requests) {
    if (result.error && isPermissionDeniedMessage(result.error)) {
      permissionDenied = true;
      continue;
    }
    if (result.kind === "identity") identityCenterRaw = result.data;
    if (result.kind === "assistant") assistantIdentityRaw = result.data;
    if (result.kind === "personality") personalityRaw = result.data;
    if (result.kind === "relationship") companionRelationshipRaw = result.data;
  }

  const parsed = parseIdentityRpcPayloads({
    identityCenterRaw,
    assistantIdentityRaw,
    personalityRaw,
    companionRelationshipRaw,
  });

  if (
    !parsed.identityCenter?.has_customer &&
    !parsed.assistantIdentity?.has_customer &&
    !parsed.personality?.has_customer &&
    !parsed.companionRelationship?.settings
  ) {
    return createEmptyCompanionIdentityContext({ language: locale });
  }

  return normalizeCompanionIdentityContext({
    locale,
    identityCenter: parsed.identityCenter,
    assistantIdentity: parsed.assistantIdentity,
    personality: parsed.personality,
    companionRelationship: parsed.companionRelationship,
    permissionDenied,
  });
}
