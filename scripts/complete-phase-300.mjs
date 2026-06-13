#!/usr/bin/env node
/** ABOS Phase 300 — Aipify Permission & Access Governance Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 300,
  migration: "20261422800000_aipify_permission_access_governance_engine_phase300.sql",
  slug: "aipify-permission-access-governance-engine",
  docSlug: "AIPIFY_PERMISSION_ACCESS_GOVERNANCE",
  ilmFile: "implementation-blueprint-phase300-aipify-permission-access-governance.txt",
  route: "/app/governance/permissions-access",
  permKeys: ["permission_access.view", "permission_access.manage", "permission_access.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Permission Center",
    subtitle:
      "Review what Aipify can access and do — grant, revoke, and govern permissions with full transparency.",
    loading: "Loading Permission Center…",
    corePrinciple: "Core principle",
    visionTitle: "Vision",
    governanceLink: "Governance Center →",
    identityAccessLink: "Identity & Access →",
    approvalCenterLink: "Approval Center →",
    dashboardTitle: "Permission dashboard",
    activeTitle: "Active permissions",
    pendingRequestsTitle: "Permission requests",
    highImpactTitle: "High-impact permissions",
    revokedTitle: "Revoked permissions",
    companionTitle: "Companion access overview",
    historyTitle: "Access history",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive reporting",
    emptyActive: "No active permissions to display.",
    emptyPending: "No pending permission requests.",
    emptyRecommendations: "No open recommendations.",
    resource: "Resource",
    permission: "Permission",
    purpose: "Purpose",
    riskLevel: "Risk level",
    grantedBy: "Granted by",
    grantedOn: "Granted on",
    expires: "Expires",
    whatCanDo: "What Aipify can do",
    whatCannotDo: "What Aipify cannot do",
    revokeInstructions: "How to revoke",
    whyNeeded: "Why this is needed",
    revoke: "Revoke",
    downgrade: "Downgrade",
    approve: "Grant access",
    deny: "Deny",
    dismiss: "Dismiss",
    categories: {
      data_access: "Data access",
      action_access: "Action access",
      business_access: "Business access",
      community_access: "Community access",
      companion_access: "Companion access",
    },
    riskLevels: {
      low: "Low",
      moderate: "Moderate",
      elevated: "Elevated",
      high: "High",
    },
    permissionLevels: {
      "1": "Read only",
      "2": "Recommend",
      "3": "Approve & execute",
      "4": "Fully automated",
    },
    expirationTypes: {
      permanent: "Permanent",
      temporary: "Temporary",
      project: "Project-based",
      time_limited: "Time-limited",
    },
    eventTypes: {
      granted: "Granted",
      revoked: "Revoked",
      downgraded: "Downgraded",
      expired: "Expired",
      reviewed: "Reviewed",
      failed_attempt: "Failed attempt",
    },
    metrics: {
      active: "Active",
      recentGranted: "Recently granted",
      highImpact: "High impact",
      revoked: "Revoked",
      pendingRequests: "Pending requests",
      companion: "Companion access",
      compliance: "Governance compliance",
      avgReview: "Avg. review time",
    },
    privacyNote: "Privacy",
    settingsLink: "Permissions & Access",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    [
      "no",
      {
        ...i18nBlock(),
        title: "Tillatelsessenter",
        settingsLink: "Tillatelser og tilgang",
      },
    ],
    [
      "sv",
      {
        ...i18nBlock(),
        title: "Behörighetscenter",
        settingsLink: "Behörigheter och åtkomst",
      },
    ],
    [
      "da",
      {
        ...i18nBlock(),
        title: "Tilladelsescenter",
        settingsLink: "Tilladelser og adgang",
      },
    ],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.permissionAccessGovernance = block;
    data.nav = data.nav ?? {};
    data.nav.permissionAccessGovernanceEngine = block.settingsLink;
    data.governance = data.governance ?? {};
    data.governance.permissionsAccessLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"approval_oversight.view",', `"approval_oversight.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("permissionAccessGovernanceEngine")) {
    c = c.replace(
      '| "approvalHumanOversightEngine"',
      '| "permissionAccessGovernanceEngine"\n  | "approvalHumanOversightEngine"',
    );
    c = c.replace(
      `{
    id: "approvalHumanOversightEngine",
    href: "/app/governance/approval-center",
    labelKey: "customerApp.nav.approvalHumanOversightEngine",
  },`,
      `{
    id: "permissionAccessGovernanceEngine",
    href: "/app/governance/permissions-access",
    labelKey: "customerApp.nav.permissionAccessGovernanceEngine",
  },
  {
    id: "approvalHumanOversightEngine",
    href: "/app/governance/approval-center",
    labelKey: "customerApp.nav.approvalHumanOversightEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/governance/approval-center")) return "approvalHumanOversightEngine";',
      'if (pathname.startsWith("/app/governance/permissions-access")) return "permissionAccessGovernanceEngine";\n  if (pathname.startsWith("/app/governance/approval-center")) return "approvalHumanOversightEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-permission-access-governance-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Permission & Access Governance Engine\nRoute: ${P.route}\nCore: Aipify can only do what it has permission to do.\nHelpers: _pag_* · _pagbp300_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Aipify can only do what it has permission to do. No permission. No action.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase299-vocabulary";',
      `export * from "./implementation-blueprint-phase299-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE299_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase299-aipify-approval-human-oversight-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE299_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase299-aipify-approval-human-oversight-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Permission & Access Governance Engine (Phase ${P.phase}):** See [AIPIFY_PERMISSION_ACCESS_GOVERNANCE_PHASE${P.phase}.md](./AIPIFY_PERMISSION_ACCESS_GOVERNANCE_PHASE${P.phase}.md) — Permission Center at Governance Center → Permissions & Access. Active permissions, request flow, revocation, expiration, companion access, Aipify explanations, history, and executive reporting. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_pag_*\`, \`_pagbp300_*\`. APIs at \`/api/permission-access-governance/*\`. Cross-links \`/app/identity-access\` — does not modify core identity permission RPCs.`;
  if (!c.includes("Permission & Access Governance Engine")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_PERMISSION_ACCESS_GOVERNANCE_PHASE${P.phase}.md`),
  `# Aipify Permission & Access Governance Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
