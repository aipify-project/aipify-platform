#!/usr/bin/env node
/** ABOS Phase 299 — Aipify Approval & Human Oversight Center */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 299,
  migration: "20261422700000_aipify_approval_human_oversight_center_engine_phase299.sql",
  slug: "aipify-approval-human-oversight-center-engine",
  docSlug: "AIPIFY_APPROVAL_HUMAN_OVERSIGHT_CENTER",
  ilmFile: "implementation-blueprint-phase299-aipify-approval-human-oversight-center.txt",
  route: "/app/governance/approval-center",
  permKeys: ["approval_oversight.view", "approval_oversight.manage", "approval_oversight.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Approval Center",
    subtitle:
      "Review, approve, reject, delegate, and monitor actions proposed by Aipify before execution.",
    loading: "Loading Approval Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Approval philosophy",
    visionTitle: "Vision",
    governanceLink: "Governance Center →",
    trustApprovalsLink: "Trust & Action Approvals →",
    approvalProfilesLink: "Approval Profiles →",
    dashboardTitle: "Approval dashboard",
    pendingTitle: "Pending approvals",
    completedTitle: "Recently completed",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive reporting",
    emptyPending: "No pending approvals right now.",
    emptyRecommendations: "No open recommendations.",
    whyAipifyRecommends: "Why Aipify recommends this",
    riskLevel: "Risk level",
    businessImpact: "Business impact",
    financialImpact: "Financial impact",
    ifApproved: "If approved",
    ifRejected: "If rejected",
    risks: "Risks",
    approve: "Approve",
    reject: "Reject",
    delegate: "Delegate",
    requestInfo: "Request more information",
    snooze: "Snooze",
    dismiss: "Dismiss",
    delegatedTo: "Delegated to",
    categories: {
      personal: "Personal actions",
      business: "Business actions",
      financial: "Financial actions",
      technical: "Technical actions",
      executive: "Executive actions",
    },
    riskLevels: {
      low: "Low",
      moderate: "Moderate",
      elevated: "Elevated",
      high: "High",
    },
    priorities: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },
    metrics: {
      pending: "Pending",
      highPriority: "High priority",
      delegated: "Delegated",
      completed7d: "Completed (7d)",
      avgResponse: "Avg. response time",
      compliance: "Governance compliance",
    },
    privacyNote: "Privacy",
    settingsLink: "Approval Center",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Godkjenningssenter", settingsLink: "Godkjenningssenter" }],
    ["sv", { ...i18nBlock(), title: "Godkännandecenter", settingsLink: "Godkännandecenter" }],
    ["da", { ...i18nBlock(), title: "Godkendelsescenter", settingsLink: "Godkendelsescenter" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.approvalHumanOversight = block;
    data.nav = data.nav ?? {};
    data.nav.approvalHumanOversightEngine = block.settingsLink;
    data.governance = data.governance ?? {};
    data.governance.approvalCenterLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"automation_control.view",', `"automation_control.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("approvalHumanOversightEngine")) {
    c = c.replace(
      '| "approvalProfilesEngine"',
      '| "approvalHumanOversightEngine"\n  | "approvalProfilesEngine"',
    );
    c = c.replace(
      `{
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "customerApp.nav.approvalProfilesEngine",
  },`,
      `{
    id: "approvalHumanOversightEngine",
    href: "/app/governance/approval-center",
    labelKey: "customerApp.nav.approvalHumanOversightEngine",
  },
  {
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "customerApp.nav.approvalProfilesEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/governance/approval-profiles")) return "approvalProfilesEngine";',
      'if (pathname.startsWith("/app/governance/approval-center")) return "approvalHumanOversightEngine";\n  if (pathname.startsWith("/app/governance/approval-profiles")) return "approvalProfilesEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-approval-human-oversight-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Approval & Human Oversight Center\nRoute: ${P.route}\nCore: Aipify may recommend — humans decide.\nHelpers: _aohoc_* · _aohocbp299_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Aipify may recommend. Humans remain responsible for important decisions.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase298-vocabulary";',
      `export * from "./implementation-blueprint-phase298-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE298_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase298-aipify-automation-control-center-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE298_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase298-aipify-automation-control-center-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Approval & Human Oversight Center (Phase ${P.phase}):** See [AIPIFY_APPROVAL_HUMAN_OVERSIGHT_CENTER_PHASE${P.phase}.md](./AIPIFY_APPROVAL_HUMAN_OVERSIGHT_CENTER_PHASE${P.phase}.md) — Approval Center at Governance Center → Approval Center. Pending approvals, delegation, snooze, escalation metadata, Aipify explanations, history, and executive reporting. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_aohoc_*\`, \`_aohocbp299_*\`. APIs at \`/api/approval-human-oversight/*\`. Cross-links \`/app/approvals\` — does not modify core Trust & Action RPCs.`;
  if (!c.includes("Approval & Human Oversight Center")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(path.join(ROOT, `AIPIFY_APPROVAL_HUMAN_OVERSIGHT_CENTER_PHASE${P.phase}.md`), `# Aipify Approval & Human Oversight Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`);
write(path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`), `# Blueprint Phase ${P.phase}\n`);
write(path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`), `# FAQ Phase ${P.phase}\n`);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
