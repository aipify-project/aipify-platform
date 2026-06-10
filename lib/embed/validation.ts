import type { PlanType } from "@/lib/platform/types";
import { planIncludesModule } from "@/lib/core/plans";

export type EmbedAuthContext = {
  installation_token: string;
  domain: string;
  tenant_id: string;
  installation_id: string;
  plan_type: PlanType;
  subscription_active: boolean;
};

export type EmbedValidationResult =
  | { ok: true; context: EmbedAuthContext }
  | { ok: false; reason: string };

/**
 * Placeholder validation pipeline for Layer 3 embed/install requests.
 * Wire to database checks when embed routes are implemented.
 */
export function validateEmbedRequest(
  _headers: Headers,
  requiredModule?: string
): EmbedValidationResult {
  void requiredModule;
  return { ok: false, reason: "Embed authentication not yet implemented." };
}

export function moduleAllowedForPlan(plan: PlanType, moduleKey: string): boolean {
  return planIncludesModule(plan, moduleKey);
}
