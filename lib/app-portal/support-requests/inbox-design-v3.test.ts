import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createTranslator } from "@/lib/i18n/translate";
import {
  buildSupportConversation,
  buildSupportRequestsLabels,
  filterItemsByInboxView,
  parseSupportRequestDetail,
  parseSupportRequestList,
  sortItemsByActivityDesc,
  supportTicketReference,
  type SupportRequestItem,
} from "./index";

const root = process.cwd();

function loadPortal(locale: string) {
  return JSON.parse(
    readFileSync(join(root, `locales/${locale}/customer-app/portalStructure.json`), "utf8"),
  ) as { portalStructure: { supportRequests: Record<string, unknown> } };
}

const forbiddenEnInNo = [
  "Support Request Center",
  "Search & filters",
  "Create Support Request",
  "Save changes",
  "Internal notes",
  "Comments",
  "Unassigned",
];

{
  const no = loadPortal("no").portalStructure.supportRequests as Record<string, unknown>;
  assert.equal(no.title, "Kundeservice");
  assert.equal(no.createRequest, "Ny henvendelse");
  const detail = no.detail as Record<string, string>;
  const views = no.views as Record<string, string>;
  assert.equal(detail.sendReply, "Send svar");
  assert.equal(views.waiting, "Avventer svar");
  const blob = JSON.stringify(no);
  for (const bad of forbiddenEnInNo) {
    assert.equal(blob.includes(bad), false, `NO must not contain: ${bad}`);
  }
}

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const dict = {
    customerApp: {
      portalStructure: loadPortal(locale).portalStructure,
    },
  };
  const labels = buildSupportRequestsLabels(createTranslator(dict));
  assert.ok(labels.title.length > 2, locale);
  assert.ok(labels.detail.sendReply.length > 2, locale);
  assert.ok(labels.form.submit.length > 2, locale);
  assert.equal(labels.statuses.open.length > 0, true, locale);
}

{
  const leaky = parseSupportRequestDetail({
    found: true,
    can_manage: true,
    request: {
      id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      title: "Case",
      description: "Public",
      category: "general",
      priority: "medium",
      status: "open",
      created_by: "Owner",
      assigned_support_owner: "Unassigned",
      internal_notes: "SECRET",
      internal_notes_full: "SECRET FULL",
      created_at: "2026-11-27T00:00:00Z",
      updated_at: "2026-11-27T00:10:00Z",
    },
    messages: [
      {
        id: "m1",
        body: "Customer reply",
        author_role: "customer",
        author_name: "Owner",
        visibility: "customer_visible",
        created_at: "2026-11-27T00:05:00Z",
      },
      {
        id: "m2",
        body: "Draft must hide",
        author_role: "platform_agent",
        visibility: "internal_draft",
        created_at: "2026-11-27T00:06:00Z",
      },
    ],
    status_history: [
      { status: "open", at: "2026-11-27T00:00:00Z", description: "Created" },
    ],
  });
  assert.equal(leaky.request?.internal_notes, undefined);
  assert.equal(leaky.request?.internal_notes_full, undefined);
  assert.equal(leaky.messages?.length, 1);
  assert.equal(leaky.internal_notes_placeholder, undefined);

  const conversation = buildSupportConversation(leaky, {
    customerFallback: "You",
    aipifyName: "Aipify",
    systemName: "System",
    openingMessage: "Opening",
    statusChanged: "Status",
  });
  assert.ok(conversation.some((e) => e.body === "Customer reply"));
  assert.equal(conversation.some((e) => e.body === "Draft must hide"), false);
  assert.equal(conversation[0]?.created_at >= conversation[conversation.length - 1]!.created_at, true);
}

{
  const items: SupportRequestItem[] = [
    {
      id: "1",
      title: "A",
      description: "a",
      category: "general",
      priority: "medium",
      status: "open",
      created_by: "A",
      assigned_support_owner: "Unassigned",
      created_at: "2026-11-26T00:00:00Z",
      updated_at: "2026-11-27T02:00:00Z",
    },
    {
      id: "2",
      title: "B",
      description: "b",
      category: "general",
      priority: "medium",
      status: "waiting_for_customer",
      created_by: "B",
      assigned_support_owner: "Unassigned",
      created_at: "2026-11-26T00:00:00Z",
      updated_at: "2026-11-27T03:00:00Z",
    },
    {
      id: "3",
      title: "C",
      description: "c",
      category: "general",
      priority: "medium",
      status: "closed",
      created_by: "C",
      assigned_support_owner: "Unassigned",
      created_at: "2026-11-26T00:00:00Z",
      updated_at: "2026-11-27T01:00:00Z",
    },
  ];
  assert.equal(filterItemsByInboxView(items, "waiting").map((i) => i.id).join(","), "2");
  assert.equal(filterItemsByInboxView(items, "closed").map((i) => i.id).join(","), "3");
  assert.equal(sortItemsByActivityDesc(items)[0]?.id, "2");
  assert.equal(supportTicketReference("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"), "AAAAAAAA");
}

{
  const list = parseSupportRequestList({
    found: true,
    principle: "Ignore marketing principle",
    items: [
      {
        id: "r1",
        title: "T",
        description: "D",
        category: "general",
        priority: "medium",
        status: "open",
        created_by: "Owner",
        assigned_support_owner: "Unassigned",
        internal_notes: "SECRET",
        created_at: "2026-11-27T00:00:00Z",
        updated_at: "2026-11-27T00:00:00Z",
      },
    ],
  });
  assert.equal(list.principle, undefined);
  assert.equal(list.items[0]?.internal_notes, undefined);
}

{
  const sqlPath = join(
    root,
    "docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql",
  );
  const sql = readFileSync(sqlPath, "utf8");
  const sha = createHash("sha256").update(sql).digest("hex");
  assert.equal(sha, "3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617");
  assert.match(sql, /visibility = 'customer_visible'/);
  const sqlBody = sql.split("begin;")[1] ?? "";
  assert.doesNotMatch(sqlBody, /'internal_notes'/);
  assert.doesNotMatch(sqlBody, /'internal_notes_full'/);
  assert.doesNotMatch(sqlBody, /resend|send_email/i);
}

{
  const panel = readFileSync(
    join(root, "components/app/app-portal/SupportRequestsCenterPanel.tsx"),
    "utf8",
  );
  const detail = readFileSync(
    join(root, "components/app/app-portal/SupportRequestDetailPanel.tsx"),
    "utf8",
  );
  assert.doesNotMatch(panel, /Support Request Center FAQ|labels\.faq|labels\.principle/);
  assert.doesNotMatch(detail, /internalNotes|auditHistory|commentsPlaceholder/);
  assert.match(detail, /sendReply/);
  assert.match(panel, /get\("new"\)/);
}

console.log("inbox-design-v3.test.ts: ok");
