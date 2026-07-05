import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  canPublishWebsiteKompisFaqDraft,
  detectWebsiteKompisFaqRiskyWords,
  isWebsiteKompisFaqEditorValid,
} from "@/lib/website-kompis-faq/safety";
import { parseWebsiteKompisFaqItem, parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

function main() {
  assert.deepEqual(detectWebsiteKompisFaqRiskyWords("Intern support case for member id"), [
    "member id",
    "support case",
    "intern",
  ]);

  assert.equal(
    canPublishWebsiteKompisFaqDraft({
      title: "Åpningstider",
      answer: "Stengt i påsken",
      locale: "no",
      contentType: "holiday_notice",
      publicSafe: true,
      status: "draft",
    }),
    true,
  );

  assert.equal(
    canPublishWebsiteKompisFaqDraft({
      title: "Åpningstider",
      answer: "Stengt i påsken",
      locale: "no",
      contentType: "holiday_notice",
      publicSafe: false,
      status: "draft",
    }),
    false,
  );

  assert.equal(
    isWebsiteKompisFaqEditorValid({
      locale: "no",
      title: "Test",
      answer: "Svar",
      contentType: "faq",
      publicSafe: false,
      priority: 100,
      tags: [],
    }),
    true,
  );

  const item = parseWebsiteKompisFaqItem({
    id: "11111111-1111-4111-8111-111111111111",
    locale: "no",
    title: "Åpningstider i påsken",
    answer: "Vi holder stengt.",
    content_type: "holiday_notice",
    status: "published",
    public_safe: true,
    priority: 50,
    tags: ["hours"],
    created_at: "2026-04-01T10:00:00.000Z",
    updated_at: "2026-04-01T10:00:00.000Z",
  });

  assert.equal(item.contentType, "holiday_notice");
  assert.equal(item.publicSafe, true);

  const list = parseWebsiteKompisFaqList([
    {
      id: "11111111-1111-4111-8111-111111111111",
      locale: "no",
      title: "Åpningstider i påsken",
      answer: "Vi holder stengt.",
      content_type: "holiday_notice",
      status: "published",
      public_safe: true,
      priority: 50,
      tags: ["hours"],
      created_at: "2026-04-01T10:00:00.000Z",
      updated_at: "2026-04-01T10:00:00.000Z",
    },
  ]);
  assert.equal(list.length, 1);

  const apiRoute = fs.readFileSync(
    path.join(root, "app/api/website-kompis/faq/route.ts"),
    "utf8",
  );
  assert.match(apiRoute, /list_tenant_public_companion_faq_items/);
  assert.match(apiRoute, /upsert_tenant_public_companion_faq_item/);
  assert.doesNotMatch(apiRoute, /search_tenant_public_visitor_knowledge/);
  assert.doesNotMatch(apiRoute, /tenant_id/);

  const publishRoute = fs.readFileSync(
    path.join(root, "app/api/website-kompis/faq/[id]/publish/route.ts"),
    "utf8",
  );
  assert.match(publishRoute, /publish_tenant_public_companion_faq_item/);
  assert.doesNotMatch(publishRoute, /search_tenant_public_visitor_knowledge/);

  console.log("website-kompis-faq-safety.test.ts: all assertions passed");
}

main();
