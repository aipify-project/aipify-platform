import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const CANDIDATES = [
  {
    file: "docs/platform/NOT_APPLIED_company_profile_read_v2.sql",
    sha256: "4f721013456757366b45c5ec01501f32f067ccd6909656f173ab2ef4b7b64c93",
  },
  {
    file: "docs/platform/NOT_APPLIED_company_profile_contact_write_v2.sql",
    sha256: "1960f826fed25973a3203b749066a32f3cdbc523092291d5dabcfa3658bfcbe3",
  },
  {
    file: "docs/platform/NOT_APPLIED_company_profile_logo_storage_v2.sql",
    sha256: "30a741b353f53a9780a534bf69481cf625642317f816a12d0c49af9767a6f6b9",
  },
];

describe("company profile v2 gate", () => {
  it("keeps the read, contact write, and logo contracts unapplied", () => {
    for (const candidate of CANDIDATES) {
      const sql = readFileSync(candidate.file, "utf8");
      const hash = createHash("sha256").update(sql).digest("hex");
      assert.equal(hash, candidate.sha256);
      assert.match(sql, /^-- NOT APPLIED/);
      assert.match(sql, /revoke all on function/i);
      assert.doesNotMatch(sql, /grant execute[\s\S]*to anon/i);
      assert.equal(sql.includes("p_customer_id"), false);
      assert.equal(sql.includes("p_organization_id"), false);
    }
  });

  it("does not wire the profile page to an unapplied contract or reopen registration", () => {
    const page = readFileSync("app/app/settings/company-profile/page.tsx", "utf8");
    const panel = readFileSync("components/app/settings/CompanyProfilePanel.tsx", "utf8");
    const registration = readFileSync("components/auth/RegistrationWizard.tsx", "utf8");
    const surface = page + panel;
    assert.doesNotMatch(surface, /get_customer_company_profile|update_customer_company_profile_contact|set_customer_company_logo_reference|type="file"/);
    assert.match(registration, /const TOTAL_STEPS = 5/);
    assert.match(registration, /\/api\/auth\/register-workspace/);
    assert.doesNotMatch(registration, /get_customer_company_profile/);
  });

  it("limits the contact write to phone and website", () => {
    const sql = readFileSync("docs/platform/NOT_APPLIED_company_profile_contact_write_v2.sql", "utf8");
    assert.match(sql, /set website = v_website/);
    assert.match(sql, /owner_phone = v_phone/);
    assert.match(sql, /set phone = v_phone/);
    assert.doesNotMatch(sql, /company_name =|organization_number =|billing_|plan_name|auth\.users/);
    assert.match(sql, /complete_aipify_workspace_registration/);
    assert.match(sql, /Do not call complete_aipify_workspace_registration/);
  });

  it("keeps the proposed logo bucket private and path-bound to the resolved customer", () => {
    const sql = readFileSync("docs/platform/NOT_APPLIED_company_profile_logo_storage_v2.sql", "utf8");
    assert.match(sql, /'company-profile-logos', 'company-profile-logos', false, 1048576/);
    assert.match(sql, /invalid logo path/);
    assert.match(sql, /png\|jpe\?g\|webp/);
    assert.doesNotMatch(sql, /create policy/i);
  });
});
