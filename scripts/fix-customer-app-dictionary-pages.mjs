import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const NAVIGATION_KEYS = new Set([
  "nav",
  "navGroups",
  "portalStructure",
  "multiTenantArchitecture",
  "twoFactor",
  "companionPresence",
  "voiceOfCustomer",
]);

function resolveSplit(key) {
  if (NAVIGATION_KEYS.has(key)) return "navigation";
  if (/^digitalEmployee/.test(key)) return "digitalEmployees";
  if (/^(digitalWorkforce|aipifyTalent|enterpriseOrganizationalMemory)/.test(key)) return "workforce";
  if (/^companion/.test(key)) return "companion";
  if (/^(marketplace|skillStore|skillsMarketplace|moduleMarketplace)/.test(key)) return "marketplace";
  if (/^(settings|security|billing|governance|approvalProfiles|financialGuardrails|trustTransparency|permissionAccess)/i.test(key))
    return "settings";
  if (/^(actionCenter|commandCenter|incidentCommand|automationControl|platformObservability|databaseGovernance)/i.test(key))
    return "commandCenter";
  if (/^(home|executive|briefing|organizational|businessPulse|learning|license|install|knowledge|operations|platform|memory|workspace)/i.test(key))
    return "dashboard";
  return "core";
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name === "page.tsx") files.push(full);
  }
  return files;
}

function extractSplits(content) {
  const splits = new Set();
  const re = /customerApp\.([A-Za-z0-9_]+)/g;
  let match;
  while ((match = re.exec(content))) {
    splits.add(resolveSplit(match[1]));
  }
  if (splits.size === 0) splits.add("dashboard");
  return [...splits];
}

let fixed = 0;

for (const file of walk(path.join(root, "app/app"))) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes('getDictionary(locale, ["customerApp"]') &&
      !content.includes("getDictionary(locale, ['customerApp']") &&
      !content.includes('getDictionary(await getLocale(), ["customerApp"]')) {
    continue;
  }

  const splits = extractSplits(content);
  const splitsLiteral = `[${splits.map((s) => `"${s}"`).join(", ")}]`;

  content = content.replace(
    /import \{[^}]+\} from "@\/lib\/i18n\/get-dictionary";/,
    'import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";'
  );

  content = content.replace(
    /const dict = await getDictionary\(locale, \["customerApp"\]\);/g,
    `const dict = await getCustomerAppDictionaryForSplits(locale, ${splitsLiteral});`
  );

  content = content.replace(
    /const dict = await getDictionary\(await getLocale\(\), \["customerApp"\]\);/g,
    `const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ${splitsLiteral});`
  );

  fs.writeFileSync(file, content);
  fixed += 1;
}

console.log(`Fixed ${fixed} pages`);
