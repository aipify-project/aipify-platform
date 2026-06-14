#!/usr/bin/env node
/** ABOS Phase 315 — Aipify Organizational Digital Twin Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 315,
  migration: "20261424300000_aipify_organizational_digital_twin_center_engine_phase315.sql",
  slug: "aipify-organizational-digital-twin-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_DIGITAL_TWIN_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase315-aipify-organizational-digital-twin-center.txt",
  route: "/app/executive/organizational-digital-twin",
  permKeys: ["org_digital_twin.view", "org_digital_twin.manage", "org_digital_twin.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Digital Twin",
    subtitle:
      "A living operational representation of structure, workflows, automations, systems, and knowledge — for understanding, not surveillance.",
    loading: "Loading Organizational Digital Twin…",
    corePrinciple: "Core principle",
    philosophyTitle: "Digital Twin philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    digitalTwinEngineLink: "Digital Twin Engine →",
    changeManagementLink: "Change Management →",
    organizationalHealthLink: "Organizational Health →",
    simulationsLink: "Simulations →",
    dashboardTitle: "Digital Twin dashboard",
    domainsTitle: "Structural domains",
    nodesTitle: "Structural nodes",
    relationshipsTitle: "Relationship map",
    dependenciesTitle: "Critical dependencies",
    visualizationsTitle: "Visualizations",
    impactTitle: "Impact analysis",
    snapshotsTitle: "Organizational snapshots",
    comparisonsTitle: "Change comparison",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive view",
    reviewsTitle: "Governance reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    captureSnapshot: "Capture snapshot",
    completeReview: "Complete review",
    generateSummary: "Generate executive summary",
    exportMap: "Export dependency map",
    generateDiagram: "Generate workflow diagram",
    humansDecide: "Aipify visualizes reality — leaders decide what to change.",
    privacyNote: "Privacy",
    domains: {
      organizational: "Organizational structure",
      workflow: "Workflow structure",
      automation: "Automation structure",
      technology: "Technology structure",
      knowledge: "Knowledge structure",
    },
    nodeTypes: {
      department: "Department",
      team: "Team",
      workflow: "Workflow",
      automation: "Automation",
      integration: "Integration",
      knowledge: "Knowledge asset",
    },
    relationshipTypes: {
      handoff: "Workflow handoff",
      approval: "Approval dependency",
      dependency: "System dependency",
      knowledge: "Knowledge dependency",
      system: "System relationship",
    },
    vizTypes: {
      org_map: "Organization map",
      workflow_diagram: "Workflow diagram",
      dependency_network: "Dependency network",
      escalation_structure: "Escalation structure",
      automation_map: "Automation map",
    },
    riskLevels: {
      low: "Low risk",
      medium: "Medium risk",
      high: "High risk",
      critical: "Critical risk",
    },
    metrics: {
      nodes: "Structural nodes",
      relationships: "Relationships mapped",
      dependencies: "Critical dependencies",
      workflowHealth: "Workflow health",
      automation: "Automation coverage",
      knowledge: "Knowledge distribution",
      maturity: "Workflow maturity",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      complexity: "Complexity indicators",
      risks: "Dependency risks",
      maturity: "Workflow maturity",
      opportunities: "Structural opportunities",
      priorities: "Executive priorities",
    },
    settingsLink: "Organizational Digital Twin",
    organizationalDigitalTwinLink: "Organizational Digital Twin",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonens digitale tvilling", settingsLink: "Organisasjonens digitale tvilling" }],
    ["sv", { ...i18nBlock(), title: "Organisationens digitala tvilling", settingsLink: "Organisationens digitala tvilling" }],
    ["da", { ...i18nBlock(), title: "Organisationens digitale tvilling", settingsLink: "Organisationens digitale tvilling" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalDigitalTwinCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalDigitalTwinCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalDigitalTwinLink = block.organizationalDigitalTwinLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"change_management.view",', `"change_management.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalDigitalTwinCenterEngine")) {
    c = c.replace(
      '| "changeManagementCenterEngine"',
      '| "organizationalDigitalTwinCenterEngine"\n  | "changeManagementCenterEngine"',
    );
    c = c.replace(
      '{ id: "changeManagementCenterEngine", href: "/app/executive/change-management", labelKey: "customerApp.nav.changeManagementCenterEngine" },',
      `{ id: "organizationalDigitalTwinCenterEngine", href: "/app/executive/organizational-digital-twin", labelKey: "customerApp.nav.organizationalDigitalTwinCenterEngine" },
  { id: "changeManagementCenterEngine", href: "/app/executive/change-management", labelKey: "customerApp.nav.changeManagementCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/change-management")) return "changeManagementCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-digital-twin")) return "organizationalDigitalTwinCenterEngine";\n  if (pathname.startsWith("/app/executive/change-management")) return "changeManagementCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-digital-twin-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalDigitalTwinLink")) {
    c = c.replace(
      "changeManagementLink: string;",
      "changeManagementLink: string;\n    organizationalDigitalTwinLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/change-management" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.changeManagementLink}
        </Link>`,
      `<Link href="/app/executive/change-management" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.changeManagementLink}
        </Link>
        <Link href="/app/executive/organizational-digital-twin" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDigitalTwinLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalDigitalTwinLink")) {
    p = p.replace(
      'changeManagementLink: t("customerApp.executive.changeManagementLink"),',
      'changeManagementLink: t("customerApp.executive.changeManagementLink"),\n        organizationalDigitalTwinLink: t("customerApp.executive.organizationalDigitalTwinLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Digital Twin Center\nRoute: ${P.route}\nCore: Leaders should not have to guess how their organizations function.\nHelpers: _dtc_* · _dtcbp315_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Leaders should not have to guess how their organizations function. Aipify should help visualize reality.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase314-vocabulary";',
      `export * from "./implementation-blueprint-phase314-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE314_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase314-aipify-change-management-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE314_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase314-aipify-change-management-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Digital Twin Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_DIGITAL_TWIN_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_DIGITAL_TWIN_CENTER_ENGINE_PHASE${P.phase}.md) — Digital Twin Center at Executive Center → Organizational Digital Twin. Structural domains, dependency maps, impact analysis, snapshots, and change comparison. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_dtc_*\`, \`_dtcbp315_*\`. APIs at \`/api/organizational-digital-twin/*\`. Cross-links legacy Digital Twin Engine — does not modify its RPCs.`;
  if (!c.includes("Organizational Digital Twin Center Engine (Phase 315)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_DIGITAL_TWIN_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Digital Twin Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
