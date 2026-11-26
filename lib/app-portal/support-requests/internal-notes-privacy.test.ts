import assert from "node:assert/strict";
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

assert.match(sql, /_apsr271_request_row/);
assert.match(sql, /_apsr271_internal_notes_fields/);
assert.match(sql, /get_app_portal_support_request/);
assert.match(sql, /update_app_portal_support_request/);
assert.doesNotMatch(
  sql.split("create or replace function public._apsr271_request_row")[1]?.split("$$;")[0] ?? "",
  /'internal_notes'/,
);
assert.match(sql, /if v_can_manage then/);
assert.doesNotMatch(sql, /resend|send_email|email_queue/i);

const customerList = parseSupportRequestList({
  found: true,
  can_manage: false,
  items: [
    {
      id: "r1",
      title: "Help",
      description: "Public",
      category: "general",
      priority: "medium",
      status: "open",
      created_by: "Ada",
      assigned_support_owner: "Unassigned",
      internal_notes: "SECRET customer must not see",
      internal_notes_full: "SECRET full",
      created_at: "2026-11-26T00:00:00Z",
      updated_at: "2026-11-26T00:00:00Z",
    },
  ],
});
assert.equal(customerList.items[0]?.internal_notes, undefined);
assert.equal(customerList.items[0]?.internal_notes_full, undefined);

const customerDetail = parseSupportRequestDetail({
  found: true,
  can_manage: false,
  request: {
    id: "r1",
    title: "Help",
    description: "Public",
    category: "general",
    priority: "medium",
    status: "open",
    created_by: "Ada",
    assigned_support_owner: "Unassigned",
    internal_notes: "SECRET",
    internal_notes_full: "SECRET full",
    created_at: "2026-11-26T00:00:00Z",
    updated_at: "2026-11-26T00:00:00Z",
  },
});
assert.equal(customerDetail.request?.internal_notes, undefined);
assert.equal(customerDetail.request?.internal_notes_full, undefined);

const managerDetail = parseSupportRequestDetail({
  found: true,
  can_manage: true,
  request: {
    id: "r1",
    title: "Help",
    description: "Public",
    category: "general",
    priority: "medium",
    status: "open",
    created_by: "Ada",
    assigned_support_owner: "Owner",
    internal_notes: "Manager note",
    internal_notes_full: "Manager note full",
    created_at: "2026-11-26T00:00:00Z",
    updated_at: "2026-11-26T00:00:00Z",
  },
});
assert.equal(managerDetail.request?.internal_notes, "Manager note full");
assert.equal(managerDetail.request?.internal_notes_full, "Manager note full");

const managerUpdate = parseSupportRequestItem({
  updated: true,
  can_manage: true,
  request: {
    id: "r1",
    title: "Help",
    description: "Public",
    category: "general",
    priority: "medium",
    status: "open",
    created_by: "Ada",
    assigned_support_owner: "Owner",
    internal_notes: "After save",
    created_at: "2026-11-26T00:00:00Z",
    updated_at: "2026-11-26T00:00:00Z",
  },
});
assert.equal(managerUpdate?.internal_notes, "After save");

const customerUpdate = parseSupportRequestItem({
  updated: true,
  can_manage: false,
  request: {
    id: "r1",
    title: "Help",
    description: "Public",
    category: "general",
    priority: "medium",
    status: "open",
    created_by: "Ada",
    assigned_support_owner: "Unassigned",
    internal_notes: "leaked",
    created_at: "2026-11-26T00:00:00Z",
    updated_at: "2026-11-26T00:00:00Z",
  },
});
assert.equal(customerUpdate?.internal_notes, undefined);

console.log("internal-notes-privacy.test.ts: ok");
