import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateAppSettingsOwnerAdminAccess } from "@/lib/app/settings/require-settings-owner-admin";
import { isOrganizationOwnerAdminRole } from "@/lib/tenant/organization-role";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

function readyContext(
  overrides: Partial<AppOrganizationContext> = {}
): AppOrganizationContext {
  return {
    authenticated: true,
    state: "ready",
    organization_id: "org-a",
    company_id: "org-a",
    customer_id: "cust-a",
    organization_role: "organization_owner",
    user_role: "organization_owner",
    workspace_name: "Org A",
    licensed_to: "Org A",
    plan_name: "business",
    license_status: "active",
    has_app_access: true,
    has_customer: true,
    has_organization_membership: true,
    can_access_self_support: true,
    eligible_organization_count: 1,
    ...overrides,
  };
}

describe("app settings owner_admin server authorization", () => {
  it("allows organization owner on /app/settings", () => {
    const result = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({ organization_role: "organization_owner" }),
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.organizationId, "org-a");
  });

  it("allows organization admin on /app/settings", () => {
    const result = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        organization_role: "organization_admin",
        user_role: "organization_admin",
      }),
    });
    assert.equal(result.ok, true);
  });

  it("denies organization member on direct /app/settings", () => {
    const result = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        organization_role: "organization_member",
        user_role: "organization_member",
      }),
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "unauthorized_role");
  });

  it("denies restricted and missing roles", () => {
    for (const role of ["read_only", "staff", null] as const) {
      const result = evaluateAppSettingsOwnerAdminAccess({
        authenticated: true,
        context: readyContext({
          organization_role: role,
          user_role: role,
        }),
      });
      assert.equal(result.ok, false, `role=${role}`);
      if (!result.ok) assert.equal(result.reason, "unauthorized_role");
    }
    assert.equal(isOrganizationOwnerAdminRole(null), false);
    assert.equal(isOrganizationOwnerAdminRole("organization_member"), false);
  });

  it("denies unauthenticated callers", () => {
    const result = evaluateAppSettingsOwnerAdminAccess({
      authenticated: false,
      context: readyContext(),
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "unauthenticated");
  });

  it("uses active organization role only — no cross-tenant role reuse", () => {
    const orgAOwner = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        organization_id: "org-a",
        company_id: "org-a",
        organization_role: "organization_owner",
      }),
    });
    const orgBMember = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        organization_id: "org-b",
        company_id: "org-b",
        organization_role: "organization_member",
        user_role: "organization_member",
      }),
    });
    assert.equal(orgAOwner.ok, true);
    assert.equal(orgBMember.ok, false);
    if (orgAOwner.ok) assert.equal(orgAOwner.organizationId, "org-a");
    if (!orgBMember.ok) {
      assert.equal(orgBMember.organizationId, "org-b");
      assert.equal(orgBMember.reason, "unauthorized_role");
    }
  });

  it("recalculates access after organization switch", () => {
    const before = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        organization_id: "org-owner-workspace",
        organization_role: "organization_owner",
      }),
    });
    const after = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        organization_id: "org-member-workspace",
        company_id: "org-member-workspace",
        organization_role: "organization_member",
        user_role: "organization_member",
      }),
    });
    assert.equal(before.ok, true);
    assert.equal(after.ok, false);
    if (before.ok && !after.ok) {
      assert.notEqual(before.organizationId, after.organizationId);
    }
  });

  it("denies when organization context is not ready", () => {
    const result = evaluateAppSettingsOwnerAdminAccess({
      authenticated: true,
      context: readyContext({
        state: "membership_missing",
        organization_id: null,
        company_id: null,
      }),
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "organization_not_ready");
  });
});
