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

assert.equal(ACCOUNT_PROFILE_ROUTE, "/app/profile");
assert.equal(FOUNDATION_NAV_BINDINGS.accountProfile, ACCOUNT_PROFILE_ROUTE);
assert.equal(getAppPortalActiveNavId("/app/profile"), "accountProfile");
assert.equal(getAppPortalActiveNavId("/app/account/profile"), "accountProfile");
assert.equal(resolveAppRouteReadiness("accountProfile").status, "production");
assert.ok(FAIL_CLOSED_SAFE_CAPABILITY_IDS.includes("accountProfile"));
assert.equal(KOMPIS_WEB_FLAT_NAV.some((item) => item.id === "accountProfile"), false);
assert.equal(KOMPIS_BEDRIFT_FLAT_NAV.some((item) => item.id === "accountProfile"), false);

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
assert.equal(privateView.hasCompanyDetails, false);
assert.equal(privateView.phone.source, "unavailable");
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

assert.equal(companyView.hasCompanyDetails, true);
assert.equal(companyView.companyName.value, "Example Workspace");
assert.equal(
  companyView.companyName.source,
  "get_app_organization_context.workspace_name",
);
assert.equal(companyView.relationship.workspaceName.value, "Example Workspace");
assert.equal(companyView.relationship.referenceHidden, false);
assert.equal(companyView.links.license, "/app/license");
assert.equal(companyView.links.privacy, "/app/settings/security");
assert.equal(companyView.links.companySettings, null);
assert.equal(companyView.avatarUrl, "https://cdn.example/avatar.png");

const hiddenReference = buildAccountProfileView({
  user: null,
  loginEmail: null,
  avatarUrl: null,
  context: {
    authenticated: true,
    state: "ready",
    user_role: null,
    organization_role: null,
    company_id: null,
    customer_id: "11111111-1111-4111-8111-111111111111",
    organization_id: "org-1",
    workspace_name: null,
    licensed_to: null,
    plan_name: null,
    license_status: null,
    has_customer: true,
    has_organization_membership: true,
    has_app_access: true,
    can_access_self_support: true,
    eligible_organization_count: 1,
  },
  company: { name: "North Studio" },
  canOpenCompanySettings: false,
});
assert.equal(hiddenReference.relationship.referenceHidden, true);
assert.equal(hiddenReference.relationship.customerReference.value, null);
assert.equal(hiddenReference.hasCompanyDetails, true);
assert.equal(hiddenReference.companyName.value, "North Studio");

const mapping = accountProfileDataMapping();
assert.ok(mapping.some((row) => row.uiField === "email" && row.source === "auth.users.email"));
assert.ok(mapping.some((row) => row.uiField === "email" && row.editable === false));
assert.ok(mapping.some((row) => row.uiField === "fullName"));
assert.ok(mapping.some((row) => row.uiField === "avatar"));

const page = fs.readFileSync(path.join(ROOT, "app/app/profile/page.tsx"), "utf8");
assert.match(page, /AppHubShell/);
assert.match(page, /loadAccountProfileView/);
assert.match(page, /AppCustomerProfilePanel/);
assert.doesNotMatch(page, /organization_number|ENK/);
const legacy = fs.readFileSync(path.join(ROOT, "app/app/account/profile/page.tsx"), "utf8");
assert.match(legacy, /ACCOUNT_PROFILE_ROUTE/);
assert.match(legacy, /redirect/);

const panel = fs.readFileSync(
  path.join(ROOT, "components/app/account-profile/AppCustomerProfilePanel.tsx"),
  "utf8"
);
assert.doesNotMatch(panel, /screenLockStatus/);
assert.match(panel, /AccountPersonalEditor/);
assert.match(panel, /AccountProfileFormCard/);
assert.match(panel, /role="tablist"/);
assert.doesNotMatch(panel, /localStorage/);
assert.doesNotMatch(panel, /function LockedField/);
const editor = fs.readFileSync(
  path.join(ROOT, "components/app/account-profile/AccountPersonalEditor.tsx"),
  "utf8"
);
assert.match(editor, /\/api\/app\/account-profile/);
assert.match(editor, /avatar/);
assert.match(editor, /phoneCountries|phoneCountry/);
assert.match(editor, /labels\.cancel/);
assert.match(editor, /AccountProfileFormCard/);
assert.match(editor, /AccountPhoneCountryFlag/);
assert.match(editor, /ACCOUNT_PROFILE_PRIMARY_BUTTON_CLASS/);
assert.match(editor, /phoneCountryByDial/);

const formStyles = fs.readFileSync(
  path.join(ROOT, "lib/app/account-profile/form-styles.ts"),
  "utf8",
);
const authLayout = fs.readFileSync(path.join(ROOT, "components/auth/AuthLayout.tsx"), "utf8");
assert.match(formStyles, /rounded-\[28px\]/);
assert.match(formStyles, /border-\[rgba\(96,82,176,\.15\)\]/);
assert.match(authLayout, /rounded-\[28px\]/);
assert.match(authLayout, /border-\[rgba\(96,82,176,\.15\)\]/);
const formCard = fs.readFileSync(
  path.join(ROOT, "components/app/account-profile/AccountProfileFormCard.tsx"),
  "utf8",
);
assert.match(formCard, /ACCOUNT_PROFILE_FORM_CARD_CLASS/);

const companySettings = fs.readFileSync(
  path.join(ROOT, "app/app/settings/company-profile/page.tsx"),
  "utf8",
);
assert.match(companySettings, /redirect/);
assert.match(companySettings, /tab=company/);

const route = fs.readFileSync(path.join(ROOT, "app/api/app/account-profile/route.ts"), "utf8");
assert.match(route, /syncCustomerPrimaryContactFromAppUser/);

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const portal = JSON.parse(
    fs.readFileSync(path.join(ROOT, `locales/${locale}/customer-app/portalStructure.json`), "utf8")
  ) as {
    portalStructure: {
      nav: Record<string, string>;
      accountProfile: Record<string, unknown>;
    };
  };
  const shell = JSON.parse(fs.readFileSync(path.join(ROOT, `locales/${locale}/shell.json`), "utf8")) as {
    sidebar: { customerProfile: string; customerSupport?: string };
  };
  const name = shell.sidebar.customerProfile;
  assert.equal(portal.portalStructure.nav.accountProfile, name);
  assert.equal(portal.portalStructure.accountProfile.title, name);
  assert.ok(portal.portalStructure.accountProfile.companyEmpty);
  assert.ok(portal.portalStructure.accountProfile.tabSecurity);
  assert.ok(portal.portalStructure.accountProfile.loginEmail);
  assert.ok(portal.portalStructure.accountProfile.organizationLabel);
  assert.match(
    String(portal.portalStructure.accountProfile.requestChangeHref),
    /\/app\/support\/requests\?new=1&category=account&intent=customer_profile_change/,
  );
  if (locale !== "es") {
    assert.ok(portal.portalStructure.accountProfile.save);
    assert.ok(portal.portalStructure.accountProfile.avatarUpload);
    assert.ok(shell.sidebar.customerSupport);
  }
}

const proposal = fs.readFileSync(
  path.join(ROOT, "docs/app/SECURE_SCREEN_LOCK_V1_PROPOSAL.md"),
  "utf8"
);
assert.match(proposal, /PREPARED_OWNER_SECURITY_APPROVAL_REQUIRED/);
assert.match(proposal, /Not activated/);

console.log("account-profile.test.ts: ok");
