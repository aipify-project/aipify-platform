#!/usr/bin/env node
/** ABOS Phase 311 — Aipify Deployment Governance Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 311,
  migration: "20261423900000_aipify_deployment_governance_engine_phase311.sql",
  slug: "aipify-deployment-governance-engine",
  docSlug: "AIPIFY_DEPLOYMENT_GOVERNANCE_ENGINE",
  ilmFile: "implementation-blueprint-phase311-aipify-deployment-governance-center.txt",
  route: "/app/operations/deployments",
  permKeys: ["deploy_governance.view", "deploy_governance.manage", "deploy_governance.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Deployment Center",
    subtitle:
      "Safe, traceable, governed deployments — pipeline visibility, validation, approvals, rollback readiness, and release confidence.",
    loading: "Loading Deployment Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Deployment philosophy",
    visionTitle: "Vision",
    operationsLink: "Operations Center →",
    databaseGovernanceLink: "Database Governance →",
    automationControlLink: "Automation Control →",
    updatesLink: "Updates →",
    executiveLink: "Executive Center →",
    dashboardTitle: "Deployment dashboard",
    deploymentsTitle: "Deployments",
    checklistTitle: "Pre-deployment checklist",
    postValidationTitle: "Post-deployment validation",
    rollbackTitle: "Rollback center",
    approvalsTitle: "Deployment approvals",
    releaseNotesTitle: "Release notes",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    reviewsTitle: "Governance reviews",
    emptySection: "No items in this section yet.",
    healthScore: "Deployment health score",
    productionVersion: "Current production version",
    dismiss: "Dismiss",
    accept: "Accept",
    approve: "Approve",
    advance: "Advance pipeline",
    passCheck: "Mark passed",
    validate: "Run validation",
    completeReview: "Mark review complete",
    generateReport: "Generate deployment report",
    rollbackReview: "Request rollback review",
    humansDecide: "Deployments require human approval — Aipify prepares and validates; your team decides.",
    privacyNote: "Privacy",
    deploymentTypes: {
      development: "Development",
      staging: "Staging",
      production: "Production",
      hotfix: "Hotfix",
    },
    deploymentStatuses: {
      pending: "Pending",
      validating: "Validating",
      staging: "Staging",
      awaiting_approval: "Awaiting approval",
      deploying: "Deploying",
      deployed: "Deployed",
      failed: "Failed",
      rolled_back: "Rolled back",
      archived: "Archived",
    },
    pipelineStages: {
      development_complete: "Development complete",
      automated_validation: "Automated validation",
      migration_verification: "Migration verification",
      staging_deployment: "Staging deployment",
      qa_approval: "QA approval",
      production_approval: "Production approval",
      production_deployment: "Production deployment",
      post_validation: "Post-deployment validation",
      archived: "Archived",
    },
    healthBands: {
      excellent: "Excellent",
      healthy: "Healthy",
      needs_attention: "Needs attention",
      critical: "Critical",
    },
    approvalLevels: {
      level1: "Level 1 — Developer approval",
      level2: "Level 2 — Technical lead approval",
      level3: "Level 3 — Operations approval",
      level4: "Level 4 — Executive approval",
    },
    metrics: {
      pending: "Pending deployments",
      failed: "Failed deployments",
      releases: "Recent releases",
      rollbackReady: "Rollback-ready points",
      successRate: "Deployment success rate",
      validationRate: "Validation completion rate",
      mttr: "Mean time to recovery",
      confidence: "Operational confidence",
    },
    settingsLink: "Deployments",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Deployment-senter", settingsLink: "Deployments" }],
    ["sv", { ...i18nBlock(), title: "Deploymentcenter", settingsLink: "Deployments" }],
    ["da", { ...i18nBlock(), title: "Deployment-center", settingsLink: "Deployments" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.deploymentGovernanceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.deploymentGovernanceCenterEngine = block.settingsLink;
    data.operationsCenter = data.operationsCenter ?? {};
    data.operationsCenter.deploymentsLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"db_governance.view",', `"db_governance.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("deploymentGovernanceCenterEngine")) {
    c = c.replace(
      '| "databaseGovernanceCenterEngine"',
      '| "deploymentGovernanceCenterEngine"\n  | "databaseGovernanceCenterEngine"',
    );
    c = c.replace(
      `{
    id: "databaseGovernanceCenterEngine",
    href: "/app/operations/database-governance",
    labelKey: "customerApp.nav.databaseGovernanceCenterEngine",
  },`,
      `{
    id: "deploymentGovernanceCenterEngine",
    href: "/app/operations/deployments",
    labelKey: "customerApp.nav.deploymentGovernanceCenterEngine",
  },
  {
    id: "databaseGovernanceCenterEngine",
    href: "/app/operations/database-governance",
    labelKey: "customerApp.nav.databaseGovernanceCenterEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/operations")) return "operationsCenter";',
      'if (pathname.startsWith("/app/operations/deployments")) return "deploymentGovernanceCenterEngine";\n  if (pathname.startsWith("/app/operations/database-governance")) return "databaseGovernanceCenterEngine";\n  if (pathname.startsWith("/app/operations/automation-control")) return "automationControlCenterEngine";\n  if (pathname.startsWith("/app/operations")) return "operationsCenter";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-deployment-governance-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchOperationsPage() {
  const page = path.join(ROOT, "app/app/operations/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("operations/deployments")) {
    p = p.replace(
      `{t(\`\${p}.databaseGovernanceLink\`)} →
        </Link>`,
      `{t(\`\${p}.databaseGovernanceLink\`)} →
        </Link>
        <Link
          href="/app/operations/deployments"
          className="ml-4 mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(\`\${p}.deploymentsLink\`)} →
        </Link>`,
    );
    fs.writeFileSync(page, p);
    console.log("patched operations page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Deployment Governance Center\nRoute: ${P.route}\nCore: Shipping safely is essential.\nHelpers: _dpl_* · _dplbp311_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Shipping fast is valuable. Shipping safely is essential. Every deployment should increase confidence.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase310-vocabulary";',
      `export * from "./implementation-blueprint-phase310-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE310_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase310-aipify-database-governance-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE310_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase310-aipify-database-governance-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Deployment Governance Engine (Phase ${P.phase}):** See [AIPIFY_DEPLOYMENT_GOVERNANCE_ENGINE_PHASE${P.phase}.md](./AIPIFY_DEPLOYMENT_GOVERNANCE_ENGINE_PHASE${P.phase}.md) — Deployment Center at Operations Center → Deployments. Pipeline governance, pre/post validation, approvals, rollback center, release notes, and deployment health. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_dpl_*\`, \`_dplbp311_*\`. APIs at \`/api/deployment-governance/*\`. Cross-links operations, database governance, and updates — does not modify their RPCs.`;
  if (!c.includes("Deployment Governance Engine (Phase 311)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_DEPLOYMENT_GOVERNANCE_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Deployment Governance Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
