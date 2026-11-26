import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseSupportRequestDetail,
  parseSupportRequestItem,
  parseSupportRequestList,
} from "./parse";

const root = process.cwd();
const sqlPath = join(
  root,
  "docs/platform/sql-candidates/app_portal_support_hide_internal_notes_from_customers_v1.sql",
);
const sql = readFileSync(sqlPath, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");

assert.match(sql, /can_manage = organization_role IN/i);
assert.match(sql, /organization_owner/);
assert.match(sql, /NOT Aipify platform support/i);
assert.match(sql, /platform_support_post_internal_note/);
assert.match(sql, /_apsr271_request_row/);
assert.match(sql, /get_app_portal_support_request/);
assert.match(sql, /update_app_portal_support_request/);
assert.match(sql, /p_internal_notes is intentionally ignored/i);
assert.doesNotMatch(sql, /v_request := v_request \|\| public\._apsr271_internal_notes_fields/);
assert.doesNotMatch(sql, /resend|send_email|email_queue/i);

const rowBody =
  sql.split("create or replace function public._apsr271_request_row")[1]?.split("$$;")[0] ?? "";
assert.doesNotMatch(rowBody, /'internal_notes'/);
assert.doesNotMatch(rowBody, /'internal_notes_full'/);

const getBody =
  sql.split("create or replace function public.get_app_portal_support_request")[1]?.split(
    "create or replace function public.update_app_portal_support_request",
  )[0] ?? "";
assert.doesNotMatch(getBody, /internal_notes_full',\s*v_r\.internal_notes/);
assert.doesNotMatch(getBody, /_apsr271_internal_notes_fields/);

/** Leaky payloads from any customer role must not survive APP parse. */
function leakyItem(roleLabel: string) {
  return {
    id: "r1",
    title: `Case ${roleLabel}`,
    description: "Public",
    category: "general",
    priority: "medium",
    status: "open",
    created_by: roleLabel,
    assigned_support_owner: "Unassigned",
    internal_notes: `SECRET for ${roleLabel}`,
    internal_notes_full: `SECRET full for ${roleLabel}`,
    created_at: "2026-11-26T00:00:00Z",
    updated_at: "2026-11-26T00:00:00Z",
  };
}

for (const role of ["customer_owner", "customer_admin", "customer_staff"]) {
  const list = parseSupportRequestList({
    found: true,
    can_manage: role !== "customer_staff",
    items: [leakyItem(role)],
  });
  assert.equal(list.items[0]?.internal_notes, undefined, `${role} list`);
  assert.equal(list.items[0]?.internal_notes_full, undefined, `${role} list full`);

  const detail = parseSupportRequestDetail({
    found: true,
    can_manage: role !== "customer_staff",
    request: leakyItem(role),
  });
  assert.equal(detail.request?.internal_notes, undefined, `${role} detail`);
  assert.equal(detail.request?.internal_notes_full, undefined, `${role} detail full`);
}

const updateParsed = parseSupportRequestItem({
  updated: true,
  can_manage: true,
  request: leakyItem("customer_owner"),
});
assert.equal(updateParsed?.internal_notes, undefined);
assert.equal(updateParsed?.internal_notes_full, undefined);

console.log(`internal-notes-privacy.test.ts: ok sha256=${sha}`);
