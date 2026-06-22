/**
 * Frozen Companion Member Verification invariants — Phase 35.
 * Generic Core contracts only; Unonight field mapping belongs in adapters.
 */

export const COMPANION_VERIFICATION_READ_ONLY = "required" as const;
export const COMPANION_VERIFICATION_CORE = "provider_agnostic" as const;
export const COMPANION_VERIFICATION_PII_DEFAULT = "masked" as const;
export const COMPANION_VERIFICATION_AUDIT = "required" as const;
export const COMPANION_VERIFICATION_CROSS_TENANT = "forbidden" as const;
export const COMPANION_VERIFICATION_DOCUMENTS = "forbidden" as const;
export const COMPANION_VERIFICATION_AUTO_APPROVE = "forbidden" as const;
export const COMPANION_VERIFICATION_AUTO_REJECT = "forbidden" as const;
export const COMPANION_PROVIDER_VERIFICATION_MAPPING_IN_CORE = "forbidden" as const;

export const COMPANION_VERIFICATION_POLICY_MODULES = {
  contracts: "lib/integration-intelligence/verification/types.ts",
  semantic: "lib/companion-runtime/verification-semantic-intent.ts",
  orchestrator: "lib/companion-runtime/verification-read-orchestrator.ts",
  audit: "lib/companion-runtime/verification-audit.ts",
} as const;

export function companionVerificationPolicyMetadata() {
  return {
    read_only: COMPANION_VERIFICATION_READ_ONLY,
    verification_core: COMPANION_VERIFICATION_CORE,
    pii_default: COMPANION_VERIFICATION_PII_DEFAULT,
    audit: COMPANION_VERIFICATION_AUDIT,
    cross_tenant: COMPANION_VERIFICATION_CROSS_TENANT,
    documents: COMPANION_VERIFICATION_DOCUMENTS,
    auto_approve: COMPANION_VERIFICATION_AUTO_APPROVE,
    auto_reject: COMPANION_VERIFICATION_AUTO_REJECT,
    provider_mapping_in_core: COMPANION_PROVIDER_VERIFICATION_MAPPING_IN_CORE,
  };
}
