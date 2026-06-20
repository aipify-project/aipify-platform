#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  classifyAppPortalError,
  parseAppOrganizationContext,
} from "../lib/tenant/resolve-app-organization-context.ts";

const ctx = parseAppOrganizationContext({
  authenticated: true,
  state: "ready",
  user_role: "owner",
  organization_role: "organization_owner",
  has_customer: true,
  has_app_access: true,
});

assert.equal(ctx.state, "ready");
assert.equal(classifyAppPortalError("Organization context required"), "organization_missing");
assert.equal(classifyAppPortalError("Active subscription required"), "subscription_inactive");
assert.equal(classifyAppPortalError("Access denied for organization"), "membership_missing");

console.log("APP organization access smoke tests passed");
