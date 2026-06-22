/**
 * Frozen Companion Organization Directory invariants — Phase 33C.
 * Generic Core contracts only; provider field mapping belongs in adapters.
 */

export const COMPANION_DIRECTORY_SEARCH = "tenant_scoped" as const;
export const COMPANION_DIRECTORY_CORE = "provider_agnostic" as const;
export const COMPANION_PII_DEFAULT = "masked" as const;
export const COMPANION_PERSON_SEARCH_AUDIT = "required" as const;
export const COMPANION_CROSS_TENANT_SEARCH = "forbidden" as const;
export const COMPANION_FUZZY_IDENTITY_MATCH = "clarification_required_when_uncertain" as const;
export const COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE = "forbidden" as const;
export const COMPANION_DIRECTORY_EXPORT = "approval_or_disabled" as const;
export const COMPANION_EMPLOYEE_DIRECTORY_WRITE_ACTIONS = "disabled" as const;
export const COMPANION_CRM_DIRECTORY_WRITE_ACTIONS = "disabled" as const;
export const COMPANION_CUSTOMER_OWNERSHIP = "platform" as const;
export const COMPANION_PARTNER_ATTRIBUTION_IS_NOT_OWNERSHIP = true as const;

export const COMPANION_DIRECTORY_POLICY_MODULES = {
  contracts: "lib/integration-intelligence/directory/types.ts",
  semantic: "lib/companion-runtime/directory-semantic-intent.ts",
  orchestrator: "lib/companion-runtime/directory-search-orchestrator.ts",
  audit: "lib/companion-runtime/directory-audit.ts",
} as const;

export function companionDirectoryPolicyMetadata() {
  return {
    directory_search: COMPANION_DIRECTORY_SEARCH,
    directory_core: COMPANION_DIRECTORY_CORE,
    pii_default: COMPANION_PII_DEFAULT,
    person_search_audit: COMPANION_PERSON_SEARCH_AUDIT,
    cross_tenant_search: COMPANION_CROSS_TENANT_SEARCH,
    fuzzy_identity_match: COMPANION_FUZZY_IDENTITY_MATCH,
    provider_field_mapping_in_core: COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE,
    directory_export: COMPANION_DIRECTORY_EXPORT,
    employee_directory_write_actions: COMPANION_EMPLOYEE_DIRECTORY_WRITE_ACTIONS,
    crm_directory_write_actions: COMPANION_CRM_DIRECTORY_WRITE_ACTIONS,
    customer_ownership: COMPANION_CUSTOMER_OWNERSHIP,
    partner_attribution_is_not_ownership: COMPANION_PARTNER_ATTRIBUTION_IS_NOT_OWNERSHIP,
  };
}
