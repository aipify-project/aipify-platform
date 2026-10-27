import assert from "node:assert/strict";
import { buildKompisWebSalesMetadata } from "./sales-metadata";
import { parseKompisWebSalesLabels } from "./labels";
import enMarketing from "../../../locales/en/marketing.json";

const labels = parseKompisWebSalesLabels(enMarketing as Record<string, unknown>);

const root = buildKompisWebSalesMetadata(labels, "/");
assert.equal(root.alternates?.canonical, "/");
assert.equal(
  typeof root.openGraph === "object" && root.openGraph && "url" in root.openGraph
    ? root.openGraph.url
    : null,
  "https://aipify.ai/",
);

const alias = buildKompisWebSalesMetadata(labels, "/kompis-web");
assert.equal(alias.alternates?.canonical, "/kompis-web");
assert.equal(
  typeof alias.openGraph === "object" && alias.openGraph && "url" in alias.openGraph
    ? alias.openGraph.url
    : null,
  "https://aipify.ai/kompis-web",
);

assert.equal(root.title, alias.title);
assert.ok(String(root.description ?? "").includes("150"));

console.log("kompis-web-sales sales-route metadata: PASS");
