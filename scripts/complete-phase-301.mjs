#!/usr/bin/env node
/** ABOS Phase 301 — Aipify Trust & Transparency Center */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 301,
  migration: "20261422900000_aipify_trust_transparency_center_engine_phase301.sql",
  slug: "aipify-trust-transparency-center-engine",
  docSlug: "AIPIFY_TRUST_TRANSPARENCY_CENTER",
  ilmFile: "implementation-blueprint-phase301-aipify-trust-transparency-center.txt",
  route: "/app/governance/trust-transparency",
  permKeys: ["trust_transparency.view", "trust_transparency.manage", "trust_transparency.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Trust Center",
    subtitle:
      "Complete visibility into how Aipify operates, what it recommends, and how trust is maintained.",
    loading: "Loading Trust Center…",
    corePrinciple: "Core principle",
    visionTitle: "Vision",
    governanceLink: "Governance Center →",
    governanceTrustLink: "Governance trust scores →",
    approvalCenterLink: "Approval Center →",
    permissionsAccessLink: "Permissions & Access →",
    dashboardTitle: "Trust dashboard",
    trustIndicatorsTitle: "Trust indicators",
    sections: {
      activity: "Aipify activity overview",
      decision: "Decision explanations",
      permission: "Permissions used",
      approval: "Approval history",
      selfHealing: "Self-healing activity",
      recommendation: "Recommendations generated",
      audit: "Audit & governance logs",
    },
    emptySection: "Nothing to show in this section yet.",
    emptyRecommendations: "No open recommendations.",
    action: "Action",
    why: "Why",
    permissionsUsed: "Permissions used",
    riskLevel: "Risk level",
    userControl: "Your control",
    infoConsidered: "Information considered",
    alternatives: "Alternatives",
    ifNothingDone: "If nothing is done",
    companion: "Companion",
    approvalRequired: "Approval required",
    outcome: "Outcome",
    whatFailed: "What failed",
    aipifyAttempt: "What Aipify attempted",
    recoverySucceeded: "Recovery succeeded",
    recoveryFailed: "Recovery needs review",
    downtimePrevented: "Estimated downtime prevented",
    manualReview: "Administrator review recommended",
    governanceRecommendationsTitle: "Aipify recommendations",
    dismiss: "Dismiss",
    requestReview: "Request human review",
    disableCategory: "Disable category",
    riskLevels: {
      low: "Low",
      moderate: "Moderate",
      elevated: "Elevated",
      high: "High",
    },
    eventTypes: {
      recommendation_issued: "Recommendation issued",
      approval_completed: "Approval completed",
      action_executed: "Action executed",
      self_healing: "Self-healing",
      permission_request: "Permission request",
      governance_override: "Governance override",
      view_center: "Center viewed",
    },
    metrics: {
      actionsMonth: "Actions this month",
      recommendations: "Recommendations generated",
      approved: "Actions approved",
      rejected: "Actions rejected",
      selfHealing: "Self-healing interventions",
      compliance: "Governance compliance",
    },
    indicators: {
      governance: "Governance score",
      permissionHygiene: "Permission hygiene",
      approvalResponsiveness: "Approval responsiveness",
      transparency: "Transparency completeness",
      selfHealing: "Self-healing effectiveness",
    },
    privacyNote: "Privacy",
    settingsLink: "Trust & Transparency",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Tillitssenter", settingsLink: "Tillit og transparens" }],
    ["sv", { ...i18nBlock(), title: "Förtroendecenter", settingsLink: "Förtroende och transparens" }],
    ["da", { ...i18nBlock(), title: "Tillidscenter", settingsLink: "Tillid og gennemsigtighed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.trustTransparency = block;
    data.nav = data.nav ?? {};
    data.nav.trustTransparencyEngine = block.settingsLink;
    data.governance = data.governance ?? {};
    data.governance.trustTransparencyLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"permission_access.view",', `"permission_access.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("trustTransparencyEngine")) {
    c = c.replace(
      '| "permissionAccessGovernanceEngine"',
      '| "trustTransparencyEngine"\n  | "permissionAccessGovernanceEngine"',
    );
    c = c.replace(
      `{
    id: "permissionAccessGovernanceEngine",
    href: "/app/governance/permissions-access",
    labelKey: "customerApp.nav.permissionAccessGovernanceEngine",
  },`,
      `{
    id: "trustTransparencyEngine",
    href: "/app/governance/trust-transparency",
    labelKey: "customerApp.nav.trustTransparencyEngine",
  },
  {
    id: "permissionAccessGovernanceEngine",
    href: "/app/governance/permissions-access",
    labelKey: "customerApp.nav.permissionAccessGovernanceEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/governance/permissions-access")) return "permissionAccessGovernanceEngine";',
      'if (pathname.startsWith("/app/governance/trust-transparency")) return "trustTransparencyEngine";\n  if (pathname.startsWith("/app/governance/permissions-access")) return "permissionAccessGovernanceEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-trust-transparency-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Trust & Transparency Center\nRoute: ${P.route}\nCore: People trust what they understand.\nHelpers: _ttc_* · _ttcbp301_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "People trust what they understand. Aipify should never operate like a black box.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase300-vocabulary";',
      `export * from "./implementation-blueprint-phase300-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE300_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase300-aipify-permission-access-governance.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE300_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase300-aipify-permission-access-governance.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Trust & Transparency Center (Phase ${P.phase}):** See [AIPIFY_TRUST_TRANSPARENCY_CENTER_PHASE${P.phase}.md](./AIPIFY_TRUST_TRANSPARENCY_CENTER_PHASE${P.phase}.md) — Trust Center at Governance Center → Trust & Transparency. Seven sections: activity, decisions, permissions used, approvals, self-healing, recommendations, audit timeline; trust indicators and executive reporting. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ttc_*\`, \`_ttcbp301_*\`. APIs at \`/api/trust-transparency/*\`. Cross-links \`/app/governance/trust\` (TACC) — does not modify core governance trust RPCs.`;
  if (!c.includes("Trust & Transparency Center")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_TRUST_TRANSPARENCY_CENTER_PHASE${P.phase}.md`),
  `# Aipify Trust & Transparency Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
);
write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Blueprint Phase ${P.phase}\n`,
);
write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# FAQ Phase ${P.phase}\n`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
