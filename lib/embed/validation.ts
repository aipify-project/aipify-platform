import type { PlanType } from "@/lib/platform/types";
import { planIncludesModule } from "@/lib/core/plans";
import {
  isDomainAuthorized,
  validateInstallationSecurity,
  type InstallationSecurityContext,
} from "@/lib/trust/installation";

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
 * Layer 3 embed/install validation pipeline.
 * Enforces Phase 19 installation security before execution.
 */
export function validateEmbedSecurityContext(
  ctx: InstallationSecurityContext,
  registeredDomains: string[]
): EmbedValidationResult {
  const security = validateInstallationSecurity(ctx);
  if (!security.valid) {
    return { ok: false, reason: `Installation security check failed: ${security.failedCheck}` };
  }
  if (ctx.domain && !isDomainAuthorized(ctx.domain, registeredDomains)) {
    return { ok: false, reason: "Domain not registered for this installation." };
  }
  return { ok: true, context: {
    installation_token: ctx.installationToken!,
    domain: ctx.domain!,
    tenant_id: ctx.tenantId!,
    installation_id: ctx.installationId!,
    plan_type: "starter",
    subscription_active: ctx.subscriptionActive === true,
  } };
}

/** Placeholder until full header/token resolution is wired to Supabase. */
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
