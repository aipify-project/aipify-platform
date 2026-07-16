import assert from "node:assert/strict";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

console.log("resolve-app-organization-context.test.ts");

const readyPayload = {
  authenticated: true,
  state: "ready",
  user_role: "owner",
  organization_role: "organization_owner",
  company_id: "company-1",
  customer_id: "customer-1",
  organization_id: "org-1",
  workspace_name: "Customer Org",
  licensed_to: "Customer Org",
  plan_name: "Business",
  license_status: "active",
  has_customer: true,
  has_organization_membership: true,
  has_app_access: true,
  can_access_self_support: true,
};

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "selection_required",
    eligible_organization_count: 2,
  }).state,
  "selection_required",
);

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "selection_required",
    eligible_organization_count: 3,
  }).eligible_organization_count,
  3,
);

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "membership_missing",
    eligible_organization_count: 0,
  }).eligible_organization_count,
  0,
);

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "selection_required",
    eligible_organization_count: -1,
  }).eligible_organization_count,
  null,
);

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "selection_required",
    eligible_organization_count: "not-a-number",
  }).eligible_organization_count,
  null,
);

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "selection_required",
  }).eligible_organization_count,
  null,
);

assert.equal(
  parseAppOrganizationContext({
    authenticated: true,
    state: "unknown_state",
  }).state,
  "access_denied",
);

const ready = parseAppOrganizationContext(readyPayload);
assert.equal(ready.state, "ready");
assert.equal(ready.authenticated, true);
assert.equal(ready.user_role, "owner");
assert.equal(ready.organization_role, "organization_owner");
assert.equal(ready.company_id, "company-1");
assert.equal(ready.customer_id, "customer-1");
assert.equal(ready.organization_id, "org-1");
assert.equal(ready.workspace_name, "Customer Org");
assert.equal(ready.licensed_to, "Customer Org");
assert.equal(ready.plan_name, "Business");
assert.equal(ready.license_status, "active");
assert.equal(ready.has_customer, true);
assert.equal(ready.has_organization_membership, true);
assert.equal(ready.has_app_access, true);
assert.equal(ready.can_access_self_support, true);
assert.equal(ready.eligible_organization_count, null);

console.log("resolve-app-organization-context.test.ts: all assertions passed");
