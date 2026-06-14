#!/usr/bin/env node
/**
 * Applies Enterprise Loading Language Standard to locale JSON files.
 * Run: node scripts/apply-enterprise-loading-language.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SPECIFIC_REPLACEMENTS = {
  en: {
    "Loading AI action dashboard…": "Reviewing pending activities…",
    "Loading AI ethics…": "Reviewing compliance indicators…",
    "Loading AI cost governance dashboard…": "Updating governance insights…",
    "Thinking…": "Aipify is preparing your workspace…",
    "Loading…": "Updating operational overview…",
    "Loading your overview…": "Updating operational overview…",
    "Loading executive dashboard…": "Preparing executive briefing…",
    "Loading recommendations…": "Preparing recommendations…",
    "Loading security & compliance…": "Verifying security posture…",
    "Loading security & trust dashboard…": "Verifying security posture…",
    "Loading briefing…": "Preparing executive briefing…",
    "Loading Companion Briefing…": "Preparing executive briefing…",
    "Loading commerce intelligence dashboard…": "Updating commerce intelligence…",
    "Loading commerce Companion dashboard…": "Updating commerce intelligence…",
    "Loading support operations…": "Reviewing pending activities…",
    "Loading support dashboard…": "Gathering operational data…",
    "Loading operations dashboard…": "Gathering operational data…",
    "Loading Operations Center…": "Gathering operational data…",
    "Loading approvals…": "Reviewing pending activities…",
    "Loading Aipify Install…": "Synchronizing approved workflows…",
    "Loading install dashboard…": "Synchronizing approved workflows…",
    "Loading presence activity…": "Updating business activity status…",
    "Loading presence…": "Updating business activity status…",
    "Loading Action Center…": "Reviewing pending activities…",
    "Loading memories…": "Aipify is preparing your workspace…",
    "Loading assistant identity…": "Aipify is preparing your workspace…",
    "Loading companion settings…": "Aipify is preparing your workspace…",
    "Loading proactive companion dashboard…": "Preparing recommendations…",
    "Loading onboarding progress...": "Synchronizing approved workflows…",
    "Loading billing...": "Reviewing account status…",
    "Loading your skill workspace...": "Aipify is preparing your workspace…",
    "Loading...": "Updating operational overview…",
    "Processing...": "Reviewing pending activities…",
  },
  no: {
    "Tenker…": "Aipify forbereder arbeidsområdet ditt…",
    "Laster...": "Oppdaterer operativ oversikt…",
    "Processing...": "Gjennomgår ventende aktiviteter…",
    "Loading billing...": "Gjennomgår kontostatus…",
    "Loading onboarding progress...": "Synkroniserer godkjente arbeidsflyter…",
    "Loading your skill workspace...": "Aipify forbereder arbeidsområdet ditt…",
  },
  sv: {
    "Laddar...": "Uppdaterar operativ översikt…",
    "Processing...": "Granskar väntande aktiviteter…",
    "Loading billing...": "Granskar kontostatus…",
    "Loading onboarding progress...": "Synkroniserar godkända arbetsflöden…",
    "Loading your skill workspace...": "Aipify förbereder din arbetsyta…",
  },
  da: {
    "Indlæser...": "Opdaterer operationel oversigt…",
    "Processing...": "Gennemgår ventende aktiviteter…",
    "Loading billing...": "Gennemgår kontostatus…",
    "Loading onboarding progress...": "Synkroniserer godkendte arbejdsgange…",
    "Loading your skill workspace...": "Aipify forbereder dit arbejdsområde…",
  },
};

function transformLoadingValue(value, locale) {
  if (typeof value !== "string") return value;

  const specific = SPECIFIC_REPLACEMENTS[locale] ?? SPECIFIC_REPLACEMENTS.en;
  if (specific[value]) return specific[value];

  const prepareWord =
    locale === "no" ? "Forbereder" : locale === "sv" ? "Förbereder" : locale === "da" ? "Forbereder" : "Preparing";

  let next = value;

  next = next.replace(/^Loading AI (.+?) dashboard…(?: \([a-z]{2}\))?$/i, (_, name) => {
    if (/ethics|compliance|governance|cost/i.test(name)) return "Reviewing compliance indicators…";
    return "Reviewing pending activities…";
  });

  next = next.replace(/^Loading Aipify (.+?) dashboard…(?: \([a-z]{2}\))?$/i, (_, name) => `${prepareWord} ${name} overview…`);
  next = next.replace(/^Loading (.+?) dashboard…(?: \([a-z]{2}\))?$/i, (_, name) => `${prepareWord} ${name} overview…`);
  next = next.replace(/^Loading (.+?)…(?: \([a-z]{2}\))?$/i, (_, name) => `${prepareWord} ${name} overview…`);
  next = next.replace(/^Loading (.+?)\.{3}(?: \([a-z]{2}\))?$/i, (_, name) => `${prepareWord} ${name} overview…`);

  if (/^Loading AI/i.test(next)) {
    next = locale === "en" ? "Reviewing pending activities…" : next.replace(/^Loading AI/i, prepareWord);
  }

  return next;
}

function walkAndTransform(node, locale, stats) {
  if (Array.isArray(node)) {
    return node.map((item) => walkAndTransform(item, locale, stats));
  }

  if (node && typeof node === "object") {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === "loading" && typeof value === "string") {
        const transformed = transformLoadingValue(value, locale);
        if (transformed !== value) stats.updated += 1;
        out[key] = transformed;
      } else if (key === "processing" && typeof value === "string" && value === "Processing...") {
        const transformed =
          locale === "no"
            ? "Gjennomgår ventende aktiviteter…"
            : locale === "sv"
              ? "Granskar väntande aktiviteter…"
              : locale === "da"
                ? "Gennemgår ventende aktiviteter…"
                : "Reviewing pending activities…";
        stats.updated += 1;
        out[key] = transformed;
      } else {
        out[key] = walkAndTransform(value, locale, stats);
      }
    }
    return out;
  }

  return node;
}

function processFile(relativePath, locale) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const stats = { updated: 0 };
  const transformed = walkAndTransform(data, locale, stats);

  if (stats.updated > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(transformed, null, 2)}\n`);
  }

  return stats.updated;
}

const targets = [
  ["locales/en/customerApp.json", "en"],
  ["locales/no/customerApp.json", "no"],
  ["locales/sv/customerApp.json", "sv"],
  ["locales/da/customerApp.json", "da"],
  ["locales/en/dashboard.json", "en"],
  ["locales/no/dashboard.json", "no"],
  ["locales/sv/dashboard.json", "sv"],
  ["locales/da/dashboard.json", "da"],
  ["locales/en/platform.json", "en"],
  ["locales/no/platform.json", "no"],
  ["locales/sv/platform.json", "sv"],
  ["locales/da/platform.json", "da"],
  ["locales/en/install.json", "en"],
  ["locales/no/install.json", "no"],
  ["locales/sv/install.json", "sv"],
  ["locales/da/install.json", "da"],
];

let total = 0;
for (const [file, locale] of targets) {
  const count = processFile(file, locale);
  if (count) {
    console.log(`${file}: ${count} loading strings updated`);
    total += count;
  }
}

console.log(`Done. ${total} loading strings updated.`);
