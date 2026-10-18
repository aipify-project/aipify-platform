import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { buildCompanyProfileView } from "@/lib/app/settings/company-profile-view";
import { isOperativeSettingsHref } from "@/lib/app/settings/operative-settings";

describe("company profile settings", () => {
  it("shows only trusted organization context and never treats unknown status as editable", () => {
    const view = buildCompanyProfileView(
      {
        workspace_name: "Northwind Trading",
        user_role: "owner",
        plan_name: "Business",
        license_status: "active",
      },
      "owner@example.com",
    );
    assert.equal(view.displayName, "Northwind Trading");
    assert.equal(view.initials, "NT");
    assert.equal(view.loginEmail, "owner@example.com");
    assert.equal(view.role, "owner");
    assert.equal(view.license, "active");
    assert.equal(
      buildCompanyProfileView(
        {
          workspace_name: "Northwind Trading",
          user_role: "owner",
          plan_name: "Business",
          license_status: "raw_internal_code",
        },
        "owner@example.com",
      ).license,
      null,
    );
  });

  it("links the profile from settings and does not add an upload or registration rewrite", () => {
    assert.equal(isOperativeSettingsHref("/app/settings/company-profile"), true);
    const page = readFileSync("app/app/settings/company-profile/page.tsx", "utf8");
    const panel = readFileSync("components/app/settings/CompanyProfilePanel.tsx", "utf8");
    const registration = readFileSync("components/auth/RegistrationWizard.tsx", "utf8");
    assert.match(page, /getUser\(\)/);
    assert.match(page, /requireAppSettingsOwnerAdminAccess/);
    assert.doesNotMatch(page + panel, /type="file"|Last opp|complete_aipify_workspace_registration|register-workspace/);
    assert.match(registration, /const TOTAL_STEPS = 5/);
    assert.match(registration, /\/api\/auth\/register-workspace/);
  });
});
