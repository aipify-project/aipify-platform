import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isPrivateWebsiteKompisPathnameNormalized } from "./website-kompis-public-site-index/private-paths";
import {
  checkWebsiteKompisFreezeIntegrity,
  explainWebsiteKompisFreezeHash,
} from "./website-kompis-freeze-integrity";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const manifestSha = "a".repeat(64);
const observedSha = "b".repeat(64);
const otherSha = "c".repeat(64);

assert.equal(
  explainWebsiteKompisFreezeHash({
    path: "kept.ts",
    manifestSha256: manifestSha,
    actualSha256: manifestSha,
    ledger: null,
  }),
  null,
);

assert.match(
  explainWebsiteKompisFreezeHash({
    path: "kept.ts",
    manifestSha256: manifestSha,
    actualSha256: otherSha,
    ledger: null,
  }) ?? "",
  /not in the observed-drift ledger/,
);

assert.equal(
  explainWebsiteKompisFreezeHash({
    path: "drift.ts",
    manifestSha256: manifestSha,
    actualSha256: observedSha,
    ledger: { path: "drift.ts", manifestSha256: manifestSha, observedSha256: observedSha },
  }),
  null,
);

assert.match(
  explainWebsiteKompisFreezeHash({
    path: "drift.ts",
    manifestSha256: manifestSha,
    actualSha256: otherSha,
    ledger: { path: "drift.ts", manifestSha256: manifestSha, observedSha256: observedSha },
  }) ?? "",
  /changed again/,
);

const issues = checkWebsiteKompisFreezeIntegrity(root);
assert.deepEqual(issues, []);

assert.equal(isPrivateWebsiteKompisPathnameNormalized("/no/profile/private"), true);
assert.equal(isPrivateWebsiteKompisPathnameNormalized("/en/account/billing"), true);
assert.equal(isPrivateWebsiteKompisPathnameNormalized("/no/faq"), false);
assert.equal(isPrivateWebsiteKompisPathnameNormalized("https://customer.example/no/faq"), true);

console.log("website-kompis-freeze-integrity.test.ts: ok");
