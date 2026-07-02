#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { MARKETING_SURFACE_PATCHES } = await import(
  pathToFileURL(path.join(root, "lib/marketing/i18n/marketing-surface-patches.mjs")).href
);

for (const locale of ["no", "sv", "da"]) {
  if (MARKETING_SURFACE_PATCHES[locale]?.homepageRedesign) {
    delete MARKETING_SURFACE_PATCHES[locale].homepageRedesign;
  }
}

const header = `/**
 * Hand-crafted marketing surface translations for public aipify.ai pages.
 * Applied by scripts/sync-marketing-i18n.mjs — not loaded at runtime.
 */

/** @type {Record<string, Record<string, unknown>>} */
export const MARKETING_SURFACE_PATCHES = `;

function serialize(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return JSON.stringify(obj);
  }
  const entries = Object.entries(obj);
  if (entries.length === 0) return "{}";
  return `{\n${entries
    .map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      return `${padIn}${key}: ${serialize(v, indent + 1)}`;
    })
    .join(",\n")}\n${pad}}`;
}

writeFileSync(
  path.join(root, "lib/marketing/i18n/marketing-surface-patches.mjs"),
  `${header}${serialize(MARKETING_SURFACE_PATCHES)};\n`,
  "utf8"
);
console.log("Removed homepageRedesign from surface patches (no/sv/da)");
