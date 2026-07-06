import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_LAUNCHER_ICON,
  getCompanionLauncherIconEmbedConfig,
  getCompanionLauncherIconPath,
  getCompanionLauncherIconUrl,
} from "@/lib/branding/companion-launcher-icon";
import {
  COMPANION_LAUNCHER_ICON_VARIANT_KEYS,
  DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
  resolveCompanionLauncherIconVariant,
} from "@/lib/branding/companion-launcher-icons";
import { GET as getLauncherIconMetadata } from "@/app/api/embed/companion/launcher-icon/route";

async function runCompanionLauncherIconTests() {
  const root = process.cwd();
  const origin = "https://aipify.ai";
  const forbiddenMetadataKeys = [
    "tenantId",
    "tenant_id",
    "companyId",
    "company_id",
    "installId",
    "install_id",
    "customerId",
    "customer_id",
    "domain",
  ];

  assert.equal(getCompanionLauncherIconPath(), "/aipify-companion-launcher-icon.svg");
  assert.equal(
    getCompanionLauncherIconUrl(origin),
    "https://aipify.ai/aipify-companion-launcher-icon.svg",
  );

  const config = getCompanionLauncherIconEmbedConfig(origin);
  assert.equal(config.id, COMPANION_LAUNCHER_ICON.id);
  assert.equal(config.iconUrl, "https://aipify.ai/aipify-companion-launcher-icon.svg");
  assert.equal(config.iconPath, "/aipify-companion-launcher-icon.svg");
  assert.equal(config.ariaLabel, "Aipify Companion");
  assert.equal(config.presenceRingColor, "#34D399");
  assert.equal(config.defaultVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  assert.equal(config.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);

  assert.equal(config.variants.length, COMPANION_LAUNCHER_ICON_VARIANT_KEYS.length);
  const variantKeys = config.variants.map((variant) => variant.variantKey);
  assert.ok(variantKeys.includes("companion-purple-dark"));
  assert.ok(variantKeys.includes("companion-purple-light"));
  assert.ok(variantKeys.includes("companion-purple-default"));

  const darkVariant = config.variants.find(
    (variant) => variant.variantKey === "companion-purple-dark",
  );
  const lightVariant = config.variants.find(
    (variant) => variant.variantKey === "companion-purple-light",
  );
  assert.ok(darkVariant);
  assert.ok(lightVariant);
  assert.equal(darkVariant.recommendedSurface, "light");
  assert.equal(lightVariant.recommendedSurface, "dark");

  const invalidSelection = getCompanionLauncherIconEmbedConfig(origin, {
    variant: "not-an-approved-variant",
  });
  assert.equal(invalidSelection.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  assert.equal(
    invalidSelection.iconUrl,
    "https://aipify.ai/aipify-companion-launcher-icon.svg",
  );

  const darkSelection = getCompanionLauncherIconEmbedConfig(origin, {
    variant: "companion-purple-dark",
  });
  assert.equal(darkSelection.selectedVariant, "companion-purple-dark");
  assert.equal(
    darkSelection.iconUrl,
    "https://aipify.ai/aipify-companion-launcher-icon-dark.svg",
  );

  assert.equal(
    resolveCompanionLauncherIconVariant("companion-purple-light"),
    "companion-purple-light",
  );
  assert.equal(
    resolveCompanionLauncherIconVariant(undefined),
    DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
  );

  const metadataResponse = await getLauncherIconMetadata(
    new Request("https://aipify.ai/api/embed/companion/launcher-icon"),
  );
  assert.equal(metadataResponse.status, 200);
  const metadataBody = (await metadataResponse.json()) as ReturnType<
    typeof getCompanionLauncherIconEmbedConfig
  >;
  assert.equal(metadataBody.iconUrl, "https://aipify.ai/aipify-companion-launcher-icon.svg");
  assert.equal(metadataBody.defaultVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  assert.equal(metadataBody.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);

  const variantResponse = await getLauncherIconMetadata(
    new Request(
      "https://aipify.ai/api/embed/companion/launcher-icon?variant=companion-purple-light",
    ),
  );
  assert.equal(variantResponse.status, 200);
  const variantBody = (await variantResponse.json()) as ReturnType<
    typeof getCompanionLauncherIconEmbedConfig
  >;
  assert.equal(variantBody.selectedVariant, "companion-purple-light");
  assert.equal(
    variantBody.iconUrl,
    "https://aipify.ai/aipify-companion-launcher-icon-light.svg",
  );

  const installConfigMeta = getCompanionLauncherIconEmbedConfig(origin, {
    installConfig: {
      enabled: false,
      iconVariant: "companion-purple-dark",
      welcomeMessageVariant: "compact",
      fallbackTone: "short-direct",
    },
    preferInstallConfigVariant: true,
  });
  assert.equal(installConfigMeta.selectedVariant, "companion-purple-dark");
  assert.equal(installConfigMeta.enabled, false);
  assert.equal(installConfigMeta.welcomeMessageVariant, "compact");

  const licensedDisabledMeta = getCompanionLauncherIconEmbedConfig(origin, {
    installConfig: {
      enabled: false,
      available: false,
      reason: "license_required",
    },
    preferInstallConfigVariant: true,
  });
  assert.equal(licensedDisabledMeta.enabled, false);
  assert.equal(licensedDisabledMeta.available, false);
  assert.equal(licensedDisabledMeta.unavailableReason, "license_required");

  const invalidInstallVariant = getCompanionLauncherIconEmbedConfig(origin, {
    installConfig: { iconVariant: "bad-variant" },
    preferInstallConfigVariant: true,
  });
  assert.equal(invalidInstallVariant.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);

  const neutralInstallId = "00000000-0000-4000-8000-000000000001";
  const neutralDomain = "neutral-example.test";

  const unavailableInstallResponse = await getLauncherIconMetadata(
    new Request(
      `https://aipify.ai/api/embed/companion/launcher-icon?installId=${neutralInstallId}&domain=${neutralDomain}`,
    ),
  );
  assert.equal(unavailableInstallResponse.status, 200);
  const unavailableInstallBody = (await unavailableInstallResponse.json()) as ReturnType<
    typeof getCompanionLauncherIconEmbedConfig
  >;
  assert.equal(unavailableInstallBody.enabled, false);
  assert.equal(unavailableInstallBody.available, false);
  assert.equal(unavailableInstallBody.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  for (const key of forbiddenMetadataKeys) {
    assert.equal(Object.hasOwn(unavailableInstallBody, key), false);
  }

  const installSelectorResponse = await getLauncherIconMetadata(
    new Request(
      `https://aipify.ai/api/embed/companion/launcher-icon?installId=${neutralInstallId}&domain=${neutralDomain}&variant=companion-purple-light`,
    ),
  );
  assert.equal(installSelectorResponse.status, 200);
  const installSelectorBody = (await installSelectorResponse.json()) as ReturnType<
    typeof getCompanionLauncherIconEmbedConfig
  >;
  assert.equal(installSelectorBody.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  assert.equal(installSelectorBody.enabled, false);

  const installIdOnlyResponse = await getLauncherIconMetadata(
    new Request(
      `https://aipify.ai/api/embed/companion/launcher-icon?installId=${neutralInstallId}`,
    ),
  );
  assert.equal(installIdOnlyResponse.status, 200);
  const installIdOnlyBody = (await installIdOnlyResponse.json()) as ReturnType<
    typeof getCompanionLauncherIconEmbedConfig
  >;
  assert.equal(installIdOnlyBody.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  assert.equal(installIdOnlyBody.defaultVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);
  assert.equal(installIdOnlyBody.enabled, false);
  for (const key of forbiddenMetadataKeys) {
    assert.equal(Object.hasOwn(installIdOnlyBody, key), false);
  }

  const invalidInstallResponse = await getLauncherIconMetadata(
    new Request("https://aipify.ai/api/embed/companion/launcher-icon?installId=not-a-uuid"),
  );
  assert.equal(invalidInstallResponse.status, 200);
  const invalidInstallBody = (await invalidInstallResponse.json()) as ReturnType<
    typeof getCompanionLauncherIconEmbedConfig
  >;
  assert.equal(invalidInstallBody.selectedVariant, DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT);

  for (const key of forbiddenMetadataKeys) {
    assert.equal(Object.hasOwn(config, key), false, `metadata must not expose ${key}`);
    for (const variant of config.variants) {
      assert.equal(Object.hasOwn(variant, key), false, `variant metadata must not expose ${key}`);
    }
  }

  const assetPairs = [
    ["public/aipify-companion-launcher-icon.svg", "assets/brand/aipify-companion-launcher-icon.svg"],
    [
      "public/aipify-companion-launcher-icon-dark.svg",
      "assets/brand/aipify-companion-launcher-icon-dark.svg",
    ],
    [
      "public/aipify-companion-launcher-icon-light.svg",
      "assets/brand/aipify-companion-launcher-icon-light.svg",
    ],
  ] as const;

  for (const [publicRelativePath, sourceRelativePath] of assetPairs) {
    const publicAsset = path.join(root, publicRelativePath);
    const sourceAsset = path.join(root, sourceRelativePath);
    assert.ok(fs.existsSync(publicAsset), `${publicRelativePath} must exist`);
    assert.ok(fs.existsSync(sourceAsset), `${sourceRelativePath} must exist`);

    const svg = fs.readFileSync(publicAsset, "utf8");
    assert.match(svg, /<svg/);
    assert.match(svg, /viewBox="-1 -1 50 50"/);
    assert.equal(
      fs.readFileSync(sourceAsset, "utf8"),
      svg,
      `${publicRelativePath} must match source asset`,
    );
  }

  const defaultSvg = fs.readFileSync(
    path.join(root, "public/aipify-companion-launcher-icon.svg"),
    "utf8",
  );
  assert.match(defaultSvg, /#34D399/);
  assert.match(defaultSvg, /#6d28d9/);
  assert.match(defaultSvg, /aipify-companion-launcher-gradient/);
  assert.match(defaultSvg, /aipify-companion-launcher-glow/);
  assert.match(defaultSvg, /overflow="visible"/);
  assert.doesNotMatch(defaultSvg, /r="18"[^>]*fill="#34D399"/);

  const routeSource = fs.readFileSync(
    path.join(root, "app/api/embed/companion/launcher-icon/route.ts"),
    "utf8",
  );
  assert.match(routeSource, /getCompanionLauncherIconEmbedConfig/);
  assert.match(routeSource, /searchParams\.get\("variant"\)/);
  assert.match(routeSource, /getWebsiteKompisInstallConfigForPublicRequest/);

  const installConfigSource = fs.readFileSync(
    path.join(root, "lib/marketing/website-kompis-install-config.ts"),
    "utf8",
  );
  assert.match(installConfigSource, /loadWebsiteKompisInstallConfigFromStorage/);

  const storageSource = fs.readFileSync(
    path.join(root, "lib/marketing/website-kompis-install-config-storage.ts"),
    "utf8",
  );
  assert.match(storageSource, /get_website_kompis_public_install_config/);

  const brandingComponentSource = fs.readFileSync(
    path.join(root, "components/branding/AipifyCompanionLauncherIcon.tsx"),
    "utf8",
  );
  assert.match(brandingComponentSource, /AipifyCompanionLauncherIcon/);
  assert.match(brandingComponentSource, /availabilityRing/);

  const companionAliasSource = fs.readFileSync(
    path.join(root, "components/app/companion-experience/CompanionIcon.tsx"),
    "utf8",
  );
  assert.match(companionAliasSource, /AipifyCompanionLauncherIcon as CompanionIcon/);

  console.log("companion-launcher-icon.test.ts: all assertions passed");
}

runCompanionLauncherIconTests().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
