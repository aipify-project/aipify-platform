import assert from "node:assert/strict";
import {
  DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG,
  buildWebsiteKompisDisabledResponse,
  getWebsiteKompisInstallConfigForPublicRequest,
  normalizeWebsiteKompisInstallConfig,
  toWebsiteKompisPublicInstallMetadata,
  WEBSITE_KOMPIS_DISABLED_SOURCE,
} from "@/lib/marketing/website-kompis-install-config";

async function runWebsiteKompisInstallConfigTests() {
  const defaults = normalizeWebsiteKompisInstallConfig(undefined);
  assert.deepEqual(defaults.sources, DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG.sources);
  assert.equal(defaults.enabled, true);
  assert.equal(defaults.iconVariant, "companion-purple-default");
  assert.equal(defaults.sources.publicSiteIndex, false);

  const invalidVariant = normalizeWebsiteKompisInstallConfig({
    website_kompis: { iconVariant: "not-a-real-variant" },
  });
  assert.equal(invalidVariant.iconVariant, "companion-purple-default");

  const validVariant = normalizeWebsiteKompisInstallConfig({
    website_kompis: { iconVariant: "companion-purple-dark" },
  });
  assert.equal(validVariant.iconVariant, "companion-purple-dark");

  const ignoredUnknown = normalizeWebsiteKompisInstallConfig({
    website_kompis: {
      iconVariant: "companion-purple-light",
      tenantId: "secret",
      iconUrl: "https://evil.example/icon.svg",
      extraField: true,
    },
  });
  assert.equal(ignoredUnknown.iconVariant, "companion-purple-light");
  assert.equal("tenantId" in ignoredUnknown, false);
  assert.equal("iconUrl" in ignoredUnknown, false);

  const invalidBooleans = normalizeWebsiteKompisInstallConfig({
    website_kompis: {
      enabled: "yes",
      sources: { faq: "true", currentPage: 1, publicSiteIndex: true, aipifyPublic: null },
    },
  });
  assert.equal(invalidBooleans.enabled, true);
  assert.equal(invalidBooleans.sources.faq, true);
  assert.equal(invalidBooleans.sources.currentPage, true);
  assert.equal(invalidBooleans.sources.publicSiteIndex, false);
  assert.equal(invalidBooleans.sources.aipifyPublic, true);

  const toggles = normalizeWebsiteKompisInstallConfig({
    website_kompis: {
      enabled: false,
      sources: { faq: false, currentPage: false, publicSiteIndex: true, aipifyPublic: false },
      fallbackTone: "short-direct",
      welcomeMessageVariant: "compact",
      defaultLocale: "en",
    },
  });
  assert.equal(toggles.enabled, false);
  assert.equal(toggles.sources.faq, false);
  assert.equal(toggles.sources.currentPage, false);
  assert.equal(toggles.sources.publicSiteIndex, true);
  assert.equal(toggles.fallbackTone, "short-direct");
  assert.equal(toggles.welcomeMessageVariant, "compact");
  assert.equal(toggles.defaultLocale, "en");

  const metadata = toWebsiteKompisPublicInstallMetadata(toggles);
  assert.equal(metadata.enabled, false);
  assert.equal(metadata.iconVariant, "companion-purple-default");
  assert.equal(Object.hasOwn(metadata, "tenantId"), false);

  const disabled = buildWebsiteKompisDisabledResponse("en", "example-a.com");
  assert.equal(disabled.sources[0]?.route, WEBSITE_KOMPIS_DISABLED_SOURCE);
  assert.match(disabled.answer.directAnswer, /temporarily unavailable/i);

  const fromRaw = await getWebsiteKompisInstallConfigForPublicRequest(
    {
      installId: "11111111-1111-4111-8111-111111111111",
      domain: "example-a.test",
      locale: "en",
    },
    {
      rawInstallConfig: {
        website_kompis: { iconVariant: "companion-purple-light" },
      },
    },
  );
  assert.equal(fromRaw.iconVariant, "companion-purple-light");

  const noContext = await getWebsiteKompisInstallConfigForPublicRequest({});
  assert.equal(noContext.iconVariant, "companion-purple-default");

  const fromPersisted = await getWebsiteKompisInstallConfigForPublicRequest(
    {
      installId: "11111111-1111-4111-8111-111111111111",
      domain: "example-a.test",
      locale: "en",
    },
    {
      loadInstallConfig: async () => ({
        iconVariant: "companion-purple-dark",
        enabled: false,
        sources: { faq: false, currentPage: true, aipifyPublic: false },
      }),
    },
  );
  assert.equal(fromPersisted.iconVariant, "companion-purple-dark");
  assert.equal(fromPersisted.enabled, false);
  assert.equal(fromPersisted.sources.faq, false);
  assert.equal(fromPersisted.sources.aipifyPublic, false);

  console.log("website-kompis-install-config.test.ts: all assertions passed");
}

runWebsiteKompisInstallConfigTests().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
