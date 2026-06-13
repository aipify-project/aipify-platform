#!/usr/bin/env node
/** ABOS Phase 295 — Aipify Companion Approval Profiles Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 295,
  migration: "20261422300000_aipify_companion_approval_profiles_engine_phase295.sql",
  slug: "aipify-companion-approval-profiles-engine",
  docSlug: "AIPIFY_COMPANION_APPROVAL_PROFILES_ENGINE",
  ilmFile: "implementation-blueprint-phase295-aipify-companion-approval-profiles-engine.txt",
  route: "/app/governance/approval-profiles",
  permKeys: [
    "approval_profile.view",
    "approval_profile.manage",
    "approval_profile.record",
    "approval_profile.delete",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Approval Profiles",
    subtitle:
      "Define reusable approval profiles that simplify recurring decisions while preserving governance and human oversight.",
    loading: "Loading Approval Profiles Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Approval philosophy",
    visionTitle: "Vision",
    activeTitle: "Active profiles",
    reviewsTitle: "Pending reviews",
    recommendationsTitle: "Profile recommendations",
    activityTitle: "Approval activity",
    savingsTitle: "Time saved through profiles",
    governanceTitle: "Governance indicators",
    accept: "Create profile",
    dismiss: "Dismiss",
    disable: "Disable profile",
    delete: "Delete profile",
    completeReview: "Mark review complete",
    privacyNote: "Manual override always available — meaningful control preserved.",
    approvalsLink: "Approval Center →",
    actionMemoryLink: "Action Memory →",
    governanceLink: "Governance Center →",
    profileTypes: {
      personal: "Personal profile",
      business: "Business profile",
      executive: "Executive profile",
      department: "Department profile",
    },
    approvalModes: {
      always_ask: "Always ask",
      simplified: "Simplified approval",
      rule_based: "Rule-based approval",
    },
    reviewStates: {
      current: "Current",
      needs_review: "Needs review",
      suspended: "Suspended",
      expired: "Expired",
    },
    settingsLink: "Approval Profiles",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Godkjenningsprofiler", settingsLink: "Godkjenningsprofiler" };
  const svBlock = { ...i18nBlock(), title: "Godkännandeprofiler", settingsLink: "Godkännandeprofiler" };
  const daBlock = { ...i18nBlock(), title: "Godkendelsesprofiler", settingsLink: "Godkendelsesprofiler" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.approvalProfiles = block;
    data.nav = data.nav ?? {};
    data.nav.approvalProfilesEngine = block.settingsLink;
    data.governance = data.governance ?? {};
    data.governance.approvalProfilesLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"companion_action_memory.view",', `"companion_action_memory.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("approvalProfilesEngine")) {
    c = c.replace('| "governance"', '| "approvalProfilesEngine"\n  | "governance"');
    c = c.replace(
      `{ id: "governance", href: "/app/governance", labelKey: "customerApp.nav.governance" },`,
      `{
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "customerApp.nav.approvalProfilesEngine",
  },
  { id: "governance", href: "/app/governance", labelKey: "customerApp.nav.governance" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/governance")) {\n    return "governance";',
      'if (pathname.startsWith("/app/governance/approval-profiles")) return "approvalProfilesEngine";\n  if (pathname.startsWith("/app/governance")) {\n    return "governance";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-approval-profiles-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Approval Profiles Engine
Route: ${P.route}
Module: Approval Profiles Center
Location: Governance Center → Approval Profiles

Core principle: Make approvals easier without removing meaningful control.
Philosophy: Recognize approved preferences — reserve human attention for what matters.
Profile types: Personal · Business · Executive · Department
Modes: Always ask · Simplified · Rule-based (within limits)
Review states: Current · Needs review · Suspended · Expired
Manual override always available. RBAC, revocation, audit, escalation.
Helpers: _cap_* · _capbp295_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Make approvals easier without removing meaningful control — reserve attention for what matters.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase294-vocabulary";',
      `export * from "./implementation-blueprint-phase294-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE294_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase294-aipify-companion-action-memory-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE294_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase294-aipify-companion-action-memory-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Approval Profiles Engine (Phase 295):** See [AIPIFY_COMPANION_APPROVAL_PROFILES_ENGINE_PHASE295.md](./AIPIFY_COMPANION_APPROVAL_PROFILES_ENGINE_PHASE295.md) — Approval Profiles Center at Governance Center → Approval Profiles. Reusable approval profiles, modes, review states, time savings metrics. Integrates conceptually with Trust & Action — does not modify core approval RPCs. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cap_*\`, \`_capbp295_*\`. APIs at \`/api/approval-profiles/*\`. Permissions \`approval_profile.view\`, \`.manage\`, \`.record\`, \`.delete\`.`;
  if (!c.includes("Phase 295")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_APPROVAL_PROFILES_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Approval Profiles Engine — Phase ${P.phase}

## Purpose

Define reusable approval profiles that simplify recurring decisions while preserving governance and human oversight.

## Route

\`${P.route}\` (Governance Center → Approval Profiles)

## Core principle

Make approvals easier without removing meaningful control.

## Helpers

\`_cap_*\` · \`_capbp295_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Approval Profiles Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Approval Profiles — FAQ (Phase ${P.phase})

## What are Approval Profiles?

Reusable rules for recurring low-risk approvals — always ask, simplified, or rule-based within defined limits.

## Where is it?

Governance Center → Approval Profiles at \`${P.route}\`.

## Can users override profile-based approvals?

Yes. Manual override is always available.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
