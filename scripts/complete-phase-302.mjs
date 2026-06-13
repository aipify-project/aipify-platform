#!/usr/bin/env node
/** ABOS Phase 302 — Aipify Executive Decision Support Center */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 302,
  migration: "20261423000000_aipify_executive_decision_support_engine_phase302.sql",
  slug: "aipify-executive-decision-support-engine",
  docSlug: "AIPIFY_EXECUTIVE_DECISION_SUPPORT",
  ilmFile: "implementation-blueprint-phase302-aipify-executive-decision-support.txt",
  route: "/app/executive/decision-support",
  permKeys: ["executive_decision.view", "executive_decision.manage", "executive_decision.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Decision Center",
    subtitle:
      "Structured decision support — clarify objectives, compare alternatives, and evaluate trade-offs. You decide.",
    loading: "Loading Decision Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Decision philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    assistantDecisionsLink: "Assistant decisions →",
    approvalCenterLink: "Approval Center →",
    dashboardTitle: "Decision dashboard",
    workspaceTitle: "Decision workspace",
    insightsTitle: "Aipify insights",
    stakeholderTitle: "Stakeholder input",
    auditTitle: "Audit timeline",
    decidedTitle: "Recently decided",
    emptyDecisions: "No active decisions in the workspace.",
    emptyInsights: "No open insights.",
    emptyStakeholder: "No stakeholder input yet.",
    owner: "Decision owner",
    stakeholders: "Stakeholders",
    status: "Status",
    category: "Category",
    timeSensitivity: "Time sensitivity",
    deadline: "Deadline",
    framework: "Framework",
    objectives: "Objectives",
    assumptions: "Assumptions",
    alternatives: "Alternatives",
    risks: "Risk indicators",
    outcome: "Outcome",
    advanceStatus: "Advance evaluation",
    markDecided: "Mark decided",
    archive: "Archive",
    dismiss: "Dismiss",
    youDecide: "You remain responsible for every decision — Aipify supports your thinking, not your judgment.",
    categories: {
      personal: "Personal decisions",
      business: "Business decisions",
      executive: "Executive decisions",
      community: "Community decisions",
    },
    states: {
      gathering_info: "Gathering information",
      under_evaluation: "Under evaluation",
      awaiting_approval: "Awaiting approval",
      decided: "Decided",
      archived: "Archived",
    },
    frameworks: {
      pros_cons: "Pros and cons",
      weighted_criteria: "Weighted criteria",
      scenario_analysis: "Scenario analysis",
      risk_review: "Risk review",
    },
    sensitivities: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },
    inputTypes: {
      comment: "Comment",
      rating: "Rating",
      risk_observation: "Risk observation",
      alternative: "Alternative suggestion",
      consensus: "Consensus indicator",
    },
    metrics: {
      active: "Active decisions",
      pendingEval: "Pending evaluations",
      awaitingApproval: "Awaiting approval",
      stakeholderInputs: "Stakeholder inputs",
      highSensitivity: "High sensitivity",
      decided: "Decided",
      frameworkAdoption: "Framework adoption",
      confidence: "Avg. confidence",
    },
    privacyNote: "Privacy",
    settingsLink: "Decision Support",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Beslutningssenter", settingsLink: "Beslutningsstøtte" }],
    ["sv", { ...i18nBlock(), title: "Beslutscenter", settingsLink: "Beslutsstöd" }],
    ["da", { ...i18nBlock(), title: "Beslutningscenter", settingsLink: "Beslutningsstøtte" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.executiveDecisionSupport = block;
    data.nav = data.nav ?? {};
    data.nav.executiveDecisionSupportEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.decisionSupportLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"trust_transparency.view",', `"trust_transparency.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("executiveDecisionSupportEngine")) {
    c = c.replace('| "executive"', '| "executiveDecisionSupportEngine"\n  | "executive"');
    c = c.replace(
      `{ id: "executive", href: "/app/executive", labelKey: "customerApp.nav.executive" },`,
      `{ id: "executiveDecisionSupportEngine", href: "/app/executive/decision-support", labelKey: "customerApp.nav.executiveDecisionSupportEngine" },
  { id: "executive", href: "/app/executive", labelKey: "customerApp.nav.executive" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive")) return "executive";',
      'if (pathname.startsWith("/app/executive/decision-support")) return "executiveDecisionSupportEngine";\n  if (pathname.startsWith("/app/executive")) return "executive";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-executive-decision-support-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Executive Decision Support Center\nRoute: ${P.route}\nCore: Humans remain responsible for decisions.\nHelpers: _dsc_* · _dscbp302_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Aipify should improve decision quality. Humans remain responsible for decisions.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase301-vocabulary";',
      `export * from "./implementation-blueprint-phase301-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE301_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase301-aipify-trust-transparency-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE301_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase301-aipify-trust-transparency-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Executive Decision Support Center (Phase ${P.phase}):** See [AIPIFY_EXECUTIVE_DECISION_SUPPORT_PHASE${P.phase}.md](./AIPIFY_EXECUTIVE_DECISION_SUPPORT_PHASE${P.phase}.md) — Decision Center at Executive Center → Decision Support. Decision workspace, frameworks (pros/cons, weighted criteria, scenarios, risk review), Aipify insights, stakeholder input, audit timeline. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_dsc_*\`, \`_dscbp302_*\`. APIs at \`/api/executive-decision-support/*\`. Cross-links \`/app/assistant/decisions\` — does not modify core DSE \`_dse_*\` RPCs.`;
  if (!c.includes("Executive Decision Support Center")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_EXECUTIVE_DECISION_SUPPORT_PHASE${P.phase}.md`),
  `# Aipify Executive Decision Support Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
