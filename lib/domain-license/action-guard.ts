export const DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF = {
  purchase_domain_license: "payment_not_confirmed",
  activate_domain: "verification_not_recorded",
  remove_domain: "domain_removal_not_available",
} as const;

export type RefusedDomainAction = keyof typeof DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF;

export function domainActionRefusal(actionType: string): string | null {
  if (actionType in DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF) {
    return DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF[actionType as RefusedDomainAction];
  }
  return null;
}

const CREATE_DOMAIN_FIELDS = ["domain", "display_name", "connected_platform"] as const;

const TENANT_PAYLOAD_KEYS = new Set([
  "organization_id",
  "organizationId",
  "customer_id",
  "customerId",
  "company_id",
  "companyId",
  "tenant_id",
  "tenantId",
]);

/**
 * The database resolves the organization from the session.
 * A client id in the body is dropped. create_domain accepts only the domain fields.
 */
export function domainActionPayload(
  actionType: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  if (actionType === "create_domain") {
    const next: Record<string, string> = {};
    for (const key of CREATE_DOMAIN_FIELDS) {
      const value = payload[key];
      if (typeof value === "string" && value.trim()) {
        next[key] = value.trim();
      }
    }
    return next;
  }

  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!TENANT_PAYLOAD_KEYS.has(key)) next[key] = value;
  }
  return next;
}
