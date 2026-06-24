#!/usr/bin/env node
/** Local resolver gate matrix — runs against uncommitted repair code (no deploy required). */
import assert from "node:assert/strict";
import {
  resolveOrganizationAccessAuthorization,
  canRetryOrganizationCapabilityAfterApproval,
} from "../lib/core/organization-access-approval/access-authorization-resolver.ts";

const memberScopes = ["community.members.read"];

const cases = [
  {
    name: "A provider missing → adapter path (no request)",
    input: {
      provider_key: "community_member_directory",
      scope_keys: memberScopes,
      provider_ready: false,
      effective_permissions: ["customer_community.view"],
      organization_has_active_scope: false,
    },
    state: "provider_not_connected",
    hasSubmitActions: false,
  },
  {
    name: "B provider ready + role OK + org scope missing → request CTA",
    input: {
      provider_key: "community_member_directory",
      scope_keys: memberScopes,
      provider_ready: true,
      effective_permissions: ["customer_community.view"],
      organization_has_active_scope: false,
    },
    state: "organization_scope_required",
  },
  {
    name: "C user role missing → contact admin, no elevation",
    input: {
      provider_key: "community_member_directory",
      scope_keys: memberScopes,
      provider_ready: true,
      effective_permissions: [],
      organization_has_active_scope: true,
    },
    state: "user_role_denied",
  },
  {
    name: "org grant + missing user role → still blocked",
    input: {
      provider_key: "community_member_directory",
      scope_keys: memberScopes,
      provider_ready: true,
      effective_permissions: [],
      organization_has_active_scope: true,
    },
    state: "user_role_denied",
    retry: false,
  },
  {
    name: "org grant + allowed role → authorized",
    input: {
      provider_key: "community_member_directory",
      scope_keys: memberScopes,
      provider_ready: true,
      effective_permissions: ["customer_community.view"],
      organization_has_active_scope: true,
    },
    state: "authorized",
    retry: true,
  },
];

for (const testCase of cases) {
  const resolution = resolveOrganizationAccessAuthorization(testCase.input);
  assert.equal(resolution.state, testCase.state, testCase.name);
  if (testCase.retry === false) {
    assert.equal(canRetryOrganizationCapabilityAfterApproval(resolution), false, testCase.name);
  }
  if (testCase.retry === true) {
    assert.equal(canRetryOrganizationCapabilityAfterApproval(resolution), true, testCase.name);
  }
  console.log(`PASS ${testCase.name}`);
}

console.log("local resolver gate matrix passed");
