/**
 * Migrate plain-text loading states to AipifyLoadingState.
 * Run: node scripts/migrate-aipify-loading-states.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMPORT_LINE =
  'import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";';

const REPLACEMENTS = [
  [
    /if \(loading\) return <div className="text-sm text-gray-600">\{labels\.loading\}<\/div>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <div className="p-8 text-sm text-gray-600">\{labels\.loading\}<\/div>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <div className="p-6 text-sm text-gray-600">\{labels\.loading\}<\/div>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <p className="p-6 text-sm text-gray-500">\{labels\.loading\}<\/p>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <p className="p-6 text-sm text-zinc-500">\{labels\.loading\}<\/p>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <p className="p-6 text-sm text-neutral-500">\{labels\.loading\}<\/p>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <p className="mb-6 text-sm text-gray-500">\{labels\.loading\}<\/p>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading\) return <p className="text-sm text-gray-500">\{labels\.loading\}<\/p>;/g,
    "if (loading) return <AipifyLoadingState message={labels.loading} centered />;",
  ],
  [
    /if \(loading && !dashboard\) return <AipifyLoader label=\{labels\.loading \?\? "Loading"\} centered fullPage \/>;/g,
    "if (loading && !dashboard) return <AipifyLoadingState message={labels.loading} centered fullPage />;",
  ],
  [
    /<AipifyLoader centered \/>\s*<span className="sr-only">\{labels\.loading\}<\/span>/g,
    '<AipifyLoader label={labels.loading} centered />',
  ],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (entry.name.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

function ensureImport(source) {
  const importLine = 'import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";';
  if (source.includes(importLine)) return source;
  if (!source.includes("<AipifyLoadingState")) return source;

  const useClientMatch = source.match(/^"use client";\n\n/m);
  if (useClientMatch) {
    return source.replace(useClientMatch[0], `${useClientMatch[0]}${IMPORT_LINE}\n`);
  }

  const firstImport = source.match(/^import .+\n/m);
  if (firstImport) {
    return source.replace(firstImport[0], `${firstImport[0]}${IMPORT_LINE}\n`);
  }

  return `${IMPORT_LINE}\n${source}`;
}

let updated = 0;
for (const file of walk(path.join(root, "components"))) {
  let source = fs.readFileSync(file, "utf8");
  let changed = false;

  for (const [pattern, replacement] of REPLACEMENTS) {
    if (pattern.test(source)) {
      source = source.replace(pattern, replacement);
      changed = true;
    }
  }

  if (changed) {
    source = ensureImport(source);
    fs.writeFileSync(file, source);
    updated += 1;
    console.log(`Updated ${path.relative(root, file)}`);
  }
}

console.log(`Done. ${updated} file(s) updated.`);
