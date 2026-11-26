import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import { CSP_MESSAGES_MATERIALS_REQUIRED_RPCS } from "./messages-materials-sql-contract";

const ROOT = join(__dirname, "../..");

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("CSP messages/materials app activation contract", () => {
  test("partner messages API uses Core RPCs and server-resolves partner id", () => {
    const src = read("app/api/certified-sales-partner/messages/route.ts");
    assert.match(src, /csp_list_partner_messages/);
    assert.match(src, /csp_send_partner_message/);
    assert.match(src, /resolveCspPartnerScope/);
    assert.match(src, /partner_to_admin/);
    assert.match(src, /spoof|forbidden/);
  });

  test("partner materials API lists published-only via Core", () => {
    const src = read("app/api/certified-sales-partner/materials/route.ts");
    assert.match(src, /csp_list_sales_materials/);
    assert.match(src, /p_include_unpublished:\s*false/);
  });

  test("platform admin APIs use privileged gate and Core RPCs", () => {
    const messages = read("app/api/platform/sellers/messages/route.ts");
    const materials = read("app/api/platform/sellers/materials/route.ts");
    assert.match(messages, /guardPrivilegedPlatformApi/);
    assert.match(messages, /csp_list_partner_messages/);
    assert.match(messages, /csp_send_partner_message/);
    assert.match(messages, /isCspPartnerPortalStatusAllowed/);
    assert.match(materials, /guardPrivilegedPlatformApi/);
    assert.match(materials, /csp_list_sales_materials/);
    assert.match(materials, /csp_upsert_sales_material/);
    assert.match(materials, /csp_publish_sales_material/);
    assert.match(materials, /csp_withdraw_sales_material/);
  });

  test("avatar route best-effort syncs Core pointer", () => {
    const src = read("app/api/partners/profile/avatar/route.ts");
    assert.match(src, /csp_set_partner_avatar_url/);
  });

  test("required RPC names remain the activation contract", () => {
    assert.ok(CSP_MESSAGES_MATERIALS_REQUIRED_RPCS.includes("csp_list_partner_messages"));
    assert.ok(CSP_MESSAGES_MATERIALS_REQUIRED_RPCS.includes("csp_list_sales_materials"));
  });
});
