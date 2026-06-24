import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import {
  resolveOrganizationAccessAuthorizationWithCore,
  type OrganizationAccessAuthorizationResolution,
} from "@/lib/core/organization-access-approval/access-authorization-resolver";
import type { OrganizationAccessOfferContext } from "@/lib/core/organization-access-approval/types";
import {
  buildOrganizationAccessRequiredAnswer,
  buildOrganizationAccessUserRoleDeniedAnswer,
} from "./organization-access-approval-bridge";
import { buildOrganizationIntelligenceGapAnswer } from "./organization-intelligence-answer";

export async function resolveOrganizationAccessGate(input: {
  supabase: SupabaseClient;
  t: Translator;
  offer: OrganizationAccessOfferContext;
  providerReady: boolean;
  effectivePermissions: readonly string[];
  capabilityKey: string;
  sourceReference: string | null;
}): Promise<{ gate: PlatformSearchResult | null; resolution: OrganizationAccessAuthorizationResolution }> {
  const resolution = await resolveOrganizationAccessAuthorizationWithCore({
    supabase: input.supabase,
    provider_key: input.offer.provider_key,
    scope_keys: input.offer.scope_keys,
    provider_ready: input.providerReady,
    effective_permissions: input.effectivePermissions,
  });

  switch (resolution.state) {
    case "provider_not_connected":
      return {
        gate: {
          answer: buildOrganizationIntelligenceGapAnswer(input.t, "adapter_missing", {
            sourceReference: input.sourceReference,
            capabilityKey: input.capabilityKey,
          }),
        },
        resolution,
      };
    case "user_role_denied":
      return {
        gate: {
          answer: buildOrganizationAccessUserRoleDeniedAnswer({
            t: input.t,
            offer: input.offer,
          }),
        },
        resolution,
      };
    case "organization_scope_required":
      return {
        gate: {
          answer: buildOrganizationAccessRequiredAnswer({
            t: input.t,
            offer: input.offer,
          }),
        },
        resolution,
      };
    default:
      return { gate: null, resolution };
  }
}
