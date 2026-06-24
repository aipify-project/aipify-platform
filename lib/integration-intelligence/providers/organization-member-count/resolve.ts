import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isPresentableMemberCountResult,
  ORGANIZATION_MEMBER_COUNT_CAPABILITY,
  type OrganizationMemberCountGapReason,
  type OrganizationMemberCountResult,
} from "./types";
import { listOrganizationMemberCountProviders } from "./registry";

let providersBootstrapped = false;

async function ensureOrganizationMemberCountProvidersRegistered(): Promise<void> {
  if (providersBootstrapped) return;
  providersBootstrapped = true;
  await import("./register-providers");
  await import("@/lib/integration-intelligence/community/apply-external-provider-adapters").catch(
    () => undefined,
  );
}

function pickBestResult(
  results: readonly OrganizationMemberCountResult[],
): OrganizationMemberCountResult | null {
  const presentable = results.find(isPresentableMemberCountResult);
  if (presentable) return presentable;

  const readyNonLive = results.find(
    (result) =>
      result.readiness === "ready" &&
      result.data_classification !== "live" &&
      result.gap_reason !== null,
  );
  if (readyNonLive) return readyNonLive;

  const uncertified = results.find((result) => result.readiness === "uncertified");
  if (uncertified) return uncertified;

  return results[0] ?? null;
}

export function resolveMemberCountGapReason(
  result: OrganizationMemberCountResult | null,
): OrganizationMemberCountGapReason {
  if (!result) return "registry_not_connected";
  if (result.gap_reason) return result.gap_reason;
  if (result.data_classification !== "live") return "demo_data_not_presentable";
  if (!result.source_verified) return "registry_not_connected";
  if (result.readiness === "unavailable") return "source_unavailable";
  return "registry_not_connected";
}

export async function resolveOrganizationMemberCount(input: {
  supabase: SupabaseClient;
  organizationId: string;
  tenantId: string;
}): Promise<OrganizationMemberCountResult> {
  await ensureOrganizationMemberCountProvidersRegistered();

  const providers = listOrganizationMemberCountProviders();
  const readInput = {
    supabase: input.supabase,
    organization_id: input.organizationId,
    tenant_id: input.tenantId,
  };

  const settled = await Promise.all(
    providers.map(async (provider) => {
      try {
        return await provider.readMemberCount(readInput);
      } catch {
        return null;
      }
    }),
  );

  const results = settled.filter(
    (result): result is OrganizationMemberCountResult => result !== null,
  );

  const best = pickBestResult(results);
  if (best) return best;

  return {
    capability: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
    provider_key: "none",
    readiness: "unavailable",
    data_classification: "test",
    source_verified: false,
    freshness: "unknown",
    source_reference: ORGANIZATION_MEMBER_COUNT_CAPABILITY,
    total_count: null,
    generated_at: null,
    gap_reason: "registry_not_connected",
  };
}
