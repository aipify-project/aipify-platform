import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL,
  COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL,
  COMPANION_PUBLIC_LINKS,
  COMPANION_PUBLIC_LINKS_ENABLED_FLAG,
  COMPANION_PUBLIC_LINKS_ENV_KEY,
  isCompanionPublicLinksEnabled,
} from "./companion-public-links";

assert.equal(COMPANION_PUBLIC_LINKS_ENABLED_FLAG, "companionPublicLinksEnabled");
assert.equal(COMPANION_PUBLIC_LINKS_ENV_KEY, "NEXT_PUBLIC_COMPANION_PUBLIC_LINKS_ENABLED");

assert.match(COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL, /^https:\/\//);
assert.match(COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL, /^https:\/\//);
assert.equal(COMPANION_PUBLIC_LINKS.length, 2);
assert.equal(COMPANION_PUBLIC_LINKS[0]?.href, COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL);
assert.equal(COMPANION_PUBLIC_LINKS[1]?.href, COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL);

const envSnapshot = process.env[COMPANION_PUBLIC_LINKS_ENV_KEY];
try {
  delete process.env[COMPANION_PUBLIC_LINKS_ENV_KEY];
  assert.equal(isCompanionPublicLinksEnabled(), false);
  assert.equal(isCompanionPublicLinksEnabled({ companionPublicLinksEnabled: true }), true);
  assert.equal(isCompanionPublicLinksEnabled({ companionPublicLinksEnabled: false }), false);

  process.env[COMPANION_PUBLIC_LINKS_ENV_KEY] = "true";
  assert.equal(isCompanionPublicLinksEnabled(), true);

  process.env[COMPANION_PUBLIC_LINKS_ENV_KEY] = "false";
  assert.equal(isCompanionPublicLinksEnabled(), false);
} finally {
  if (envSnapshot === undefined) {
    delete process.env[COMPANION_PUBLIC_LINKS_ENV_KEY];
  } else {
    process.env[COMPANION_PUBLIC_LINKS_ENV_KEY] = envSnapshot;
  }
}

const assistantSource = fs.readFileSync(
  path.join(process.cwd(), "components/marketing/WebsiteCompanionAssistant.tsx"),
  "utf8",
);
assert.match(assistantSource, /target="_blank"/);
assert.match(assistantSource, /rel="noopener noreferrer"/);
assert.match(assistantSource, /COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL/);
assert.match(assistantSource, /COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL/);
assert.match(assistantSource, /isCompanionPublicLinksEnabled/);

console.log("companion-public-links.test.ts: all assertions passed");
