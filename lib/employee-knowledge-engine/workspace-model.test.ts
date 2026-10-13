import assert from "node:assert/strict";
import {
  canPersistEmployeeKnowledgeDraft,
  EMPLOYEE_KNOWLEDGE_MULTILINGUAL_GAPS,
  recentKnowledgeItems,
  sortKnowledgeItemsNewestFirst,
  statusForItem,
  type EmployeeKnowledgeItemRow,
} from "./workspace-model";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const items: EmployeeKnowledgeItemRow[] = [
  {
    id: "1",
    title: "A",
    content: "a",
    category: "policies",
    approved: true,
    updatedAt: "2026-10-01T10:00:00Z",
    createdAt: "2026-09-01T10:00:00Z",
  },
  {
    id: "2",
    title: "B",
    content: "b",
    category: "policies",
    approved: false,
    updatedAt: "2026-10-10T10:00:00Z",
    createdAt: "2026-10-10T10:00:00Z",
  },
  {
    id: "3",
    title: "C",
    content: "c",
    category: "policies",
    approved: false,
    updatedAt: "2026-10-05T10:00:00Z",
    createdAt: "2026-10-05T10:00:00Z",
  },
  {
    id: "4",
    title: "D",
    content: "d",
    category: "policies",
    approved: true,
    updatedAt: "2026-10-12T10:00:00Z",
    createdAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "5",
    title: "E",
    content: "e",
    category: "policies",
    approved: true,
    updatedAt: "2026-10-11T10:00:00Z",
    createdAt: "2026-10-11T10:00:00Z",
  },
];

assert.equal(statusForItem(items[0]!), "approved");
assert.equal(statusForItem(items[1]!), "pending");

const sorted = sortKnowledgeItemsNewestFirst(items);
assert.deepEqual(
  sorted.map((i) => i.id),
  ["4", "5", "2", "3", "1"]
);

const recent = recentKnowledgeItems(items, 4);
assert.equal(recent.length, 4);
assert.deepEqual(
  recent.map((i) => i.id),
  ["4", "5", "2", "3"]
);
assert.ok(sorted.some((i) => i.id === "1"), "fifth item remains in full list");

assert.equal(canPersistEmployeeKnowledgeDraft({ title: "Q", content: "" }).ok, false);
assert.equal(canPersistEmployeeKnowledgeDraft({ title: "", content: "A" }).ok, false);
assert.equal(canPersistEmployeeKnowledgeDraft({ title: "Q", content: "A" }).ok, true);

assert.ok(EMPLOYEE_KNOWLEDGE_MULTILINGUAL_GAPS.length >= 5);

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260612900000_employee_knowledge_phase41.sql"),
  "utf8"
);
assert.match(migration, /create table if not exists public\.employee_knowledge_items/);
assert.doesNotMatch(migration, /employee_knowledge_items[\s\S]{0,800}locale/);
assert.doesNotMatch(migration, /update_employee_knowledge_item/);

const panel = readFileSync(
  join(process.cwd(), "components/app/settings/EmployeeKnowledgeAdminPanel.tsx"),
  "utf8"
);
assert.doesNotMatch(panel, /localStorage/);
assert.match(panel, /multilingualGapTitle|multilingualGapBody/);

console.log("workspace-model.test.ts: all assertions passed");
