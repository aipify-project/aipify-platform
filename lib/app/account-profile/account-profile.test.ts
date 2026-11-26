import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  accountProfileDataMapping,
  buildAccountProfileView,
  mapAccountProfileLicense,
  mapAccountProfileRole,
} from "./view-model";
import { ACCOUNT_PROFILE_ROUTE } from "./index";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import {
  KOMPIS_BEDRIFT_FLAT_NAV,
  KOMPIS_WEB_FLAT_NAV,
  getAppPortalActiveNavId,
} from "@/lib/app-portal/nav-config";
import { FAIL_CLOSED_SAFE_CAPABILITY_IDS } from "@/lib/core/app-menu-capability/resolve";
import { resolveAppRouteReadiness } from "@/lib/app-production-experience/route-readiness";

const ROOT = process.cwd();

assert.equal(ACCOUNT_PROFILE_ROUTE, "/app/account/profile");
assert.equal(FOUNDATION_NAV_BINDINGS.accountProfile, ACCOUNT_PROFILE_ROUTE);
assert.equal(getAppPortalActiveNavId("/app/account/profile"), "accountProfile");
assert.equal(resolveAppRouteReadiness("accountProfile").status, "production");
assert.ok(FAIL_CLOSED_SAFE_CAPABILITY_IDS.includes("accountProfile"));
assert.equal(KOMPIS_WEB_FLAT_NAV.at(-1)?.id, "accountProfile");
assert.equal(KOMPIS_BEDRIFT_FLAT_NAV.at(-1)?.id, "accountProfile");

assert.equal(mapAccountProfileRole("organization_owner"), "owner");
assert.equal(mapAccountProfileRole("admin"), "admin");
assert.equal(mapAccountProfileLicense("grace_period"), "grace");
assert.equal(mapAccountProfileLicense("trial"), "trialing");
assert.equal(mapAccountProfileLicense("canceled"), "cancelled");

const privateView = buildAccountProfileView({
  user: {
    id: "u1",
    auth_user_id: "a1",
    company_id: "c1",
    full_name: "Ada Lovelace",
    role: "owner",
    created_at: "2026-01-15T10:00:00.000Z",
  },
  loginEmail: "ada@example.com",
  avatarUrl: null,
  context: {
    authenticated: true,
    state: "ready",
    user_role: "owner",
    organization_role: "organization_owner",
    company_id: "c1",
    customer_id: "cust-1",
    organization_id: "org-1",
    workspace_name: null,
    licensed_to: null,
    plan_name: "Business",
    license_status: "active",
    has_customer: true,
    has_organization_membership: true,
    has_app_access: true,
    can_access_self_support: true,
    eligible_organization_count: 1,
  },
  canOpenCompanySettings: true,
});

assert.equal(privateView.fullName.value, "Ada Lovelace");
assert.equal(privateView.email.value, "ada@example.com");
assert.equal(privateView.phone.value, null);
assert.equal(privateView.phone.source, "unavailable");
assert.equal(privateView.hasCompanyContext, false);
assert.equal(privateView.relationship.planName.value, "Business");
assert.equal(privateView.relationship.license, "active");
assert.equal(privateView.screenLock.status, "not_activated");
assert.equal(privateView.fullName.editable, false);
assert.equal(privateView.email.editable, false);

const companyView = buildAccountProfileView({
  user: privateView.fullName.value
    ? {
        id: "u1",
        auth_user_id: "a1",
        company_id: "c1",
        full_name: "Ada Lovelace",
        role: "staff",
        created_at: "2026-01-15T10:00:00.000Z",
      }
    : null,
  loginEmail: "ada@example.com",
  avatarUrl: "https://cdn.example/avatar.png",
  context: {
    authenticated: true,
    state: "ready",
    user_role: "staff",
    organization_role: "organization_member",
    company_id: "c1",
    customer_id: "cust-1",
    organization_id: "org-1",
    workspace_name: "Example Workspace",
    licensed_to: "Example Workspace",
    plan_name: "Starter",
    license_status: "trialing",
    has_customer: true,
    has_organization_membership: true,
    has_app_access: true,
    can_access_self_support: true,
    eligible_organization_count: 1,
  },
  canOpenCompanySettings: false,
});

assert.equal(companyView.hasCompanyContext, true);
assert.equal(companyView.companyName.value, "Example Workspace");
assert.equal(companyView.companyWebsite.value, null);
assert.equal(companyView.links.companySettings, null);
assert.equal(companyView.avatarUrl, "https://cdn.example/avatar.png");

const mapping = accountProfileDataMapping();
assert.ok(mapping.some((row) => row.uiField === "email" && row.source === "auth.users.email"));
assert.ok(mapping.every((row) => row.editable === false));

const page = fs.readFileSync(path.join(ROOT, "app/app/account/profile/page.tsx"), "utf8");
assert.match(page, /AppHubShell/);
assert.doesNotMatch(page, /redirect\("\/app\/settings\/company-profile"\)/);
assert.match(page, /AppCustomerProfilePanel/);

const panel = fs.readFileSync(
  path.join(ROOT, "components/app/account-profile/AppCustomerProfilePanel.tsx"),
  "utf8"
);
assert.match(panel, /screenLockStatus/);
assert.match(panel, /disabled/);
assert.doesNotMatch(panel, /localStorage/);

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const portal = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/customer-app/portalStructure.json`), "utf8")
  ) as {
    portalStructure: {
      nav: Record<string, string>;
      accountProfile: Record<string, unknown>;
    };
  };
  assert.ok(portal.portalStructure.nav.accountProfile);
  assert.ok(portal.portalStructure.accountProfile.title);
  assert.ok(portal.portalStructure.accountProfile.screenLockStatus);
}

const proposal = fs.readFileSync(
  path.join(ROOT, "docs/app/SECURE_SCREEN_LOCK_V1_PROPOSAL.md"),
  "utf8"
);
assert.match(proposal, /PREPARED_OWNER_SECURITY_APPROVAL_REQUIRED/);
assert.match(proposal, /Not activated/);

console.log("account-profile.test.ts: ok");
