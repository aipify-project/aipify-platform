import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { runFaqPublishFlow } from "./publish-flow";

const root = process.cwd();

async function main() {
  let publishCalls: string[] = [];
  const created = await runFaqPublishFlow({
    plan: "publish_draft",
    save: async () => ({ id: "faq-1", status: "draft" }),
    publish: async (id) => {
      publishCalls.push(id);
      return { ok: true, id, status: "published" };
    },
  });
  assert.deepEqual(created, { outcome: "published", id: "faq-1", status: "published" });
  assert.deepEqual(publishCalls, ["faq-1"]);

  publishCalls = [];
  const failed = await runFaqPublishFlow({
    plan: "publish_draft",
    save: async () => ({ id: "faq-2", status: "draft" }),
    publish: async (id) => {
      publishCalls.push(id);
      return { ok: false, id, status: "draft" };
    },
  });
  assert.deepEqual(failed, {
    outcome: "draft_saved_publish_failed",
    id: "faq-2",
    status: "draft",
  });
  assert.deepEqual(publishCalls, ["faq-2"]);

  const retryIds: string[] = [];
  const retry = await runFaqPublishFlow({
    plan: "publish_draft",
    save: async () => {
      retryIds.push("faq-2");
      return { id: "faq-2", status: "draft" };
    },
    publish: async (id) => ({ ok: true, id, status: "published" }),
  });
  assert.equal(retry.outcome, "published");
  assert.deepEqual(retryIds, ["faq-2"]);

  let publishCalled = false;
  const revised = await runFaqPublishFlow({
    plan: "revise_published",
    save: async () => ({ id: "faq-3", status: "published" }),
    publish: async () => {
      publishCalled = true;
      return { ok: true, id: "faq-3", status: "published" };
    },
  });
  assert.equal(revised.outcome, "revised");
  assert.equal(publishCalled, false);

  const blocked = await runFaqPublishFlow({
    plan: "blocked",
    save: async () => ({ id: "should-not", status: "draft" }),
    publish: async () => ({ ok: true, status: "published" }),
  });
  assert.equal(blocked.outcome, "blocked");

  const panel = fs.readFileSync(
    path.join(root, "components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx"),
    "utf8",
  );
  const confirmStart = panel.indexOf("async function confirmPublish");
  const confirmEnd = panel.indexOf("if (loading && items.length === 0");
  const confirmBody = panel.slice(confirmStart, confirmEnd);
  assert.match(confirmBody, /runFaqPublishFlow/);
  assert.match(confirmBody, /persistedIdRef|result\.id/);
  assert.equal(confirmBody.includes("const itemId = draft.itemId"), false);
  assert.equal(confirmBody.includes("/unpublish"), false);

  const editor = fs.readFileSync(
    path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
    "utf8",
  );
  assert.match(editor, /runFaqPublishFlow/);
  assert.doesNotMatch(editor, /Godkjenn svar/);
  assert.doesNotMatch(editor, /review_status/);

  console.log("publish-flow.test.ts: ok");
}

void main();
