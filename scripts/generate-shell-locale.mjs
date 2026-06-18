/**
 * Generates locales/{locale}/shell.json — layout chrome only (~5–10 KB).
 * Run: node scripts/generate-shell-locale.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const localesDir = path.join(root, "locales");
const TARGET_LOCALES = ["en", "no", "sv", "da", "pl", "uk"];

const COMPANION_PRESENCE_SHELL_KEYS = [
  "ariaIndicator",
  "ariaPanel",
  "ariaClose",
  "ariaCollapse",
  "ariaExpand",
  "sinceLastLogin",
  "tasks",
  "approvals",
  "notifications",
  "askAipify",
  "privacyNote",
  "quietMode",
  "quietModeOff",
  "acknowledgeCritical",
  "loading",
  "newSinceLogin",
  "unresolvedApprovals",
  "states",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readJsonOrFallback(localeDir, name, fallbackDir) {
  const primary = path.join(localeDir, `${name}.json`);
  if (fs.existsSync(primary)) return readJson(primary);
  if (fallbackDir) return readJson(path.join(fallbackDir, `${name}.json`));
  throw new Error(`Missing locale file: ${primary}`);
}

function pickCompanionPresenceShell(source) {
  if (!source) return {};
  const out = {};
  for (const key of COMPANION_PRESENCE_SHELL_KEYS) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

function pickDashboardRoles(dashboard) {
  return dashboard.roles ?? {};
}

for (const locale of TARGET_LOCALES) {
  const localeDir = path.join(localesDir, locale);
  if (!fs.existsSync(localeDir)) continue;

  const fallbackDir = locale === "en" ? null : path.join(localesDir, "en");
  const dashboard = readJsonOrFallback(localeDir, "dashboard", fallbackDir);
  const auth = readJsonOrFallback(localeDir, "auth", fallbackDir);
  const license = readJsonOrFallback(localeDir, "license", fallbackDir);
  const branding = readJsonOrFallback(localeDir, "branding", fallbackDir);
  const commandBar = readJsonOrFallback(localeDir, "commandBar", fallbackDir);

  const navSplitPath = path.join(localeDir, "customer-app", "navigation.json");
  const settingsSplitPath = path.join(localeDir, "customer-app", "settings.json");
  const enNavSplit = readJson(path.join(localesDir, "en", "customer-app", "navigation.json"));
  const enSettingsSplit = readJson(path.join(localesDir, "en", "customer-app", "settings.json"));
  const navSplit = fs.existsSync(navSplitPath) ? readJson(navSplitPath) : enNavSplit;
  const settingsSplit = fs.existsSync(settingsSplitPath) ? readJson(settingsSplitPath) : enSettingsSplit;

  const shell = {
    sidebar: {
      plan: dashboard.sidebar?.plan,
      workspaceControlCenter: dashboard.sidebar?.workspaceControlCenter,
    },
    topbar: dashboard.topbar ?? {},
    search: dashboard.search,
    navSearch: dashboard.navSearch ?? {},
    roles: pickDashboardRoles(dashboard),
    signOut: auth.logout?.signOut ?? "Sign out",
    licenseSidebar: license.sidebar ?? {},
    branding: {
      pulseLabel: branding.pulseLabel,
    },
    commandBar,
    twoFactor: {
      badge: settingsSplit.twoFactor?.badge ?? enSettingsSplit.twoFactor?.badge ?? {
        enabled: "Sign-in verification enabled",
        required: "Verification required for your role",
      },
    },
    multiTenantArchitecture:
      navSplit.multiTenantArchitecture ?? enNavSplit.multiTenantArchitecture ?? {},
    companionPresence: pickCompanionPresenceShell(
      navSplit.companionPresence ?? enNavSplit.companionPresence
    ),
    voiceOfCustomer: navSplit.voiceOfCustomer ?? enNavSplit.voiceOfCustomer ?? {},
  };

  const outPath = path.join(localeDir, "shell.json");
  fs.writeFileSync(outPath, `${JSON.stringify(shell, null, 2)}\n`);
  console.log(`${locale}/shell.json: ${JSON.stringify(shell).length} bytes`);
}
