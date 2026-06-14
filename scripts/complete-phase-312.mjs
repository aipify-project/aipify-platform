#!/usr/bin/env node
/** ABOS Phase 312 — Aipify Platform Observability Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 312,
  migration: "20261424000000_aipify_platform_observability_engine_phase312.sql",
  slug: "aipify-platform-observability-engine",
  docSlug: "AIPIFY_PLATFORM_OBSERVABILITY_ENGINE",
  ilmFile: "implementation-blueprint-phase312-aipify-platform-observability-center.txt",
  route: "/app/operations/platform-observability",
  permKeys: ["platform_observability.view", "platform_observability.manage", "platform_observability.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Observability Center",
    subtitle:
      "Real-time platform visibility — system performance, user experience, integrations, automations, and operational health explained with confidence.",
    loading: "Loading Observability Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Observability philosophy",
    visionTitle: "Vision",
    operationsLink: "Operations Center →",
    deploymentsLink: "Deployments →",
    databaseGovernanceLink: "Database Governance →",
    automationControlLink: "Automation Control →",
    executiveLink: "Executive Center →",
    dashboardTitle: "Observability dashboard",
    domainsTitle: "Observability domains",
    servicesTitle: "Service availability",
    alertsTitle: "Alerts",
    correlationsTitle: "Event correlations",
    investigationsTitle: "Root cause support",
    feedsTitle: "Real-time feeds",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive observability view",
    reviewsTitle: "Operational reviews",
    emptySection: "No items in this section yet.",
    healthScore: "Platform health score",
    dismiss: "Dismiss",
    accept: "Accept",
    acknowledge: "Acknowledge",
    resolve: "Resolve",
    investigate: "Start investigation",
    completeInvestigation: "Complete investigation",
    completeReview: "Mark review complete",
    generateReport: "Generate health report",
    generateSummary: "Generate incident summary",
    humansDecide: "Observability informs understanding — humans decide how to respond.",
    privacyNote: "Privacy",
    healthBands: {
      thriving: "Thriving",
      healthy: "Healthy",
      stable: "Stable",
      attention_required: "Attention required",
      critical: "Critical",
    },
    alertSeverities: {
      informational: "Informational",
      minor: "Minor",
      moderate: "Moderate",
      high: "High",
      critical: "Critical",
    },
    domains: {
      application: "Application observability",
      user_experience: "User experience observability",
      automation: "Automation observability",
      integration: "Integration observability",
      companion: "Companion observability",
    },
    feedTypes: {
      platform_activity: "Platform activity",
      integration_status: "Integration status",
      self_healing: "Self-healing event",
      automation_outcome: "Automation outcome",
      deployment_update: "Deployment update",
    },
    metrics: {
      criticalAlerts: "Critical alerts",
      openAlerts: "Open alerts",
      availability: "Service availability",
      selfHealing: "Self-healing events",
      mttr: "Mean time to understanding",
      detection: "Incident detection speed",
      alertUsefulness: "Alert usefulness",
      confidence: "Operational confidence",
    },
    executiveFields: {
      impact: "Organizational impact",
      reliability: "Service reliability",
      maturity: "Operational maturity",
      experience: "Customer experience trend",
      strategy: "Strategic implication",
    },
    settingsLink: "Platform Observability",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Observability-senter", settingsLink: "Plattform-observability" }],
    ["sv", { ...i18nBlock(), title: "Observabilitycenter", settingsLink: "Plattformsobservability" }],
    ["da", { ...i18nBlock(), title: "Observability-center", settingsLink: "Platform-observability" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.platformObservabilityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.platformObservabilityCenterEngine = block.settingsLink;
    data.operationsCenter = data.operationsCenter ?? {};
    data.operationsCenter.platformObservabilityLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"deploy_governance.view",', `"deploy_governance.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("platformObservabilityCenterEngine")) {
    c = c.replace(
      '| "deploymentGovernanceCenterEngine"',
      '| "platformObservabilityCenterEngine"\n  | "deploymentGovernanceCenterEngine"',
    );
    c = c.replace(
      `{
    id: "deploymentGovernanceCenterEngine",
    href: "/app/operations/deployments",
    labelKey: "customerApp.nav.deploymentGovernanceCenterEngine",
  },`,
      `{
    id: "platformObservabilityCenterEngine",
    href: "/app/operations/platform-observability",
    labelKey: "customerApp.nav.platformObservabilityCenterEngine",
  },
  {
    id: "deploymentGovernanceCenterEngine",
    href: "/app/operations/deployments",
    labelKey: "customerApp.nav.deploymentGovernanceCenterEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/operations/deployments")) return "deploymentGovernanceCenterEngine";',
      'if (pathname.startsWith("/app/operations/platform-observability")) return "platformObservabilityCenterEngine";\n  if (pathname.startsWith("/app/operations/deployments")) return "deploymentGovernanceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-platform-observability-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchOperationsPage() {
  const page = path.join(ROOT, "app/app/operations/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("platform-observability")) {
    p = p.replace(
      `{t(\`\${p}.deploymentsLink\`)} →
        </Link>`,
      `{t(\`\${p}.deploymentsLink\`)} →
        </Link>
        <Link
          href="/app/operations/platform-observability"
          className="ml-4 mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(\`\${p}.platformObservabilityLink\`)} →
        </Link>`,
    );
    fs.writeFileSync(page, p);
    console.log("patched operations page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Platform Observability Center\nRoute: ${P.route}\nCore: You cannot improve what you cannot see.\nHelpers: _obs_* · _obsbp312_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "You cannot improve what you cannot see. Observability should transform data into understanding.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase311-vocabulary";',
      `export * from "./implementation-blueprint-phase311-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE311_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase311-aipify-deployment-governance-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE311_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase311-aipify-deployment-governance-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Platform Observability Engine (Phase ${P.phase}):** See [AIPIFY_PLATFORM_OBSERVABILITY_ENGINE_PHASE${P.phase}.md](./AIPIFY_PLATFORM_OBSERVABILITY_ENGINE_PHASE${P.phase}.md) — Observability Center at Operations Center → Platform Observability. Platform health score, alerts, event correlation, root cause support, real-time feeds, and executive observability view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_obs_*\`, \`_obsbp312_*\`. APIs at \`/api/platform-observability/*\`. Cross-links operations, deployments, and automation — does not modify their RPCs.`;
  if (!c.includes("Platform Observability Engine (Phase 312)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_PLATFORM_OBSERVABILITY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Platform Observability Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
