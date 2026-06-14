#!/usr/bin/env node
/** ABOS Phase 314 — Aipify Change Management Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 314,
  migration: "20261424200000_aipify_change_management_center_engine_phase314.sql",
  slug: "aipify-change-management-center-engine",
  docSlug: "AIPIFY_CHANGE_MANAGEMENT_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase314-aipify-change-management-center.txt",
  route: "/app/executive/change-management",
  permKeys: ["change_management.view", "change_management.manage", "change_management.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Change Management Center",
    subtitle:
      "Plan, communicate, and sustain change initiatives — adoption-focused support with empathy, clarity, and operational excellence.",
    loading: "Loading Change Management Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Change philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalHealthLink: "Organizational Health →",
    continuousImprovementLink: "Continuous Improvement →",
    organizationalResilienceLink: "Organizational Resilience →",
    decisionSupportLink: "Decision Support →",
    dashboardTitle: "Change dashboard",
    initiativesTitle: "Active initiatives",
    stakeholdersTitle: "Stakeholders",
    communicationsTitle: "Communication center",
    trainingTitle: "Training coordination",
    adoptionTitle: "Adoption analytics",
    feedbackTitle: "Feedback",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive change view",
    reviewsTitle: "Change reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    advanceWorkflow: "Advance workflow",
    sendCommunication: "Send communication",
    completeTraining: "Mark training complete",
    reviewFeedback: "Mark reviewed",
    completeReview: "Complete review",
    generatePlan: "Generate communication plan",
    generateReport: "Generate adoption report",
    humansDecide: "Aipify supports adoption — leadership owns change decisions and never forces compliance.",
    privacyNote: "Privacy",
    readinessBands: {
      ready: "Ready",
      mostly_ready: "Mostly ready",
      attention_needed: "Attention needed",
      not_ready: "Not ready",
    },
    changeCategories: {
      technology: "Technology change",
      process: "Process change",
      organizational: "Organizational change",
      cultural: "Cultural change",
      strategic: "Strategic change",
    },
    workflowStages: {
      identified: "Change identified",
      business_case: "Business case developed",
      stakeholders_mapped: "Stakeholders mapped",
      communication_planned: "Communication planned",
      training_coordinated: "Training coordinated",
      implementation_executed: "Implementation executed",
      adoption_measured: "Adoption measured",
      lessons_captured: "Lessons learned captured",
    },
    stakeholderRoles: {
      sponsor: "Sponsor",
      leader: "Leader",
      champion: "Change champion",
      impacted_employee: "Impacted employee",
      external: "External stakeholder",
    },
    communicationAudiences: {
      executive: "Executive announcement",
      team: "Team update",
      faq: "FAQ",
      progress: "Progress summary",
      reinforcement: "Reinforcement campaign",
    },
    feedbackTypes: {
      concern: "Concern",
      suggestion: "Suggestion",
      barrier: "Adoption barrier",
      positive: "Positive outcome",
      lesson: "Lesson learned",
    },
    metrics: {
      active: "Active initiatives",
      adoption: "Average adoption",
      readiness: "Readiness score",
      training: "Training completion",
      communications: "Communications sent",
      engagement: "Stakeholder engagement",
      confidence: "Employee confidence",
      success: "Initiative success rate",
    },
    executiveFields: {
      adoption: "Adoption confidence",
      sentiment: "Stakeholder sentiment",
      actions: "Leadership action items",
    },
    settingsLink: "Change Management",
    changeManagementLink: "Change Management",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Endringsledelsessenter", settingsLink: "Endringsledelse" }],
    ["sv", { ...i18nBlock(), title: "Förändringsledningscenter", settingsLink: "Förändringsledning" }],
    ["da", { ...i18nBlock(), title: "Forandringsledelsescenter", settingsLink: "Forandringsledelse" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.changeManagementCenter = block;
    data.nav = data.nav ?? {};
    data.nav.changeManagementCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.changeManagementLink = block.changeManagementLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"incident_command.view",', `"incident_command.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("changeManagementCenterEngine")) {
    c = c.replace(
      '| "organizationalHealthCenterEngine"',
      '| "changeManagementCenterEngine"\n  | "organizationalHealthCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalHealthCenterEngine", href: "/app/executive/organizational-health", labelKey: "customerApp.nav.organizationalHealthCenterEngine" },',
      `{ id: "changeManagementCenterEngine", href: "/app/executive/change-management", labelKey: "customerApp.nav.changeManagementCenterEngine" },
  { id: "organizationalHealthCenterEngine", href: "/app/executive/organizational-health", labelKey: "customerApp.nav.organizationalHealthCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-health")) return "organizationalHealthCenterEngine";',
      'if (pathname.startsWith("/app/executive/change-management")) return "changeManagementCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-health")) return "organizationalHealthCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-change-management-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("changeManagementLink")) {
    c = c.replace(
      "organizationalHealthLink: string;",
      "organizationalHealthLink: string;\n    changeManagementLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-health" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHealthLink}
        </Link>`,
      `<Link href="/app/executive/organizational-health" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHealthLink}
        </Link>
        <Link href="/app/executive/change-management" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.changeManagementLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("changeManagementLink")) {
    p = p.replace(
      'organizationalHealthLink: t("customerApp.executive.organizationalHealthLink"),',
      'organizationalHealthLink: t("customerApp.executive.organizationalHealthLink"),\n        changeManagementLink: t("customerApp.executive.changeManagementLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Change Management Center\nRoute: ${P.route}\nCore: Technology changes quickly. People adapt gradually.\nHelpers: _cmg_* · _cmgbp314_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Technology changes quickly. People adapt gradually. Aipify should help organizations manage both.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase313-vocabulary";',
      `export * from "./implementation-blueprint-phase313-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE313_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase313-aipify-incident-command-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE313_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase313-aipify-incident-command-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Change Management Engine (Phase ${P.phase}):** See [AIPIFY_CHANGE_MANAGEMENT_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_CHANGE_MANAGEMENT_CENTER_ENGINE_PHASE${P.phase}.md) — Change Management Center at Executive Center → Change Management. Initiative workflow, stakeholder mapping, communications, training coordination, adoption analytics, and feedback. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cmg_*\`, \`_cmgbp314_*\`. APIs at \`/api/change-management/*\`. Cross-links executive centers — does not modify their RPCs.`;
  if (!c.includes("Change Management Engine (Phase 314)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_CHANGE_MANAGEMENT_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Change Management Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchExecutiveDashboard();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
