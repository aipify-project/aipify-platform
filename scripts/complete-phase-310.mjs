#!/usr/bin/env node
/** ABOS Phase 310 — Aipify Database Governance & Migration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 310,
  migration: "20261423800000_aipify_database_governance_migration_engine_phase310.sql",
  slug: "aipify-database-governance-migration-engine",
  docSlug: "AIPIFY_DATABASE_GOVERNANCE_MIGRATION_ENGINE",
  ilmFile: "implementation-blueprint-phase310-aipify-database-governance-center.txt",
  route: "/app/operations/database-governance",
  permKeys: ["db_governance.view", "db_governance.manage", "db_governance.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Database Governance Center",
    subtitle:
      "Controlled, traceable database evolution — migration registry, schema validation, drift detection, and environment parity.",
    loading: "Loading Database Governance Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Database philosophy",
    visionTitle: "Vision",
    operationsLink: "Operations Center →",
    automationControlLink: "Automation Control →",
    updatesLink: "Updates →",
    securityLink: "Security →",
    executiveLink: "Executive Center →",
    dashboardTitle: "Migration health dashboard",
    migrationsTitle: "Migration registry",
    validationTitle: "Schema validation",
    driftTitle: "Schema drift detection",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    environmentTitle: "Environment comparison",
    reviewsTitle: "Governance reviews",
    emptySection: "No items in this section yet.",
    healthScore: "Database health score",
    dismiss: "Dismiss",
    accept: "Accept",
    acknowledge: "Acknowledge",
    review: "Review migration",
    validate: "Validate schema",
    archive: "Archive",
    completeReview: "Mark review complete",
    generateReport: "Generate migration report",
    resolve: "Resolve",
    humansDecide: "Validation informs discipline — schema changes require human approval before execution.",
    privacyNote: "Privacy",
    migrationStatus: "Status",
    riskLevel: "Risk level",
    environment: "Environment",
    rollbackNotes: "Rollback notes",
    databaseGovernanceLink: "Database Governance",
    healthBands: {
      excellent: "Excellent",
      healthy: "Healthy",
      attention_required: "Attention required",
      critical: "Critical",
    },
    migrationStatuses: {
      pending: "Pending",
      applied: "Applied",
      failed: "Failed",
      rolled_back: "Rolled back",
      archived: "Archived",
    },
    riskLevels: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },
    reviewTypes: {
      weekly: "Weekly migration review",
      pre_release: "Pre-release validation",
      quarterly_audit: "Quarterly database audit",
      executive_summary: "Executive technical summary",
    },
    metrics: {
      pending: "Pending migrations",
      failed: "Failed migrations",
      applied: "Applied migrations",
      validationFindings: "Open validation findings",
      driftEvents: "Open drift events",
      consistency: "Environment consistency",
      successRate: "Migration success rate",
      confidence: "Deployment confidence",
    },
    settingsLink: "Database Governance",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Database-styringssenter", settingsLink: "Database-styring" }],
    ["sv", { ...i18nBlock(), title: "Databasstyrningscenter", settingsLink: "Databasstyrning" }],
    ["da", { ...i18nBlock(), title: "Database-styringscenter", settingsLink: "Database-styring" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.databaseGovernanceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.databaseGovernanceCenterEngine = block.settingsLink;
    data.operationsCenter = data.operationsCenter ?? {};
    data.operationsCenter.databaseGovernanceLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"health_center.view",', `"health_center.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("databaseGovernanceCenterEngine")) {
    c = c.replace(
      '| "automationControlCenterEngine"',
      '| "databaseGovernanceCenterEngine"\n  | "automationControlCenterEngine"',
    );
    c = c.replace(
      `{
    id: "automationControlCenterEngine",
    href: "/app/operations/automation-control",
    labelKey: "customerApp.nav.automationControlCenterEngine",
  },`,
      `{
    id: "databaseGovernanceCenterEngine",
    href: "/app/operations/database-governance",
    labelKey: "customerApp.nav.databaseGovernanceCenterEngine",
  },
  {
    id: "automationControlCenterEngine",
    href: "/app/operations/automation-control",
    labelKey: "customerApp.nav.automationControlCenterEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/operations/automation-control")) return "automationControlCenterEngine";',
      'if (pathname.startsWith("/app/operations/database-governance")) return "databaseGovernanceCenterEngine";\n  if (pathname.startsWith("/app/operations/automation-control")) return "automationControlCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-database-governance-migration-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchOperationsPage() {
  const page = path.join(ROOT, "app/app/operations/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("database-governance")) {
    p = p.replace(
      `{t(\`\${p}.automationControlLink\`)} →`,
      `{t(\`\${p}.automationControlLink\`)} →
        </Link>
        <Link
          href="/app/operations/database-governance"
          className="ml-4 mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(\`\${p}.databaseGovernanceLink\`)} →`,
    );
    fs.writeFileSync(page, p);
    console.log("patched operations page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Database Governance Center\nRoute: ${P.route}\nCore: The database is the foundation of Aipify.\nHelpers: _dgc_* · _dgcbp310_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "The database is the foundation of Aipify. If the database loses integrity, the platform loses trust.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase308-vocabulary";',
      `export * from "./implementation-blueprint-phase308-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE308_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase308-aipify-organizational-health-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE308_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase308-aipify-organizational-health-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Database Governance & Migration Engine (Phase ${P.phase}):** See [AIPIFY_DATABASE_GOVERNANCE_MIGRATION_ENGINE_PHASE${P.phase}.md](./AIPIFY_DATABASE_GOVERNANCE_MIGRATION_ENGINE_PHASE${P.phase}.md) — Database Governance Center at Operations Center → Database Governance. Migration registry, schema validation, drift detection, environment comparison, rollback readiness, and governance reviews. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_dgc_*\`, \`_dgcbp310_*\`. APIs at \`/api/database-governance/*\`. Cross-links operations and updates — does not modify their RPCs.`;
  if (!c.includes("Database Governance & Migration Engine (Phase")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_DATABASE_GOVERNANCE_MIGRATION_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Database Governance & Migration Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
