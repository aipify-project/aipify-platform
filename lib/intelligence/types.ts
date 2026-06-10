import type { IntelligenceTask } from "./tasks";

/** Opaque provider identifier — never shown to customers as the product. */
export type ModelProviderKey = string;

/** Internal model profile — infrastructure, not product branding. */
export type ModelProfile = {
  profile_id: string;
  display_name: string;
  tasks: IntelligenceTask[];
  tier: "fast" | "balanced" | "reasoning";
  provider_key: ModelProviderKey;
};

export type ModelPolicyMode = "aipify_managed" | "customer_approved";

/** Tenant-level model policy. Enterprise may supply approved profiles. */
export type TenantModelPolicy = {
  mode: ModelPolicyMode;
  approved_profile_ids?: string[];
};

export type ModelSelection = {
  profile_id: string;
  task: IntelligenceTask;
  policy_mode: ModelPolicyMode;
  /** Internal routing metadata — not customer-facing. */
  provider_key: ModelProviderKey;
};
