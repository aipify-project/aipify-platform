import assert from "node:assert/strict";
import {
  AIPIFY_ORGANIZATION_JSON_LD,
  AIPIFY_SOFTWARE_APPLICATION_JSON_LD,
  buildKompisWebSalesJsonLdScripts,
} from "./structured-data";

assert.equal(AIPIFY_ORGANIZATION_JSON_LD["@type"], "Organization");
assert.equal(AIPIFY_ORGANIZATION_JSON_LD.name, "Aipify Group AS");
assert.equal(AIPIFY_ORGANIZATION_JSON_LD.url, "https://aipify.ai/");
assert.equal(AIPIFY_SOFTWARE_APPLICATION_JSON_LD["@type"], "SoftwareApplication");
assert.equal(AIPIFY_SOFTWARE_APPLICATION_JSON_LD.name, "Aipify");
assert.doesNotMatch(JSON.stringify(AIPIFY_SOFTWARE_APPLICATION_JSON_LD), /offers|aggregateRating|review/i);

const scripts = buildKompisWebSalesJsonLdScripts();
assert.equal(scripts.length, 2);
for (const s of scripts) {
  const parsed = JSON.parse(s) as { "@type": string };
  assert.ok(parsed["@type"]);
}

console.log("structured-data.test.ts: ok");
