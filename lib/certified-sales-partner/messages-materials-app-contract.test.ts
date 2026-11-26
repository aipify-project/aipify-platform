import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

async function main() {
  const partnerMessages = read("app/api/certified-sales-partner/messages/route.ts");
  assert.match(partnerMessages, /csp_list_partner_messages/);
  assert.match(partnerMessages, /csp_send_partner_message/);
  assert.match(partnerMessages, /resolveCspPartnerScope/);
  assert.match(partnerMessages, /partner_to_admin/);
  assert.match(partnerMessages, /spoof|forbidden/);

  const partnerMaterials = read("app/api/certified-sales-partner/materials/route.ts");
  assert.match(partnerMaterials, /csp_list_sales_materials/);
  assert.match(partnerMaterials, /p_include_unpublished:\s*false/);

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

  const avatar = read("app/api/partners/profile/avatar/route.ts");
  assert.match(avatar, /csp_set_partner_avatar_url/);

  const contract = read("lib/certified-sales-partner/messages-materials-sql-contract.ts");
  assert.match(contract, /csp_list_partner_messages/);
  assert.match(contract, /csp_list_sales_materials/);

  const ops = read("components/platform/sellers/CertifiedSellersOpsPanel.tsx");
  assert.match(ops, /filterCspMessageRecipients/);
  assert.match(ops, /recipientSearchPlaceholder/);
  assert.doesNotMatch(ops, /font-mono.*partnerFilter/);
  const profile = read("components/platform/sellers/CertifiedSellerProfile.tsx");
  assert.match(profile, /sendProfileMessage/);
  assert.match(profile, /isCspMessageRecipientEligible/);

  console.log("CSP messages/materials app activation contract passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
