import assert from "node:assert/strict";
import {
  buildKompisWebSalesMetadata,
  KOMPIS_WEB_SALES_CANONICAL_URL,
} from "./sales-metadata";
import { parseKompisWebSalesLabels } from "./labels";
import enMarketing from "../../../locales/en/marketing.json";

const labels = parseKompisWebSalesLabels(enMarketing as Record<string, unknown>);

const root = buildKompisWebSalesMetadata(labels, "/");
assert.equal(root.alternates?.canonical, KOMPIS_WEB_SALES_CANONICAL_URL);
assert.equal(
  typeof root.openGraph === "object" && root.openGraph && "url" in root.openGraph
    ? root.openGraph.url
    : null,
  KOMPIS_WEB_SALES_CANONICAL_URL,
);

const alias = buildKompisWebSalesMetadata(labels, "/kompis-web");
assert.equal(alias.alternates?.canonical, KOMPIS_WEB_SALES_CANONICAL_URL);
assert.equal(
  typeof alias.openGraph === "object" && alias.openGraph && "url" in alias.openGraph
    ? alias.openGraph.url
    : null,
  KOMPIS_WEB_SALES_CANONICAL_URL,
);

assert.equal(root.title, alias.title);
assert.ok(String(root.description ?? "").includes("150"));
assert.equal(
  typeof root.twitter === "object" && root.twitter && "title" in root.twitter
    ? root.twitter.title
    : null,
  "Aipify works for you",
);
assert.ok(String(root.title).includes("Aipify"));
assert.ok(String(labels.hero.titleBefore).includes("Aipify"));

console.log("kompis-web-sales sales-route metadata: PASS");
