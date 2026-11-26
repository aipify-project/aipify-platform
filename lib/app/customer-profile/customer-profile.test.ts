import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { buildCustomerProfileView } from "./model";

const ROOT = join(import.meta.dirname, "../../..");

test("profile view uses account fields and does not invent contact or company identity", () => {
  const view = buildCustomerProfileView({
    fullName: "Ada Owner",
    role: "organization_owner",
    email: "ada@customer.example",
    phone: null,
    workspaceName: "North Workspace",
    planName: "Growth",
    licenseStatus: "grace_period",
    customerReference: "cus_ref",
    createdAt: "2026-01-02T10:00:00.000Z",
  });

  assert.equal(view.fullName, "Ada Owner");
  assert.equal(view.initials, "AO");
  assert.equal(view.role, "owner");
  assert.equal(view.phone, null);
  assert.equal(view.status, "grace");
  assert.equal(view.planName, "Growth");
  assert.equal(view.workspaceName, "North Workspace");
  assert.equal("organizationNumber" in view, false);
  assert.equal("sellerStatus" in view, false);
});

test("unknown role and status stay empty instead of raw codes", () => {
  const view = buildCustomerProfileView({
    role: "enk_seller",
    licenseStatus: "kompis_web",
  });
  assert.equal(view.role, null);
  assert.equal(view.status, null);
  assert.equal(view.initials, "A");
});

test("customer profile route sits under the product menu, not inside it", () => {
  const nav = readFileSync(join(ROOT, "lib/app-portal/nav-config.ts"), "utf8");
  const shell = readFileSync(join(ROOT, "components/dashboard/DashboardShell.tsx"), "utf8");
  const layout = readFileSync(join(ROOT, "app/app/layout.tsx"), "utf8");
  const page = readFileSync(join(ROOT, "app/app/profile/page.tsx"), "utf8");
  assert.match(layout, /CUSTOMER_PROFILE_ROUTE/);
  assert.match(shell, /CustomerProfileMenuLink/);
  assert.doesNotMatch(nav, /href:\s*"\/app\/profile"/);
  assert.match(page, /loadAccountProfileView/);
  assert.match(page, /AppHubShell/);
  assert.doesNotMatch(page, /organization_number|ENK|companyProfile/);
  assert.doesNotMatch(nav, /id: "accountProfile"/);
});

test("customer profile copy exists in every active locale", () => {
  for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
    const settings = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/customer-app/settings.json`), "utf8"),
    ) as { settings: { customerProfile: { title: string; lockBody: string } } };
    const shell = JSON.parse(readFileSync(join(ROOT, `locales/${locale}/shell.json`), "utf8")) as {
      sidebar: { customerProfile: string };
    };
    assert.ok(settings.settings.customerProfile.title.length > 0, locale);
    assert.ok(settings.settings.customerProfile.lockBody.length > 0, locale);
    assert.ok(shell.sidebar.customerProfile.length > 0, locale);
  }
});
