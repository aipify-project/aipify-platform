import assert from "node:assert/strict";
import {
  isNotificationOrganizationReady,
  organizationTenantScopeKey,
  resolveNotificationOrganizationKey,
  resolveStableNotificationRequestKey,
} from "@/lib/app/notifications/organization-context-gate";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

const readyContext: AppOrganizationContext = {
  authenticated: true,
  state: "ready",
  user_role: "owner",
  organization_role: "owner",
  company_id: "company-1",
  customer_id: "customer-1",
  organization_id: "org-unonight",
  workspace_name: "Unonight",
  licensed_to: "Unonight AS",
  plan_name: "business",
  license_status: "active",
  has_customer: true,
  has_organization_membership: true,
  has_app_access: true,
  can_access_self_support: true,
  eligible_organization_count: null,
};

assert.equal(resolveNotificationOrganizationKey(readyContext), "org-unonight");
assert.equal(
  resolveStableNotificationRequestKey(readyContext, "user-42"),
  "org-unonight:customer-1:user-42",
);
assert.equal(isNotificationOrganizationReady(readyContext), true);
assert.equal(
  isNotificationOrganizationReady({ ...readyContext, state: "organization_missing" }),
  false,
);
assert.equal(isNotificationOrganizationReady({ ...readyContext, has_customer: false }), false);
assert.equal(
  organizationTenantScopeKey("org-unonight:customer-1:user-42"),
  "org-unonight:customer-1",
);
assert.equal(
  organizationTenantScopeKey("org-unonight:customer-1:user-99"),
  "org-unonight:customer-1",
);
assert.equal(
  organizationTenantScopeKey("org-unonight:customer-1:user-42"),
  organizationTenantScopeKey("org-unonight:customer-1:user-99"),
);

console.log("organization-context-gate.test.ts passed");
