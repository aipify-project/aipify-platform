#!/usr/bin/env node
/**
 * Applies Aipify Identity Rule to customer-facing locale strings.
 * Run: npx tsx scripts/apply-aipify-identity-language.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyAipifyFirstLanguagePolicy } from "../lib/internal-language-model/brand-identity-vocabulary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SPECIFIC_REPLACEMENTS: Record<string, string> = {
  "AI Ethics & Responsible Use Engine": "Responsible Use & Ethics Engine",
  "AI Ethics (A.46)": "Responsible Use & Ethics (A.46)",
  "AI Ethics (Blueprint 98)": "Responsible Use & Ethics (Blueprint 98)",
  "AI Ethics council": "Responsible Use & Ethics council",
  "AI Ethics governance": "Responsible Use & Ethics governance",
  "AI Ethics A.46": "Responsible Use & Ethics A.46",
  "not an AI wellness bot": "not a generic wellness bot",
  "support, knowledge, AI, integrations": "support, knowledge, companion activity, integrations",
};

function transformString(value: string): string {
  let next = value;
  for (const [from, to] of Object.entries(SPECIFIC_REPLACEMENTS)) {
    if (next.includes(from)) next = next.replaceAll(from, to);
  }
  next = applyAipifyFirstLanguagePolicy(next);
  if (next === "AI Ethics") return "Responsible Use & Ethics";
  return next;
}

function walk(node: unknown, stats: { updated: number }): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => walk(item, stats));
  }

  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        const transformed = transformString(value);
        if (transformed !== value) stats.updated += 1;
        out[key] = transformed;
      } else {
        out[key] = walk(value, stats);
      }
    }
    return out;
  }

  return node;
}

const targets = [
  "locales/en/customerApp.json",
  "locales/no/customerApp.json",
  "locales/sv/customerApp.json",
  "locales/da/customerApp.json",
  "locales/en/dashboard.json",
  "locales/no/dashboard.json",
  "locales/sv/dashboard.json",
  "locales/da/dashboard.json",
  "locales/en/landing.json",
  "locales/no/landing.json",
  "locales/sv/landing.json",
  "locales/da/landing.json",
];

let total = 0;
for (const relativePath of targets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) continue;

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const stats = { updated: 0 };
  const transformed = walk(data, stats);

  if (stats.updated > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(transformed, null, 2)}\n`);
    console.log(`${relativePath}: ${stats.updated} strings updated`);
    total += stats.updated;
  }
}

console.log(`Done. ${total} strings updated.`);
