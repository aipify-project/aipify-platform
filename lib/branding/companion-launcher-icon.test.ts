import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_LAUNCHER_ICON,
  getCompanionLauncherIconEmbedConfig,
  getCompanionLauncherIconPath,
  getCompanionLauncherIconUrl,
} from "@/lib/branding/companion-launcher-icon";

const root = process.cwd();

assert.equal(getCompanionLauncherIconPath(), "/aipify-companion-launcher-icon.svg");
assert.equal(
  getCompanionLauncherIconUrl("https://aipify.ai"),
  "https://aipify.ai/aipify-companion-launcher-icon.svg",
);

const config = getCompanionLauncherIconEmbedConfig("https://aipify.ai");
assert.equal(config.id, COMPANION_LAUNCHER_ICON.id);
assert.equal(config.iconUrl, "https://aipify.ai/aipify-companion-launcher-icon.svg");
assert.equal(config.iconPath, "/aipify-companion-launcher-icon.svg");
assert.equal(config.ariaLabel, "Aipify Companion");
assert.equal(config.presenceRingColor, "#34D399");

const publicAsset = path.join(root, "public/aipify-companion-launcher-icon.svg");
const sourceAsset = path.join(root, "assets/brand/aipify-companion-launcher-icon.svg");
assert.ok(fs.existsSync(publicAsset), "public launcher icon asset must exist");
assert.ok(fs.existsSync(sourceAsset), "source launcher icon asset must exist");

const svg = fs.readFileSync(publicAsset, "utf8");
assert.match(svg, /#34D399/);
assert.match(svg, /#6d28d9/);
assert.match(svg, /aipify-companion-launcher-gradient/);

const routeSource = fs.readFileSync(
  path.join(root, "app/api/embed/companion/launcher-icon/route.ts"),
  "utf8",
);
assert.match(routeSource, /getCompanionLauncherIconEmbedConfig/);

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
