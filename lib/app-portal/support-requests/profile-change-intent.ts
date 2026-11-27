/**
 * APP «Be om endring» → Support request create prefill.
 * Uses existing create_app_portal_support_request (LIVE) — no parallel mailto path.
 */

export const CUSTOMER_PROFILE_CHANGE_INTENT = "customer_profile_change" as const;

export const CUSTOMER_PROFILE_CHANGE_CATEGORY = "account" as const;

export const CUSTOMER_PROFILE_CHANGE_RELATED_MODULE = "organization" as const;

/** Canonical deep-link from APP profile locked fields. */
export const CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF =
  `/app/support/requests?new=1&category=${CUSTOMER_PROFILE_CHANGE_CATEGORY}&intent=${CUSTOMER_PROFILE_CHANGE_INTENT}` as const;

export function isCustomerProfileChangeIntent(value: string | null | undefined): boolean {
  return (value ?? "").trim() === CUSTOMER_PROFILE_CHANGE_INTENT;
}

export function buildCustomerProfileChangePrefill(labels: {
  title: string;
  description: string;
}): {
  title: string;
  description: string;
  category: typeof CUSTOMER_PROFILE_CHANGE_CATEGORY;
  relatedModule: typeof CUSTOMER_PROFILE_CHANGE_RELATED_MODULE;
} {
  return {
    title: labels.title,
    description: labels.description,
    category: CUSTOMER_PROFILE_CHANGE_CATEGORY,
    relatedModule: CUSTOMER_PROFILE_CHANGE_RELATED_MODULE,
  };
}
