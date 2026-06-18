import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name === "page.tsx") files.push(full);
  }
  return files;
}

let updated = 0;
let skipped = 0;

for (const file of walk(path.join(root, "app/app"))) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes('["customerApp"]') && !content.includes("['customerApp']")) {
    continue;
  }

  const moduleMatch = content.match(/const p = ["']customerApp\.([^"']+)["']/);
  if (!moduleMatch) {
    skipped += 1;
    continue;
  }

  const moduleKey = moduleMatch[1];

  content = content.replace(
    /import \{ getDictionary \} from "@\/lib\/i18n\/get-dictionary";/,
    'import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";'
  );

  content = content.replace(
    /const dict = await getDictionary\(await getLocale\(\), \["customerApp"\]\);/,
    `const dict = await getCustomerAppDictionaryForModule(await getLocale(), "${moduleKey}");`
  );

  fs.writeFileSync(file, content);
  updated += 1;
}

console.log(`Updated ${updated} pages, skipped ${skipped} without module prefix`);
