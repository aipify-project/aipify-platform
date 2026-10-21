export const DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF = {
  purchase_domain_license: "payment_not_confirmed",
  activate_domain: "verification_not_recorded",
} as const;

export type RefusedDomainAction = keyof typeof DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF;

export function domainActionRefusal(actionType: string): string | null {
  if (actionType in DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF) {
    return DOMAIN_ACTIONS_REFUSED_WITHOUT_PROOF[actionType as RefusedDomainAction];
  }
  return null;
}
