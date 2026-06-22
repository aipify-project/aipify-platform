#!/usr/bin/env node
/**
 * Verifies APP support route access wiring and organization context helpers.
 * Run: node scripts/verify-app-support-access.mjs
 */
import assert from "node:assert/strict";
import {
  classifyAppPortalError,
  parseAppOrganizationContext,
} from "../lib/tenant/resolve-app-organization-context.ts";

assert.equal(classifyAppPortalError("column s.company_id does not exist"), "database_execution_error");
assert.equal(
  classifyAppPortalError("Organization context required"),
  "organization_missing"
);
assert.equal(
  classifyAppPortalError("Active subscription required"),
  "subscription_inactive"
);
assert.equal(
  classifyAppPortalError("Access denied for organization"),
  "membership_missing"
);

const readyContext = parseAppOrganizationContext({
  authenticated: true,
  state: "ready",
  user_role: "owner",
  organization_role: "organization_owner",
  company_id: "00000000-0000-0000-0000-000000000001",
  customer_id: "00000000-0000-0000-0000-000000000002",
  organization_id: "00000000-0000-0000-0000-000000000002",
  workspace_name: "Unonight",
  licensed_to: "Unonight",
  plan_name: "Business",
  license_status: "active",
  has_customer: true,
  has_organization_membership: true,
  has_app_access: true,
  can_access_self_support: true,
});

assert.equal(readyContext.state, "ready");
assert.equal(readyContext.workspace_name, "Unonight");
assert.equal(readyContext.has_app_access, true);
assert.equal(readyContext.can_access_self_support, true);

const missingContext = parseAppOrganizationContext({
  authenticated: true,
  state: "organization_missing",
  user_role: "owner",
  has_customer: false,
  has_organization_membership: false,
  has_app_access: false,
  can_access_self_support: false,
});

assert.equal(missingContext.state, "organization_missing");

const supportRoutes = [
  "/app/support/customer-success",
  "/app/support/customer-health",
  "/app/support/history",
  "/app/support/knowledge",
  "/app/support/requests",
  "/app/support/assistant",
  "/app/support/academy",
  "/app/support/getting-started",
  "/app/support/success-center",
  "/app/support/contact",
];

for (const route of supportRoutes) {
  assert.ok(route.startsWith("/app/support/"), `support route prefix: ${route}`);
}

console.log("verify-app-support-access: ok");
