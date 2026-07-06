import assert from "node:assert/strict";
import { shouldHideWebsiteKompisLauncherFromEmbedMetadata } from "@/lib/marketing/website-kompis-launcher-visibility";

function runWebsiteKompisLauncherVisibilityTests() {
  assert.equal(shouldHideWebsiteKompisLauncherFromEmbedMetadata(null), false);
  assert.equal(shouldHideWebsiteKompisLauncherFromEmbedMetadata({ enabled: true }), false);
  assert.equal(shouldHideWebsiteKompisLauncherFromEmbedMetadata({ enabled: false }), true);
  assert.equal(shouldHideWebsiteKompisLauncherFromEmbedMetadata({ available: false }), true);
  assert.equal(
    shouldHideWebsiteKompisLauncherFromEmbedMetadata({ enabled: true, available: false }),
    true,
  );

  console.log("website-kompis-launcher-visibility.test.ts: all assertions passed");
}

runWebsiteKompisLauncherVisibilityTests();
