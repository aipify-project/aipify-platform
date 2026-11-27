import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  classifyPersonalSalesCode,
  personalSalesProductPath,
  publicAdvisorName,
  publicationFromPublicResolve,
} from "./contract";

test("rejects emails, uuids, and unknown shapes", () => {
  assert.equal(classifyPersonalSalesCode("seller@example.com"), "invalid");
  assert.equal(classifyPersonalSalesCode("11111111-1111-4111-8111-111111111111"), "invalid");
  assert.equal(classifyPersonalSalesCode("csp-0123456789ab"), "csp");
  assert.equal(classifyPersonalSalesCode("north-studio"), "growth_partner");
});

test("public resolve publishes a name only for an active growth partner link", () => {
  assert.deepEqual(
    publicationFromPublicResolve({
      code: "north-studio",
      resolved: { found: true, partner_name: "North Studio", partner_company: "Hidden AS" },
    }),
    { state: "published", code: "north-studio", advisorName: "North Studio" },
  );
  assert.equal(
    publicationFromPublicResolve({
      code: "north-studio",
      resolved: { found: false, error: "Partner link disabled" },
    }).state,
    "closed",
  );
  assert.equal(
    publicationFromPublicResolve({
      code: "csp-0123456789ab",
      resolved: { found: true, partner_name: "Should not publish" },
    }).state,
    "closed",
  );
});

test("advisor name drops email and markup", () => {
  assert.equal(publicAdvisorName("Ada <script>"), null);
  assert.equal(publicAdvisorName("ada@example.com"), null);
  assert.equal(publicAdvisorName("Ada Partner"), "Ada Partner");
});

test("attributed start uses the existing /p route and locale", () => {
  assert.equal(
    personalSalesProductPath("north-studio", "uk"),
    "/p/north-studio/kompis_web?channel=referral_link&lang=uk",
  );
  assert.equal(personalSalesProductPath("not a code", "en"), null);
});

test("seller pages are noindex and do not invent checkout", () => {
  const page = readFileSync("app/s/[code]/page.tsx", "utf8");
  assert.match(page, /index:\s*false/);
  assert.doesNotMatch(page, /checkoutEnabled:\s*true/);
  assert.doesNotMatch(page, /stripe/i);
});
