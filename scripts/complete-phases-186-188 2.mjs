#!/usr/bin/env node
/**
 * Complete ABOS Phases 186–188 + patch nav/permissions/i18n/ARCHITECTURE.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

const PHASES = [
  {
    phase: 186,
    migration: "20261346000000_humanity_shared_compassion_reciprocal_care_engine_phase186.sql",
    slug: "shared-compassion-reciprocal-care-engine",
    base: "SharedCompassionReciprocalCare",
    camel: "sharedCompassionReciprocalCareEngine",
    snake: "humanity_shared_compassion_reciprocal_care",
    permPrefix: "shared_compassion_care",
    helper: "hscrc",
    bp: "hscrcbp186",
    decisionType: "humanity_shared_compassion_reciprocal_care_engine",
    title: "Humanity's Shared Compassion & Reciprocal Care",
    centerTitle: "Reciprocal Care Center",
    companion: "Care Companion",
    scoreKey: "humanity_shared_compassion_reciprocal_care_score",
    modeKey: "compassion_mode",
    levelKey: "care_readiness_level",
    thirdEntity: "care_notes",
    reflectionsKey: "compassion_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "humanity_shared_trust_cooperative_intelligence_engine",
    docSlug: "HUMANITY_SHARED_COMPASSION_RECIPROCAL_CARE_ENGINE",
    ilmFile: "implementation-blueprint-phase186-shared-compassion-reciprocal-care.txt",
    navLabel: "Shared Compassion",
    faqExtra:
      "Care Companion supports compassion — does NOT replace relationships, provide clinical treatment, or manipulate emotions.",
    crossLinkNote:
      "Cross-links only: inclusion_humanity_engine, gratitude_recognition_engine, Phase 184 shared resilience — never duplicate RPCs.",
    ilmExtra: `
Reciprocal Care Center: care programs, empathy workshops, companion reflection, leadership compassion reviews, Growth Partner wellbeing networks, relationship health dashboards, reciprocal care assessments, compassion knowledge libraries.
Compassion Engine prompts: feel supported?, express empathy?, leaders show care?, relationships strengthen?, reciprocal care practices?
Reciprocal Care Framework: empathy practices, leadership accessibility, Growth Partner support, employee wellbeing, mentorship, community engagement, collaborative care.
Executive Compassion Reviews, Care Companion, Wellbeing Engine, Relationship Health Engine.
Companion limitations: no replacing relationships, no clinical treatment, no emotional manipulation, no surveillance, no overriding leadership.
Self Love in compassion: empathy, humility, patience, self-compassion, recognition, generosity.`,
    faqBody: `## What is the Reciprocal Care Center?

The Reciprocal Care Center at \`/app/shared-compassion-reciprocal-care-engine\` supports care programs, empathy workshops, companion reflection, leadership compassion reviews, Growth Partner wellbeing networks, relationship health dashboards, reciprocal care assessments, and compassion knowledge libraries.

## Does the Care Companion replace relationships?

**No.** The Care Companion supports compassion — it does NOT replace relationships, provide clinical treatment, manipulate emotions, or override leadership.

## Why compassion in organizations?

Human progress depends upon compassion as well as intelligence. Organizations influence how people experience work, belonging, and care.

## How do excellence and care connect?

Excellence and care reinforce each other — metadata scaffolds support reflection without surveillance or judgment.

## How does Self Love connect to compassion?

Empathy, humility, patience, self-compassion, recognition, and generosity — compassion as stewardship, not surveillance.`,
    companionLimitations: [
      "replace_relationships",
      "clinical_treatment",
      "emotional_manipulation",
      "surveillance",
      "override_leadership",
    ],
  },
  {
    phase: 187,
    migration: "20261347000000_humanity_shared_courage_responsible_action_engine_phase187.sql",
    slug: "shared-courage-responsible-action-engine",
    base: "SharedCourageResponsibleAction",
    camel: "sharedCourageResponsibleActionEngine",
    snake: "humanity_shared_courage_responsible_action",
    permPrefix: "shared_courage_action",
    helper: "hscra",
    bp: "hscrabp187",
    decisionType: "humanity_shared_courage_responsible_action_engine",
    title: "Humanity's Shared Courage & Responsible Action",
    centerTitle: "Courage Center",
    companion: "Courage Companion",
    scoreKey: "humanity_shared_courage_responsible_action_score",
    modeKey: "courage_mode",
    levelKey: "action_readiness_level",
    thirdEntity: "action_notes",
    reflectionsKey: "courage_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "humanity_shared_compassion_reciprocal_care_engine",
    docSlug: "HUMANITY_SHARED_COURAGE_RESPONSIBLE_ACTION_ENGINE",
    ilmFile: "implementation-blueprint-phase187-shared-courage-responsible-action.txt",
    navLabel: "Shared Courage",
    faqExtra:
      "Courage Companion supports confidence — does NOT replace judgment, encourage recklessness, or override human accountability.",
    crossLinkNote:
      "Cross-links only: trust-action approvals, Phase 186 compassion, Phase 184 shared resilience — never duplicate RPCs.",
    ilmExtra: `
Courage Center: initiative programs, responsible action workshops, companion reflection, leadership courage reviews, Growth Partner action networks, contribution dashboards, courage assessments, action knowledge libraries.
Responsible Action Engine prompts: take initiative?, act responsibly?, leaders encourage courage?, risks balanced?, accountable action?
Courage Framework: initiative practices, leadership accessibility, Growth Partner contributions, employee achievements, mentorship, community engagement, collaborative action.
Executive Courage Reviews, Courage Companion, Initiative Engine, Responsible Risk Engine.
Companion limitations: no replacing judgment, no recklessness, no overriding accountability, no suppressing caution, no forcing action.
Self Love in courage: confidence, humility, patience, self-compassion, growth recognition, progress celebration.`,
    faqBody: `## What is the Courage Center?

The Courage Center at \`/app/shared-courage-responsible-action-engine\` supports initiative programs, responsible action workshops, companion reflection, leadership courage reviews, Growth Partner action networks, contribution dashboards, courage assessments, and action knowledge libraries.

## Does the Courage Companion replace judgment?

**No.** The Courage Companion supports confidence — it does NOT replace judgment, encourage recklessness, override accountability, or force action.

## Why courage in organizations?

Knowledge without action changes little. Compassion without courage struggles to endure. Progress depends upon responsible initiative.

## How do excellence and courage connect?

Responsible courage balances initiative with accountability — metadata scaffolds support reflection without recklessness.

## How does Self Love connect to courage?

Confidence, humility, patience, self-compassion, growth recognition, and progress celebration — courage as stewardship, not pressure.`,
    companionLimitations: [
      "replace_judgment",
      "recklessness",
      "override_accountability",
      "suppress_caution",
      "force_action",
    ],
  },
  {
    phase: 188,
    migration: "20261348000000_humanity_shared_gratitude_appreciative_stewardship_engine_phase188.sql",
    slug: "shared-gratitude-appreciative-stewardship-engine",
    base: "SharedGratitudeAppreciativeStewardship",
    camel: "sharedGratitudeAppreciativeStewardshipEngine",
    snake: "humanity_shared_gratitude_appreciative_stewardship",
    permPrefix: "shared_gratitude_stewardship",
    helper: "hsgas",
    bp: "hsgasbp188",
    decisionType: "humanity_shared_gratitude_appreciative_stewardship_engine",
    title: "Humanity's Shared Gratitude & Appreciative Stewardship",
    centerTitle: "Appreciative Stewardship Center",
    companion: "Gratitude Companion",
    scoreKey: "humanity_shared_gratitude_appreciative_stewardship_score",
    modeKey: "gratitude_mode",
    levelKey: "appreciation_readiness_level",
    thirdEntity: "recognition_notes",
    reflectionsKey: "gratitude_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "humanity_shared_courage_responsible_action_engine",
    docSlug: "HUMANITY_SHARED_GRATITUDE_APPRECIATIVE_STEWARDSHIP_ENGINE",
    ilmFile: "implementation-blueprint-phase188-shared-gratitude-appreciative-stewardship.txt",
    navLabel: "Shared Gratitude",
    faqExtra:
      "Gratitude Companion supports appreciation — does NOT replace authentic recognition, use insincere praise, or manipulate emotions.",
    crossLinkNote:
      "Cross-links only: gratitude_recognition_engine, Phase 186 compassion, Phase 183 shared purpose — never duplicate RPCs.",
    ilmExtra: `
Appreciative Stewardship Center: recognition programs, leadership appreciation reviews, companion reflection, Growth Partner celebrations, contribution dashboards, peer recognition networks, belonging assessments, gratitude knowledge libraries.
Gratitude Engine prompts: recognizing contributions?, feel appreciated?, leaders express gratitude?, strengths celebrate?, reinforce positive behaviors?
Appreciation Framework: recognition practices, leadership accessibility, Growth Partner contributions, employee achievements, mentorship, community engagement, collaborative successes.
Executive Gratitude Reviews, Gratitude Companion, Recognition Engine, Positive Reinforcement Engine.
Companion limitations: no insincere recognition, no emotional manipulation, no replacing authentic appreciation, no suppressing constructive feedback, no overriding leadership.
Self Love in gratitude: self-appreciation, gratitude, humility, compassion, growth recognition, progress celebration.`,
    faqBody: `## What is Appreciative Stewardship?

The Appreciative Stewardship Center at \`/app/shared-gratitude-appreciative-stewardship-engine\` supports recognition programs, leadership appreciation reviews, companion reflection, Growth Partner celebrations, contribution dashboards, peer recognition networks, belonging assessments, and gratitude knowledge libraries.

## Can the Gratitude Companion replace authentic appreciation?

**No.** The Gratitude Companion supports appreciation — it does NOT replace authentic recognition, use insincere praise, manipulate emotions, suppress constructive feedback, or override leadership.

## Why gratitude in organizations?

Progress often focuses on what remains unfinished. Gratitude strengthens belonging, reinforces positive behaviors, and celebrates contribution.

## How do excellence and celebration connect?

Excellence and celebration reinforce each other — metadata scaffolds support recognition without surveillance or performative praise.

## How does Self Love connect to gratitude?

Self-appreciation, gratitude, humility, compassion, growth recognition, and progress celebration — appreciation as stewardship, not manipulation.`,
    companionLimitations: [
      "insincere_recognition",
      "emotional_manipulation",
      "replace_authentic_appreciation",
      "suppress_constructive_feedback",
      "override_leadership",
    ],
  },
];

function transformFrom185(content, p) {
  const engine = `${p.base}Engine`;
  const thirdPascal = p.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["SharedTrustCooperativeIntelligence", p.base],
    ["shared-trust-cooperative-intelligence-engine", p.slug],
    ["humanity_shared_trust_cooperative_intelligence", p.snake],
    ["sharedTrustCooperativeIntelligence", p.camel.replace(/Engine$/, "")],
    ["sharedTrustCooperativeIntelligenceEngine", p.camel],
    ["hstcibp185", p.bp],
    ["_hstci_", `_${p.helper}_`],
    ["humanity_shared_trust_cooperative_intelligence_score", p.scoreKey],
    ["cooperation_mode", p.modeKey],
    ["trust_readiness_level", p.levelKey],
    ["trust_reflections", p.reflectionsKey],
    ["cooperation_notes", p.thirdEntity],
    ["CooperationNote", thirdPascal.slice(0, -1) === "Note" ? thirdPascal : thirdPascal],
    ["cooperation_notes_count", `${p.thirdEntity}_count`],
    ["Cooperative Intelligence Center", p.centerTitle],
    ["Cooperative Intelligence", p.centerTitle.replace(" Center", "")],
    ["Cooperation Companion", p.companion],
    ["Humanity's Shared Trust & Cooperative Intelligence", p.title],
    ["Human Trust & Cooperative Intelligence", p.title.replace("Humanity's ", "")],
    ["Phase 185", `Phase ${p.phase}`],
    ["181–185", `181–${p.phase}`],
    ["Era 181–185", `Era 181–${p.phase}`],
    ["humanity_shared_trust_cooperative_intelligence_engine", p.decisionType],
    ["humanity_shared_trust_cooperative_intelligence.view", `${p.permPrefix}.view`],
    ["humanity_shared_trust_cooperative_intelligence.manage", `${p.permPrefix}.manage`],
    ["humanity_shared_trust_cooperative_intelligence.steward", `${p.permPrefix}.steward`],
    ["shared_trust_cooperative.view", `${p.permPrefix}.view`],
    ["shared_trust_cooperative.manage", `${p.permPrefix}.manage`],
    ["shared_trust_cooperative.steward", `${p.permPrefix}.steward`],
    [
      "20261345000000_humanity_shared_trust_cooperative_intelligence_engine_phase185.sql",
      p.migration,
    ],
    ["Repo Phase 185", `Repo Phase ${p.phase}`],
    ["Phase 185 —", `Phase ${p.phase} —`],
    ["Human Agency & Autonomy Phase 185", `${p.title} Phase ${p.phase}`],
    ["trust_reputation_engine", p.phase === 186 ? "inclusion_humanity_engine" : p.phase === 187 ? "trust_action_engine" : "gratitude_recognition_engine"],
    ["Phase 184 shared resilience", p.phase === 188 ? "Phase 183 shared purpose" : "Phase 184 shared resilience"],
    ["social_cohesion_engine", p.phase === 186 ? "gratitude_recognition_engine" : p.phase === 187 ? "Phase 186 compassion" : "Phase 186 compassion"],
    ["civilizational trust surfaces", p.phase === 187 ? "Phase 186 compassion" : p.phase === 188 ? "Phase 183 shared purpose" : "Phase 184 shared resilience"],
    ["Cross-links only: trust_reputation_engine, Phase 184 shared resilience, social_cohesion_engine, civilizational trust surfaces — never duplicate RPCs.", p.crossLinkNote],
    ["Human Hope & Collective Wisdom Engine", `${p.title} Engine`],
    ["Collective Wisdom Center", p.centerTitle],
    ["-- Phase 182 —", `-- Phase ${p.phase} —`],
    ["cooperation", p.modeKey.replace("_mode", "")],
    ["Cooperation", p.companion.replace(" Companion", "")],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function genCore(p) {
  const engine = `${p.base}Engine`;
  write(
    path.join(ROOT, `lib/core/${p.slug}.ts`),
    `/**
 * ${p.title} Engine helpers (Phase ${p.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${p.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function get${engine}Dashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${engine}Card(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function create${engine}AuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
`,
  );
}

function genTsStack(p) {
  const engine = `${p.base}Engine`;
  const srcDir = path.join(ROOT, "lib/aipify/shared-trust-cooperative-intelligence-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${p.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dstDir, f), transformFrom185(fs.readFileSync(path.join(srcDir, f), "utf8"), p));
  }

  const panelSrc = path.join(
    ROOT,
    "components/app/shared-trust-cooperative-intelligence-engine/SharedTrustCooperativeIntelligenceEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/${engine}DashboardPanel.tsx`),
    transformFrom185(fs.readFileSync(panelSrc, "utf8"), p),
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/index.ts`),
    `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`,
  );

  const pageSrc = fs.readFileSync(
    path.join(ROOT, "app/app/shared-trust-cooperative-intelligence-engine/page.tsx"),
    "utf8",
  );
  write(path.join(ROOT, `app/app/${p.slug}/page.tsx`), transformFrom185(pageSrc, p));

  for (const route of ["dashboard", "card"]) {
    const apiSrc = fs.readFileSync(
      path.join(ROOT, `app/api/aipify/shared-trust-cooperative-intelligence-engine/${route}/route.ts`),
      "utf8",
    );
    write(path.join(ROOT, `app/api/aipify/${p.slug}/${route}/route.ts`), transformFrom185(apiSrc, p));
  }
}

function genMigration(p) {
  let m = transformFrom185(
    fs.readFileSync(
      path.join(
        ROOT,
        "supabase/migrations/20261345000000_humanity_shared_trust_cooperative_intelligence_engine_phase185.sql",
      ),
      "utf8",
    ),
    p,
  );
  m = m.replace(`'${p.prevDecision}'`, `'${p.prevDecision}',\n    '${p.decisionType}'`);
  m = m.replace(
    /-- Phase \d+ —[^\n]+\n-- Universal Stewardship[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${p.phase} — ${p.title} Engine\n-- ${p.era} — ${p.centerTitle}.\n-- Helpers: _${p.helper}_* (engine), _${p.bp}_* (blueprint)`,
  );
  write(path.join(ROOT, `supabase/migrations/${p.migration}`), m);
}

function genDocs(p) {
  write(
    path.join(ROOT, `${p.docSlug}_PHASE${p.phase}.md`),
    `# ${p.title} Engine — Phase ${p.phase}

## Vision

${p.centerTitle} within the ${p.era}. ${p.companion} supports — does NOT replace human judgment, responsibility, or dignity.

## Permissions

- \`${p.permPrefix}.view\` · \`${p.permPrefix}.manage\` · \`${p.permPrefix}.steward\`

## Helpers

- Engine: \`_${p.helper}_*\` · Blueprint: \`_${p.bp}_*\`

${p.crossLinkNote}
`,
  );

  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.docSlug}.md`),
    `# Implementation Blueprint — Phase ${p.phase} ${p.title}

Route: \`/app/${p.slug}\`
Era: ${p.era}
${p.crossLinkNote}
`,
  );

  write(
    path.join(ROOT, `content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md`),
    `# ${p.title} Engine — FAQ (Phase ${p.phase})\n\n${p.faqBody}\n`,
  );

  const ilmBody = `ABOS Phase ${p.phase} — ${p.title}
Route: /app/${p.slug}
Era: ${p.era}
${p.centerTitle}: metadata scaffolds for stewardship programs, companion-supported reflection, executive reviews.
${p.companion} supports — NOT replace human judgment.
${p.crossLinkNote}
People First. Wisdom before speed. Growth Partner — never Affiliate.
${p.ilmExtra}`;

  write(path.join(ROOT, `aipify-core/knowledge/internal-language-model/${p.ilmFile}`), ilmBody);

  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${p.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_MISSION =
  "${p.centerTitle} — ${p.companion} supports; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_PHILOSOPHY =
  "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_ROUTE = "/app/${p.slug}";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_COMPANION_LIMITATIONS = [
${p.companionLimitations.map((l) => `  "${l}",`).join("\n")}
] as const;
`,
  );
}

function hopeI18nBlock(p) {
  return {
    title: p.centerTitle,
    subtitle: `${p.era} — ${p.companion.toLowerCase()} supports reflection and metadata scaffolds. Supports humans — does NOT replace judgment or leadership accountability. Growth Partner — never Affiliate.`,
    loading: `Loading ${p.title} dashboard…`,
    engineTitle: `${p.title} Engine (Phase ${p.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${p.companion} supports only`,
    eraOpenerSummary: `Universal Stewardship Era — Phases ${p.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${p.centerTitle} capabilities`,
    engineLabel: `${p.companion.replace(" Companion", "")} engine — reflection prompts`,
    frameworkLabel: "Stewardship framework",
    reviewsLabel: "Executive reviews",
    companionLabel: `${p.companion} — supports, does not replace`,
    subEngineLabel: "Supporting engine",
    reflections: "Reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${p.phase})`,
    companionLimitations: `${p.companion} limitations — does NOT replace human judgment`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${p.phase}`]: {
      mission: `${p.companion} supports stewardship and reflection — humans retain accountability.`,
      philosophy: "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNavConfig() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");

  const allNav = [
    { id: "sharedPurposeContributionEngine", href: "/app/shared-purpose-contribution-engine" },
    { id: "sharedResilienceAdaptiveCapacityEngine", href: "/app/shared-resilience-adaptive-capacity-engine" },
    { id: "sharedTrustCooperativeIntelligenceEngine", href: "/app/shared-trust-cooperative-intelligence-engine" },
    ...PHASES.map((p) => ({ id: p.camel, href: `/app/${p.slug}` })),
  ];

  for (const { id } of allNav) {
    if (!c.includes(`"${id}"`)) {
      c = c.replace(
        '| "collectiveWisdomSharedLearningEngine"',
        `| "collectiveWisdomSharedLearningEngine"\n  | "${id}"`,
      );
    }
  }

  const navInsert = allNav
    .filter((n) => !c.includes(n.href))
    .map(
      (n) =>
        `  {\n    id: "${n.id}",\n    href: "${n.href}",\n    labelKey: "customerApp.nav.${n.id}",\n  },`,
    )
    .join("\n");

  if (navInsert) {
    c = c.replace(
      /id: "collectiveWisdomSharedLearningEngine",[\s\S]*?labelKey: "customerApp\.nav\.collectiveWisdomSharedLearningEngine",\n  },/,
      (m) => `${m}\n${navInsert}`,
    );
  }

  for (const { href, id } of allNav) {
    if (!c.includes(`pathname.startsWith("${href}")`)) {
      c = c.replace(
        'if (pathname.startsWith("/app/collective-wisdom-shared-learning-engine")) {\n    return "collectiveWisdomSharedLearningEngine";\n  }',
        `if (pathname.startsWith("/app/collective-wisdom-shared-learning-engine")) {\n    return "collectiveWisdomSharedLearningEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched nav-config");
}

function patchPermissions() {
  const file = path.join(ROOT, "lib/core/permissions.ts");
  let c = fs.readFileSync(file, "utf8");

  for (const p of PHASES) {
    const block = `"${p.permPrefix}.view",\n  "${p.permPrefix}.manage",\n  "${p.permPrefix}.steward",`;
    if (!c.includes(`${p.permPrefix}.view`)) {
      c = c.replace('"shared_trust_cooperative.steward",', `"shared_trust_cooperative.steward",\n  ${block}`);
    }
    const viewOnly = `"${p.permPrefix}.view",`;
    if ((c.match(new RegExp(viewOnly.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length < 2) {
      c = c.replace('"shared_trust_cooperative.view",', `"shared_trust_cooperative.view",\n    ${viewOnly}`);
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched permissions");
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  for (const p of PHASES) {
    const line = `export * from "./${p.slug}";`;
    if (!c.includes(line)) c += `\n${line}`;
  }
  fs.writeFileSync(file, c.endsWith("\n") ? c : `${c}\n`);
  console.log("patched tenant");
}

function patchI18n() {
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const p of PHASES) {
      const block = hopeI18nBlock(p);
      if (locale !== "en") {
        for (const key of Object.keys(block)) {
          if (typeof block[key] === "object") {
            block[key].mission = block[key].mission;
            block[key].philosophy = block[key].philosophy;
            block[key].growthPartnerNotAffiliate = block[key].growthPartnerNotAffiliate;
          }
        }
      }
      json[p.camel] = block;
      if (json.nav) json.nav[p.camel] = p.navLabel;
      if (json.organizationalMemoryEngine) json.organizationalMemoryEngine[p.camel] = p.navLabel;
    }
    fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
    console.log("patched locale", locale);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");

  for (const p of PHASES) {
    const exp = `export * from "./implementation-blueprint-phase${p.phase}-vocabulary";`;
    if (!c.includes(exp)) {
      c = c.replace(
        'export * from "./implementation-blueprint-phase185-vocabulary";',
        `export * from "./implementation-blueprint-phase185-vocabulary";\n${exp}`,
      );
    }
    const constName = `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_PATH`;
    const line = `export const ${constName} =\n  "aipify-core/knowledge/internal-language-model/${p.ilmFile}";`;
    if (!c.includes(constName)) {
      c = c.replace(
        "export const IMPLEMENTATION_BLUEPRINT_PHASE185_PATH =",
        `${line}\n\nexport const IMPLEMENTATION_BLUEPRINT_PHASE185_PATH =`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");

  const entries = [
    {
      phase: 183,
      doc: "HUMANITY_SHARED_PURPOSE_CONTRIBUTION_ENGINE_PHASE183.md",
      title: "Humanity's Shared Purpose & Contribution Engine",
      route: "shared-purpose-contribution-engine",
      nav: "sharedPurposeContributionEngine",
      migration: "20261343000000_humanity_shared_purpose_contribution_engine_phase183.sql",
      helper: "hspc",
      bp: "hspcbp183",
      perms: "shared_purpose_contribution",
      companion: "Contribution Companion",
    },
    {
      phase: 184,
      doc: "HUMANITY_SHARED_RESILIENCE_ADAPTIVE_CAPACITY_ENGINE_PHASE184.md",
      title: "Humanity's Shared Resilience & Adaptive Capacity Engine",
      route: "shared-resilience-adaptive-capacity-engine",
      nav: "sharedResilienceAdaptiveCapacityEngine",
      migration: "20261344000000_humanity_shared_resilience_adaptive_capacity_engine_phase184.sql",
      helper: "hsrac",
      bp: "hsracbp184",
      perms: "shared_resilience_adaptive",
      companion: "Resilience Companion",
    },
    {
      phase: 185,
      doc: "HUMANITY_SHARED_TRUST_COOPERATIVE_INTELLIGENCE_ENGINE_PHASE185.md",
      title: "Humanity's Shared Trust & Cooperative Intelligence Engine",
      route: "shared-trust-cooperative-intelligence-engine",
      nav: "sharedTrustCooperativeIntelligenceEngine",
      migration: "20261345000000_humanity_shared_trust_cooperative_intelligence_engine_phase185.sql",
      helper: "hstci",
      bp: "hstcibp185",
      perms: "shared_trust_cooperative",
      companion: "Cooperation Companion",
    },
    ...PHASES.map((p) => ({
      phase: p.phase,
      doc: `${p.docSlug}_PHASE${p.phase}.md`,
      title: p.title,
      route: p.slug,
      nav: p.camel,
      migration: p.migration,
      helper: p.helper,
      bp: p.bp,
      perms: p.permPrefix,
      companion: p.companion,
    })),
  ];

  for (const e of entries) {
    const line = `**${e.title} (Phase ${e.phase}):** See [${e.doc.replace(".md", "")}](./${e.doc}) — \`/app/${e.route}\`, nav id \`${e.nav}\`, migration \`${e.migration}\`. Helpers \`_${e.helper}_*\`, \`_${e.bp}_*\`. Permissions \`${e.perms}.view\`, \`${e.perms}.manage\`, \`${e.perms}.steward\`. ${e.companion} supports — does NOT replace human judgment.`;
    if (!c.includes(`Phase ${e.phase}):** See [${e.doc.replace(".md", "")}`)) {
      c = c.replace(
        "**Humanity's Collective Wisdom & Shared Learning Engine (Phase 182):**",
        `${line}\n\n**Humanity's Collective Wisdom & Shared Learning Engine (Phase 182):**`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched ARCHITECTURE.md");
}

for (const p of PHASES) {
  genCore(p);
  genTsStack(p);
  genMigration(p);
  genDocs(p);
}

patchNavConfig();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();
patchArchitecture();

console.log("Complete phases 186-188 done");
