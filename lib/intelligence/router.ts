import { DEFAULT_MODEL_PROFILES } from "./profiles";
import type { IntelligenceTask } from "./tasks";
import type { ModelProfile, ModelSelection, TenantModelPolicy } from "./types";

const TIER_PRIORITY: Record<ModelProfile["tier"], number> = {
  fast: 1,
  balanced: 2,
  reasoning: 3,
};

function profilesForTask(profiles: ModelProfile[], task: IntelligenceTask): ModelProfile[] {
  return profiles.filter((p) => p.tasks.includes(task));
}

function pickBestProfile(candidates: ModelProfile[]): ModelProfile | undefined {
  if (candidates.length === 0) return undefined;
  return [...candidates].sort((a, b) => TIER_PRIORITY[b.tier] - TIER_PRIORITY[a.tier])[0];
}

export type SelectModelInput = {
  task: IntelligenceTask;
  policy?: TenantModelPolicy | null;
  profiles?: ModelProfile[];
};

/**
 * Select the most appropriate model profile for an intelligence task.
 * Aipify Intelligence is the product — models are replaceable infrastructure.
 */
export function selectModelProfile(input: SelectModelInput): ModelSelection | null {
  const profiles = input.profiles ?? DEFAULT_MODEL_PROFILES;
  const policy = input.policy ?? { mode: "aipify_managed" as const };

  if (policy.mode === "customer_approved") {
    const approved = new Set(policy.approved_profile_ids ?? []);
    const allowed = profiles.filter((p) => approved.has(p.profile_id));
    const match = pickBestProfile(profilesForTask(allowed, input.task));
    if (!match) return null;
    return {
      profile_id: match.profile_id,
      task: input.task,
      policy_mode: "customer_approved",
      provider_key: match.provider_key,
    };
  }

  const match = pickBestProfile(profilesForTask(profiles, input.task));
  if (!match) return null;

  return {
    profile_id: match.profile_id,
    task: input.task,
    policy_mode: "aipify_managed",
    provider_key: match.provider_key,
  };
}
