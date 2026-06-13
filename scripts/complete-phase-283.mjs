#!/usr/bin/env node
/** ABOS Phase 283 — Universal Action Access Framework (FOUNDATIONAL) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 283,
  migration: "20261421100000_universal_action_access_framework_phase283.sql",
  slug: "universal-action-access-framework",
  docSlug: "UNIVERSAL_ACTION_ACCESS_FRAMEWORK",
  ilmFile: "implementation-blueprint-phase283-universal-action-access-framework.txt",
  route: "/app/settings/action-access",
  permKeys: ["uaaf.view", "uaaf.manage", "uaaf.execute", "uaaf.steward"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Universal Action Access",
    subtitle:
      "Foundational platform principle: Aipify can perform any action it has permission and access to do. Permission first — humans remain accountable.",
    loading: "Loading Universal Action Access…",
    corePrinciple: "Core principle",
    integrationsTitle: "Approved integrations",
    noIntegrations: "No integrations configured yet. Defaults seed on first access.",
    auditTitle: "Action audit trail",
    noAudit: "No action audit entries yet.",
    settingsTitle: "Action access governance",
    enabled: "Action access framework enabled",
    businessHoursOnly: "Restrict actions to business hours",
    emergencyHonored: "Honor emergency stop from Trust & Action",
    saveSettings: "Save settings",
    saved: "Saved",
    settingsLink: "Action access",
    approvalLevels: {
      automatic: "Level 1 — Automatic",
      user_confirmation: "Level 2 — User confirmation",
      multi_step_approval: "Level 3 — Multi-step approval",
    },
    categories: {
      personal: "Personal actions",
      business: "Business actions",
      commerce: "Commerce actions",
      workforce: "Workforce actions",
      device: "Device actions",
      future: "Future integrations",
    },
    links: {
      approvals: "Approval Center →",
      actionCenter: "Action Center →",
      printers: "Print & Output Center →",
    },
    phase283: {
      mission: "Aipify helps people get things done — within permission, governance, and human control.",
      philosophy: "Permission first. Governance by default. Human control. Growth Partner — never Affiliate.",
    },
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Universell handlingsadgang",
    subtitle:
      "Grunnleggende plattformprinsipp: Aipify kan utføre enhver handling den har tillatelse og tilgang til. Tillatelse først — mennesker forblir ansvarlige.",
    loading: "Laster universell handlingsadgang…",
    settingsLink: "Handlingsadgang",
    approvalLevels: {
      automatic: "Nivå 1 — Automatisk",
      user_confirmation: "Nivå 2 — Brukerbekreftelse",
      multi_step_approval: "Nivå 3 — Flertrinnsgodkjenning",
    },
  };
  const svBlock = { ...i18nBlock(), title: "Universell åtkomst till åtgärder", settingsLink: "Åtgärdsåtkomst" };
  const daBlock = { ...i18nBlock(), title: "Universel handlingsadgang", settingsLink: "Handlingsadgang" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.universalActionAccess = block;
    data.settings.links = data.settings.links ?? {};
    data.settings.links.actionAccess = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"print.view",', `"print.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchSettings() {
  const page = path.join(ROOT, "app/app/settings/page.tsx");
  let c = fs.readFileSync(page, "utf8");
  if (!c.includes("actionAccess")) {
    c = c.replace(
      'devicesPrinters: t("customerApp.settings.links.devicesPrinters"),',
      'devicesPrinters: t("customerApp.settings.links.devicesPrinters"),\n          actionAccess: t("customerApp.settings.links.actionAccess"),',
    );
    fs.writeFileSync(page, c);
  }
  const panel = path.join(ROOT, "components/app/settings/CustomerSettingsCenterPanel.tsx");
  let p = fs.readFileSync(panel, "utf8");
  if (!p.includes("actionAccess")) {
    p = p.replace("devicesPrinters: string;", "devicesPrinters: string;\n      actionAccess: string;");
    p = p.replace(
      '<Link href="/app/settings/devices"',
      '<Link href="/app/settings/action-access" className="block text-indigo-600 hover:underline">\n          {labels.links.actionAccess}\n        </Link>\n        <Link href="/app/settings/devices"',
    );
    fs.writeFileSync(panel, p);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Universal Action Access Framework (FOUNDATIONAL)
Route: ${P.route}

Core principle: Aipify can do anything it has permission and access to do.
Rules: permission first, governance by default, human control.
Categories: personal, business, commerce, workforce, device, future.
Approval levels: automatic, user_confirmation, multi_step_approval.
UX offers: print, email, taxi, flowers, calendar prompts en/no.
Philosophy: From "I found the answer." to "I've taken care of it."
Cross-links: Trust & Action /app/approvals, Action Center /app/action-center, Print /app/settings/devices/printers.
Desktop Companion: local execution bridge for device actions.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Aipify can do anything it has permission and access to do.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ACTION_PHILOSOPHY_TO = "I've taken care of it.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase282-vocabulary";',
      `export * from "./implementation-blueprint-phase282-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE282_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase282-aipify-enterprise-printing-document-output.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE282_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase282-aipify-enterprise-printing-document-output.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Universal Action Access Framework (Phase 283 — FOUNDATIONAL):** See [UNIVERSAL_ACTION_ACCESS_FRAMEWORK_PHASE283.md](./UNIVERSAL_ACTION_ACCESS_FRAMEWORK_PHASE283.md) — Core principle: permission first, governance by default, human control. Action categories (personal, business, commerce, workforce, device, future), approval levels (automatic, user confirmation, multi-step), integration access registry, audit trail, Desktop Companion execution bridge. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_uaaf_*\`, \`_uaafbp283_*\`. APIs at \`/api/uaaf/*\`. Permissions \`uaaf.view\`, \`uaaf.manage\`, \`uaaf.execute\`, \`uaaf.steward\`. Cross-links Trust & Action Engine Phase 30, Autonomous Execution Framework Phase 44, Print & Output Phase 282.`;
  if (!c.includes("Phase 283")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `UNIVERSAL_ACTION_ACCESS_FRAMEWORK_PHASE${P.phase}.md`),
  `# Universal Action Access Framework — Phase ${P.phase}

## Core principle

**Aipify can do anything it has permission and access to do.**

## Fundamental rules

1. **Permission first** — No access = No action
2. **Governance by default** — Policies, approvals, audit
3. **Human control** — Humans remain accountable; emergency stop honored

## Route

\`${P.route}\`

## Permissions

\`uaaf.view\` · \`uaaf.manage\` · \`uaaf.execute\` · \`uaaf.steward\`

## Helpers

\`_uaaf_*\` · \`_uaafbp283_*\`

Cross-links: Trust & Action Engine, Action Center, Print & Output Center, Desktop Companion.
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Universal Action Access Framework

FOUNDATIONAL platform capability. Apply across all future modules.
Route: \`${P.route}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Universal Action Access Framework — FAQ (Phase ${P.phase})

## What is the Universal Action Access Framework?

The foundational principle that Aipify can perform approved real-world and digital actions when it has explicit permission, access, and capability.

## Where is it configured?

Settings → Action Access at \`${P.route}\`.

## What are the approval levels?

Level 1 Automatic · Level 2 User confirmation · Level 3 Multi-step approval.

## Does this replace human accountability?

**No.** Humans remain accountable. Aipify executes within approved limits only.
`,
);

write(
  path.join(ROOT, "lib/core/universal-action-access-framework.ts"),
  `export const UNIVERSAL_ACTION_ACCESS_FRAMEWORK_ROUTE = "${P.route}";
export const UNIVERSAL_ACTION_ACCESS_FRAMEWORK_HELPERS = {
  engine: "_uaaf_*",
  blueprint: "_uaafbp283_*",
} as const;
`,
);

patchI18n();
patchPermissions();
patchSettings();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
