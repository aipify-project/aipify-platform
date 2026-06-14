#!/usr/bin/env node
/** ABOS Phase 313 — Aipify Incident Command & Recovery Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 313,
  migration: "20261424100000_aipify_incident_command_recovery_engine_phase313.sql",
  slug: "aipify-incident-command-recovery-engine",
  docSlug: "AIPIFY_INCIDENT_COMMAND_RECOVERY_ENGINE",
  ilmFile: "implementation-blueprint-phase313-aipify-incident-command-center.txt",
  route: "/app/operations/incident-command",
  permKeys: ["incident_command.view", "incident_command.manage", "incident_command.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Incident Command Center",
    subtitle:
      "Coordinate, monitor, and accelerate incident resolution — clarity, speed, and confidence during operational disruptions.",
    loading: "Loading Incident Command Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Incident philosophy",
    visionTitle: "Vision",
    operationsLink: "Operations Center →",
    observabilityLink: "Platform Observability →",
    deploymentsLink: "Deployments →",
    automationControlLink: "Automation Control →",
    executiveLink: "Executive Center →",
    dashboardTitle: "Incident dashboard",
    incidentsTitle: "Active incidents",
    timelineTitle: "Incident timeline",
    communicationsTitle: "Incident communications",
    recoveryTitle: "Recovery actions",
    selfHealingTitle: "Self-healing activity",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    postReviewsTitle: "Post-incident reviews",
    executiveTitle: "Executive incident view",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    advanceStatus: "Advance status",
    completeAction: "Mark complete",
    sendCommunication: "Send communication",
    completeReview: "Complete review",
    closeIncident: "Close incident",
    generateReport: "Generate incident report",
    generateSummary: "Generate executive summary",
    humansDecide: "Aipify coordinates and informs — your team owns the response and recovery decisions.",
    privacyNote: "Privacy",
    severityLevels: {
      sev1: "SEV-1 Critical",
      sev2: "SEV-2 High",
      sev3: "SEV-3 Moderate",
      sev4: "SEV-4 Low",
      sev5: "SEV-5 Informational",
    },
    incidentCategories: {
      technical: "Technical",
      customer: "Customer",
      security: "Security",
      operational: "Operational",
      executive: "Executive",
    },
    incidentStatuses: {
      investigating: "Investigating",
      identified: "Identified",
      mitigating: "Mitigating",
      monitoring: "Monitoring",
      resolved: "Resolved",
      closed: "Closed",
    },
    communicationAudiences: {
      internal: "Internal update",
      executive: "Executive summary",
      customer: "Customer-facing",
      team: "Team notification",
    },
    healingOutcomes: {
      success: "Successful recovery",
      failed: "Recovery failed",
      escalated: "Manual escalation recommended",
    },
    metrics: {
      active: "Active incidents",
      major: "Major incidents",
      mttr: "Mean time to recovery",
      recoveryProgress: "Recovery progress",
      selfHealing: "Self-healing success rate",
      detection: "Mean time to detection",
      acknowledgment: "Mean time to acknowledgment",
      resilience: "Operational resilience score",
    },
    executiveFields: {
      major: "Active major incidents",
      impact: "Business impact summary",
      confidence: "Recovery confidence",
      strategy: "Strategic implication",
    },
    reviewFields: {
      what: "What happened",
      causes: "Root causes identified",
      recovery: "Recovery effectiveness",
      lessons: "Lessons learned",
      improvements: "Improvements required",
    },
    settingsLink: "Incident Command",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Incident Command-senter", settingsLink: "Incident Command" }],
    ["sv", { ...i18nBlock(), title: "Incident Command-center", settingsLink: "Incident Command" }],
    ["da", { ...i18nBlock(), title: "Incident Command-center", settingsLink: "Incident Command" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.incidentCommandCenter = block;
    data.nav = data.nav ?? {};
    data.nav.incidentCommandCenterEngine = block.settingsLink;
    data.operationsCenter = data.operationsCenter ?? {};
    data.operationsCenter.incidentCommandLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"platform_observability.view",', `"platform_observability.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("incidentCommandCenterEngine")) {
    c = c.replace(
      '| "platformObservabilityCenterEngine"',
      '| "incidentCommandCenterEngine"\n  | "platformObservabilityCenterEngine"',
    );
    c = c.replace(
      `{
    id: "platformObservabilityCenterEngine",
    href: "/app/operations/platform-observability",
    labelKey: "customerApp.nav.platformObservabilityCenterEngine",
  },`,
      `{
    id: "incidentCommandCenterEngine",
    href: "/app/operations/incident-command",
    labelKey: "customerApp.nav.incidentCommandCenterEngine",
  },
  {
    id: "platformObservabilityCenterEngine",
    href: "/app/operations/platform-observability",
    labelKey: "customerApp.nav.platformObservabilityCenterEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/operations/platform-observability")) return "platformObservabilityCenterEngine";',
      'if (pathname.startsWith("/app/operations/incident-command")) return "incidentCommandCenterEngine";\n  if (pathname.startsWith("/app/operations/platform-observability")) return "platformObservabilityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-incident-command-recovery-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchOperationsPage() {
  const page = path.join(ROOT, "app/app/operations/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("incident-command")) {
    p = p.replace(
      `{t(\`\${p}.platformObservabilityLink\`)} →
        </Link>`,
      `{t(\`\${p}.platformObservabilityLink\`)} →
        </Link>
        <Link
          href="/app/operations/incident-command"
          className="ml-4 mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(\`\${p}.incidentCommandLink\`)} →
        </Link>`,
    );
    fs.writeFileSync(page, p);
    console.log("patched operations page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Incident Command Center\nRoute: ${P.route}\nCore: Incidents are inevitable. Chaos is optional.\nHelpers: _icr_* · _icrbp313_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Incidents are inevitable. Chaos is optional. Aipify should help organizations respond with clarity, speed, and confidence.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase312-vocabulary";',
      `export * from "./implementation-blueprint-phase312-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE312_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase312-aipify-platform-observability-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE312_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase312-aipify-platform-observability-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Incident Command & Recovery Engine (Phase ${P.phase}):** See [AIPIFY_INCIDENT_COMMAND_RECOVERY_ENGINE_PHASE${P.phase}.md](./AIPIFY_INCIDENT_COMMAND_RECOVERY_ENGINE_PHASE${P.phase}.md) — Incident Command Center at Operations Center → Incident Command. Incident coordination, severity workflow, communications, self-healing integration, and post-incident reviews. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_icr_*\`, \`_icrbp313_*\`. APIs at \`/api/incident-command/*\`. Cross-links observability and deployments — does not modify their RPCs.`;
  if (!c.includes("Incident Command & Recovery Engine (Phase 313)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_INCIDENT_COMMAND_RECOVERY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Incident Command & Recovery Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchOperationsPage();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
