import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const localesDir = path.join(root, "locales");

/** Shell-only keys required by app/app/layout.tsx and shared navigation. */
const SHELL_KEYS = [
  "nav",
  "navGroups",
  "portalStructure",
  "multiTenantArchitecture",
  "twoFactor",
  "companionPresence",
  "voiceOfCustomer",
];

for (const locale of fs.readdirSync(localesDir)) {
  const sourcePath = path.join(localesDir, locale, "customerApp.json");
  if (!fs.existsSync(sourcePath)) continue;

  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const shell = {};

  for (const key of SHELL_KEYS) {
    if (source[key] !== undefined) {
      shell[key] = source[key];
    }
  }

  const targetPath = path.join(localesDir, locale, "customerAppShell.json");
  fs.writeFileSync(targetPath, `${JSON.stringify(shell, null, 2)}\n`);
  console.log(`Wrote ${targetPath} (${JSON.stringify(shell).length} bytes)`);
}
