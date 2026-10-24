import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  canPublishWebsiteKompisFaqDraft,
  detectWebsiteKompisFaqRiskyWords,
  faqValidityAllowsPublication,
  isWebsiteKompisFaqEditorValid,
  planWebsiteKompisFaqPublish,
  resolveFaqExpiryForSave,
} from "@/lib/website-kompis-faq/safety";
import { parseWebsiteKompisFaqItem, parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

function main() {
  assert.deepEqual(detectWebsiteKompisFaqRiskyWords("Intern support case for member id"), []);
  assert.deepEqual(
    detectWebsiteKompisFaqRiskyWords("Internal note: member id A-48291. Do not publish."),
    ["personal_identifier", "internal_note"],
  );

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

  const fields = {
    title: "Åpningstider",
    answer: "Stengt i påsken",
    locale: "no",
    contentType: "faq",
    publicSafe: true,
  };
  assert.equal(planWebsiteKompisFaqPublish({ ...fields, status: "new" }), "publish_draft");
  assert.equal(planWebsiteKompisFaqPublish({ ...fields, status: "draft" }), "publish_draft");
  assert.equal(planWebsiteKompisFaqPublish({ ...fields, status: "published" }), "revise_published");
  assert.equal(planWebsiteKompisFaqPublish({ ...fields, status: "archived" }), "blocked");
  assert.equal(
    faqValidityAllowsPublication({ validFrom: null, validUntil: null }),
    true,
  );
  assert.deepEqual(resolveFaqExpiryForSave({ permanent: true, validFrom: null, validUntil: "2030-01-01T00:00:00.000Z" }), {
    ok: true,
    validFrom: null,
    validUntil: null,
  });
  assert.equal(
    resolveFaqExpiryForSave({
      permanent: false,
      validFrom: "2026-01-01T00:00:00.000Z",
      validUntil: "2030-01-01T00:00:00.000Z",
    }).ok,
    true,
  );
  assert.deepEqual(
    resolveFaqExpiryForSave({ permanent: false, validFrom: null, validUntil: null }),
    { ok: false, reason: "end_required" },
  );
  assert.deepEqual(
    resolveFaqExpiryForSave({
      permanent: false,
      validFrom: "2030-01-02T00:00:00.000Z",
      validUntil: "2030-01-01T00:00:00.000Z",
    }),
    { ok: false, reason: "window" },
  );
  assert.equal(
    faqValidityAllowsPublication({
      validFrom: "2026-10-18T10:00:00.000Z",
      validUntil: "2026-10-18T10:00:00.000Z",
    }),
    false,
  );
  assert.equal(
    faqValidityAllowsPublication({
      validUntil: "2020-01-01T00:00:00.000Z",
      now: Date.parse("2026-10-18T00:00:00.000Z"),
    }),
    false,
  );
  assert.equal(
    planWebsiteKompisFaqPublish({
      ...fields,
      status: "new",
      validFrom: "2026-10-18T10:00:00.000Z",
      validUntil: "2026-10-18T10:00:00.000Z",
    }),
    "blocked",
  );

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

  const editor = fs.readFileSync(
    path.join(root, "components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx"),
    "utf8",
  );
  const drawer = fs.readFileSync(
    path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
    "utf8",
  );
  const norwegian = fs.readFileSync(path.join(root, "locales/no/customer-app/core.json"), "utf8");
  assert.match(editor, /FaqPermanentExpiryFields/);
  assert.match(editor, /permanent: true/);
  assert.match(drawer, /backgroundColor: "#ffffff"/);
  assert.match(drawer, /validUntil: expiry.validUntil/);
  assert.doesNotMatch(drawer, /review_status|approve_website_kompis_answer_feedback/);
  assert.match(norwegian, /Permanent – ingen utløpsdato/);
  assert.match(norwegian, /Spørsmålet forblir tilgjengelig til du avpubliserer eller arkiverer det./);

  console.log("website-kompis-faq-safety.test.ts: all assertions passed");
}

main();
