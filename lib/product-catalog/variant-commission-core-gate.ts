/**
 * Variant + commission Core persistence gate.
 *
 * Staging Core (auedugihkduoaikfusqe) may persist when RPCs exist.
 * Production Core stays fail-closed — no writes even if RPCs appear later
 * without a separate owner YES.
 */

import {
  AIPIFY_CORE_PRODUCTION_PROJECT_REF,
  AIPIFY_CORE_STAGING_PROJECT_REF,
  resolveConfiguredSupabaseProjectRef,
} from "@/lib/platform-portal/support-center/staging-core-activation";

export {
  AIPIFY_CORE_PRODUCTION_PROJECT_REF,
  AIPIFY_CORE_STAGING_PROJECT_REF,
  resolveConfiguredSupabaseProjectRef,
};

/** True only when the app is bound to Staging Core. Production always false. */
export function isVariantCommissionStagingPersistEnvEnabled(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return resolveConfiguredSupabaseProjectRef(url) === AIPIFY_CORE_STAGING_PROJECT_REF;
}

/** Production Core bound — must never open variant commission writes. */
export function isVariantCommissionProductionCoreBound(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  return resolveConfiguredSupabaseProjectRef(url) === AIPIFY_CORE_PRODUCTION_PROJECT_REF;
}

export type VariantCommissionPersistCapability = {
  envEnabled: boolean;
  productionBound: boolean;
  stagingBound: boolean;
  projectRef: string | null;
  /** Env allows persist attempts; API still probes RPCs before writing. */
  canAttemptPersist: boolean;
  reason:
    | "staging_core_bound"
    | "production_fail_closed"
    | "unknown_or_unbound_core";
};

export function resolveVariantCommissionPersistCapability(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): VariantCommissionPersistCapability {
  const projectRef = resolveConfiguredSupabaseProjectRef(url);
  const stagingBound = projectRef === AIPIFY_CORE_STAGING_PROJECT_REF;
  const productionBound = projectRef === AIPIFY_CORE_PRODUCTION_PROJECT_REF;
  if (stagingBound) {
    return {
      envEnabled: true,
      productionBound: false,
      stagingBound: true,
      projectRef,
      canAttemptPersist: true,
      reason: "staging_core_bound",
    };
  }
  if (productionBound) {
    return {
      envEnabled: false,
      productionBound: true,
      stagingBound: false,
      projectRef,
      canAttemptPersist: false,
      reason: "production_fail_closed",
    };
  }
  return {
    envEnabled: false,
    productionBound: false,
    stagingBound: false,
    projectRef,
    canAttemptPersist: false,
    reason: "unknown_or_unbound_core",
  };
}
