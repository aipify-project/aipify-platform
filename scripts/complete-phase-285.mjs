#!/usr/bin/env node
/** ABOS Phase 285 — Pilot Learning & Customer Zero Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 285,
  migration: "20261421300000_pilot_learning_customer_zero_engine_phase285.sql",
  slug: "pilot-learning-customer-zero-engine",
  docSlug: "PILOT_LEARNING_CUSTOMER_ZERO_ENGINE",
  ilmFile: "implementation-blueprint-phase285-pilot-learning-customer-zero-engine.txt",
  route: "/platform/pilot-operations",
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Customer Zero Center",
    subtitle:
      "Unonight is Aipify's first operational environment — learn, validate, measure value, and improve before external expansion.",
    loading: "Loading Customer Zero Center…",
    corePrinciple: "Core principle",
    customerZeroPrinciple: "Customer Zero principle",
    readinessTitle: "Readiness dashboard",
    sourcesTitle: "Learning sources",
    discoverSources: "Discover sources",
    discovering: "Discovering…",
    pilotLevelTitle: "Pilot capability level",
    recommendationsTitle: "Pending recommendations",
    noRecommendations: "No pending recommendations — observation phase active.",
    approve: "Approve",
    reject: "Reject",
    valueTitle: "Value tracking",
    expansionTitle: "Expansion gate",
    auditTitle: "Pilot audit trail",
    noAudit: "No pilot events recorded yet.",
    gateStatus: "Gate status",
    privacyNote: "Metadata only — no customer operational content, email, chat, or order data.",
    pilotLevels: {
      observe: "Observe",
      recommend: "Recommend",
      assist: "Assist",
      execute: "Execute",
    },
    readinessStates: {
      learning: "Learning",
      partiallyReady: "Partially Ready",
      readyToAssist: "Ready to Assist",
      readyToExecute: "Ready to Execute",
    },
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Customer Zero-senter",
    subtitle:
      "Unonight er Aipifys første operative miljø — lær, valider, mål verdi og forbedre før ekstern ekspansjon.",
    loading: "Laster Customer Zero-senter…",
    discoverSources: "Oppdag kilder",
    recommendationsTitle: "Ventende anbefalinger",
    approve: "Godkjenn",
    reject: "Avvis",
    expansionTitle: "Ekspansjonsport",
  };
  const svBlock = { ...i18nBlock(), title: "Customer Zero-center" };
  const daBlock = { ...i18nBlock(), title: "Customer Zero-center" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/platform.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.customerZero = block;
    data.nav = data.nav ?? {};
    data.nav.pilotOperations = block.title;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched platform i18n", locale);
  }
}

function patchNav() {
  const file = path.join(ROOT, "lib/platform/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("pilotOperations")) {
    c = c.replace(
      '| "pilotInstall"',
      '| "pilotOperations"\n  | "pilotInstall"',
    );
    c = c.replace(
      `{
    id: "pilotInstall",
    href: "/platform/install/unonight",
    labelKey: "platform.nav.pilotInstall",
  },`,
      `{
    id: "pilotOperations",
    href: "/platform/pilot-operations",
    labelKey: "platform.nav.pilotOperations",
  },
  {
    id: "pilotInstall",
    href: "/platform/install/unonight",
    labelKey: "platform.nav.pilotInstall",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/platform/install/unonight")) return "pilotInstall";',
      'if (pathname.startsWith("/platform/pilot-operations")) return "pilotOperations";\n  if (pathname.startsWith("/platform/install/unonight")) return "pilotInstall";',
    );
    fs.writeFileSync(file, c);
    console.log("patched platform nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./pilot-learning-customer-zero-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Pilot Learning & Customer Zero Engine
Route: ${P.route}
Module: Customer Zero Center
Location: Aipify Internal → Pilot Operations

Core principle: Before Aipify serves the world, Aipify must successfully serve its own ecosystem.
Customer Zero: Unonight — first pilot, learning environment, validation environment.
Pilot levels: 1 Observe · 2 Recommend · 3 Assist · 4 Execute
Readiness: Learning · Partially Ready · Ready to Assist · Ready to Execute
Expansion gate: KPIs, governance, admin feedback, time savings, operational value, error rates.
Helpers: _acz_* · _aczebp285_*
Extends Unonight Pilot Operations Engine Phase A.15.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Before Aipify serves the world, Aipify must successfully serve its own ecosystem.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CUSTOMER_ZERO_PRINCIPLE =
  "If Aipify cannot successfully help Unonight, Aipify is not ready for external customers.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase284-vocabulary";',
      `export * from "./implementation-blueprint-phase284-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE284_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase284-aipify-enterprise-packaging-upgrade-instant-access-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE284_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase284-aipify-enterprise-packaging-upgrade-instant-access-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Pilot Learning & Customer Zero Engine (Phase 285):** See [PILOT_LEARNING_CUSTOMER_ZERO_ENGINE_PHASE285.md](./PILOT_LEARNING_CUSTOMER_ZERO_ENGINE_PHASE285.md) — Customer Zero Center for Unonight at Aipify Internal → Pilot Operations. Pilot levels (Observe → Recommend → Assist → Execute), learning source discovery, readiness dashboard, human validation loop, value tracking, expansion gate. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_acz_*\`, \`_aczebp285_*\`. APIs at \`/api/platform/customer-zero/*\`. Platform admin only. Extends Unonight Pilot Operations Engine Phase A.15.`;
  if (!c.includes("Phase 285")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `PILOT_LEARNING_CUSTOMER_ZERO_ENGINE_PHASE${P.phase}.md`),
  `# Pilot Learning & Customer Zero Engine — Phase ${P.phase}

## Purpose

Establish Unonight as Aipify's first operational environment (Customer Zero) where Aipify learns, validates, and proves value before external expansion.

## Route

\`${P.route}\` (Aipify Internal → Pilot Operations)

## Core principle

Before Aipify serves the world, Aipify must successfully serve its own ecosystem.

## Pilot levels

1. **Observe** — read, analyze, monitor (no approval)
2. **Recommend** — draft, suggest (human approval required)
3. **Assist** — prepare reports, drafts, queues (approval for external actions)
4. **Execute** — approved automations (governance-based)

## Helpers

\`_acz_*\` · \`_aczebp285_*\`

Extends Unonight Pilot Operations Engine Phase A.15.
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Pilot Learning & Customer Zero Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Pilot Learning & Customer Zero — FAQ (Phase ${P.phase})

## What is Customer Zero?

Unonight — Aipify's first pilot customer and internal learning environment.

## Where is it configured?

Aipify Internal → Pilot Operations at \`${P.route}\`.

## Who can access it?

Platform admins only.

## What are the pilot levels?

Observe · Recommend · Assist · Execute — each with defined approval requirements.

## When can Aipify expand externally?

When expansion gate criteria are met: KPIs, governance stability, admin feedback, time savings, operational value, acceptable error rates.
`,
);

patchI18n();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
