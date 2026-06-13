#!/usr/bin/env node
/**
 * Generate ABOS Phases 179–182 full-stack from Phase 178 (Human Hope) patterns.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const PHASES = [
  {
    phase: 179,
    migration: "20261339000000_human_wonder_exploration_engine_phase179.sql",
    slug: "human-wonder-exploration-engine",
    camel: "humanWonderExplorationEngine",
    pascal: "HumanWonderExplorationEngine",
    snake: "human_wonder_exploration",
    permPrefix: "human_wonder_exploration",
    helper: "hwe",
    bp: "hwebp179",
    decisionType: "human_wonder_exploration_engine",
    title: "Human Wonder & Exploration",
    centerTitle: "Wonder & Exploration Center",
    companion: "Wonder Companion",
    scoreKey: "human_wonder_exploration_score",
    modeKey: "wonder_mode",
    levelKey: "wonder_readiness_level",
    thirdEntity: "exploration_notes",
    reflectionsKey: "wonder_reflections",
    era: "Cosmic Stewardship & Multi-Generational Futures Era (171–180)",
    eraRange: "171–180",
    prevDecision: "human_hope_possibility_engine",
    docSlug: "HUMAN_WONDER_EXPLORATION_ENGINE",
    ilmFile: "implementation-blueprint-phase179-human-wonder-exploration.txt",
    kcSort: 190,
    faqExtra: "Wonder Companion supports curiosity — does NOT replace exploration or determine what deserves wonder.",
  },
  {
    phase: 180,
    migration: "20261340000000_human_legacy_eternal_stewardship_engine_phase180.sql",
    slug: "human-legacy-eternal-stewardship-engine",
    camel: "humanLegacyEternalStewardshipEngine",
    pascal: "HumanLegacyEternalStewardshipEngine",
    snake: "human_legacy_eternal_stewardship",
    permPrefix: "human_legacy_stewardship",
    helper: "hles",
    bp: "hlesbp180",
    decisionType: "human_legacy_eternal_stewardship_engine",
    title: "Human Legacy & Eternal Stewardship",
    centerTitle: "Legacy & Eternal Stewardship Center",
    companion: "Legacy Companion",
    scoreKey: "human_legacy_stewardship_score",
    modeKey: "stewardship_mode",
    levelKey: "legacy_readiness_level",
    thirdEntity: "stewardship_notes",
    reflectionsKey: "legacy_reflections",
    era: "Cosmic Stewardship & Multi-Generational Futures Era (171–180) — era capstone",
    eraRange: "171–180",
    prevDecision: "human_wonder_exploration_engine",
    docSlug: "HUMAN_LEGACY_ETERNAL_STEWARDSHIP_ENGINE",
    ilmFile: "implementation-blueprint-phase180-human-legacy-eternal-stewardship.txt",
    kcSort: 191,
    faqExtra: "Legacy Companion supports stewardship reflection — does NOT define legacy or replace leadership accountability.",
  },
  {
    phase: 181,
    migration: "20261341000000_universal_stewardship_shared_futures_engine_phase181.sql",
    slug: "universal-stewardship-shared-futures-engine",
    camel: "universalStewardshipSharedFuturesEngine",
    pascal: "UniversalStewardshipSharedFuturesEngine",
    snake: "universal_stewardship_shared_futures",
    permPrefix: "universal_stewardship_futures",
    helper: "hsfus",
    bp: "hsfusbp181",
    decisionType: "universal_stewardship_shared_futures_engine",
    title: "Universal Stewardship & Shared Futures",
    centerTitle: "Universal Stewardship Center",
    companion: "Stewardship Companion",
    scoreKey: "universal_stewardship_futures_score",
    modeKey: "stewardship_mode",
    levelKey: "futures_readiness_level",
    thirdEntity: "futures_notes",
    reflectionsKey: "stewardship_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190) — era opener",
    eraRange: "181–190",
    prevDecision: "human_legacy_eternal_stewardship_engine",
    docSlug: "UNIVERSAL_STEWARDSHIP_SHARED_FUTURES_ENGINE",
    ilmFile: "implementation-blueprint-phase181-universal-stewardship-shared-futures.txt",
    kcSort: 192,
    faqExtra: "Stewardship Companion supports shared futures reflection — does NOT predict outcomes or override collective governance.",
  },
  {
    phase: 182,
    migration: "20261342000000_humanity_collective_wisdom_shared_learning_engine_phase182.sql",
    slug: "collective-wisdom-shared-learning-engine",
    camel: "collectiveWisdomSharedLearningEngine",
    pascal: "CollectiveWisdomSharedLearningEngine",
    snake: "humanity_collective_wisdom_shared_learning",
    permPrefix: "collective_wisdom_learning",
    helper: "hcwsl",
    bp: "hcwslbp182",
    decisionType: "humanity_collective_wisdom_shared_learning_engine",
    title: "Humanity's Collective Wisdom & Shared Learning",
    centerTitle: "Collective Wisdom Center",
    companion: "Learning Companion",
    scoreKey: "collective_wisdom_learning_score",
    modeKey: "learning_mode",
    levelKey: "wisdom_readiness_level",
    thirdEntity: "learning_notes",
    reflectionsKey: "wisdom_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "universal_stewardship_shared_futures_engine",
    docSlug: "HUMANITY_COLLECTIVE_WISDOM_SHARED_LEARNING_ENGINE",
    ilmFile: "implementation-blueprint-phase182-collective-wisdom-shared-learning.txt",
    kcSort: 193,
    faqExtra: "Learning Companion supports growth — does NOT replace curiosity, suppress perspectives, or determine what knowledge matters most.",
  },
];

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformHope(content, p) {
  const pairs = [
    ["HumanHopePossibility", p.pascal],
    ["human-hope-possibility-engine", p.slug],
    ["human_hope_possibility", p.snake],
    ["humanHopePossibility", p.camel.replace(/Engine$/, "")],
    ["humanHopePossibilityEngine", p.camel],
    ["hhcpbp178", p.bp],
    ["_hhcp_", `_${p.helper}_`],
    ["human_hope_possibility_score", p.scoreKey],
    ["hope_mode", p.modeKey],
    ["hope_readiness_level", p.levelKey],
    ["hope_reflections", p.reflectionsKey],
    ["possibility_notes", p.thirdEntity],
    ["PossibilityNote", p.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("")],
    ["possibility_notes_count", `${p.thirdEntity}_count`],
    ["Collective Possibility Center", p.centerTitle],
    ["Collective Possibility", p.centerTitle.replace(" Center", "")],
    ["Hope Companion", p.companion],
    ["Human Hope & Collective Possibility", p.title],
    ["Phase 178", `Phase ${p.phase}`],
    ["171–178", p.eraRange.includes("181") ? "181–182" : `171–${p.phase}`],
    ["Era 171–178", p.eraRange.includes("181") ? "Era 181–190" : `Era 171–${p.phase}`],
    ["human_hope_possibility_engine", p.decisionType],
    ["human_hope_possibility.view", `${p.permPrefix}.view`],
    ["human_hope_possibility.manage", `${p.permPrefix}.manage`],
    ["human_hope_possibility.steward", `${p.permPrefix}.steward`],
    ["20261338000000_human_hope_collective_possibility_engine_phase178.sql", p.migration],
    ["IMPLEMENTATION_BLUEPRINT_PHASE178_HUMAN_HOPE_COLLECTIVE_POSSIBILITY.md", `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.docSlug}.md`],
    ["Human Hope & Collective Possibility Phase 178", `${p.title} Phase ${p.phase}`],
    ["Cosmic Stewardship & Multi-Generational Futures Era (171–180)", p.era],
    ["scoreLabel", "scoreLabel"],
  ];
  let c = content;
  for (const [from, to] of pairs) {
    c = c.split(from).join(to);
  }
  return c;
}

function genCore(p) {
  write(
    path.join(ROOT, `lib/core/${p.slug}.ts`),
    `/**
 * ${p.title} Engine helpers (Phase ${p.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${p.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function get${p.pascal}Dashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${p.pascal}Card(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function create${p.pascal}AuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
`,
  );
}

function genTsStack(p) {
  const srcDir = path.join(ROOT, "lib/aipify/human-hope-possibility-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${p.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dstDir, f), transformHope(fs.readFileSync(path.join(srcDir, f), "utf8"), p));
  }

  const panelSrc = path.join(
    ROOT,
    "components/app/human-hope-possibility-engine/HumanHopePossibilityEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/${p.pascal}DashboardPanel.tsx`),
    transformHope(fs.readFileSync(panelSrc, "utf8"), p),
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/index.ts`),
    `export { ${p.pascal}DashboardPanel } from "./${p.pascal}DashboardPanel";\n`,
  );

  const pageSrc = fs.readFileSync(path.join(ROOT, "app/app/human-hope-possibility-engine/page.tsx"), "utf8");
  write(path.join(ROOT, `app/app/${p.slug}/page.tsx`), transformHope(pageSrc, p));

  for (const route of ["dashboard", "card"]) {
    const apiSrc = fs.readFileSync(
      path.join(ROOT, `app/api/aipify/human-hope-possibility-engine/${route}/route.ts`),
      "utf8",
    );
    write(path.join(ROOT, `app/api/aipify/${p.slug}/${route}/route.ts`), transformHope(apiSrc, p));
  }
}

function genMigration(p) {
  let m = transformHope(
    fs.readFileSync(
      path.join(ROOT, "supabase/migrations/20261338000000_human_hope_collective_possibility_engine_phase178.sql"),
      "utf8",
    ),
    p,
  );
  m = m.replace(`'${p.prevDecision}'`, `'${p.prevDecision}',\n    '${p.decisionType}'`);
  if (p.phase === 182) {
    m = m.replace(
      /Cross-link Phase 171/g,
      "Cross-link civilizational_learning_engine, Phase 181 universal stewardship, organizational_memory, learning engine",
    );
    m = m.replace(/hope_engine/g, "civilizational_learning_engine");
  }
  write(path.join(ROOT, `supabase/migrations/${p.migration}`), m);
}

function genDocs(p) {
  const phaseDoc = `# ${p.title} Engine — Phase ${p.phase}

## Vision

${p.centerTitle} within the ${p.era}. ${p.companion} supports — does NOT replace human judgment, responsibility, or dignity.

## What was built

| Layer | Location |
|-------|----------|
| Migration | \`supabase/migrations/${p.migration}\` |
| Lib | \`lib/aipify/${p.slug}/\` |
| Core helpers | \`lib/core/${p.slug}.ts\` |
| API | \`/api/aipify/${p.slug}/dashboard\`, \`/card\` |
| UI | \`/app/${p.slug}\` |
| KC FAQ | \`content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md\` |
| Blueprint | \`IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.docSlug}.md\` |

## Principle

People First. Wisdom before speed. Growth Partner terminology — never Affiliate. Metadata only — not surveillance or worth scoring.

## Permissions

- \`${p.permPrefix}.view\` — view ${p.centerTitle}
- \`${p.permPrefix}.manage\` — update settings
- \`${p.permPrefix}.steward\` — conduct executive reviews and record metadata scaffolds

## Helpers

- Engine: \`_${p.helper}_*\`
- Blueprint: \`_${p.bp}_*\`
`;
  write(path.join(ROOT, `${p.docSlug}_PHASE${p.phase}.md`), phaseDoc);

  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.docSlug}.md`),
    `# Implementation Blueprint — Phase ${p.phase} ${p.title}

## Route

\`/app/${p.slug}\`

## Era

${p.era}

## RPCs

- \`get_${p.snake}_engine_dashboard(p_org_id)\`
- \`get_${p.snake}_engine_card(p_org_id)\`

## Privacy

Metadata scaffolds only. ${p.companion} supports awareness — humans decide.
`,
  );

  const faqQuestions =
    p.phase === 182
      ? `## What is the Collective Wisdom Center?

The Collective Wisdom Center at \`/app/${p.slug}\` supports knowledge stewardship programs, cross-generational learning, companion learning sessions, leadership reflection reviews, institutional wisdom libraries, Growth Partner learning networks, and collective intelligence experiences.

## Does the Learning Companion replace human understanding?

**No.** The Learning Companion supports growth — it does NOT replace curiosity, suppress perspectives, or determine what knowledge matters most.

## What are companion limitations?

- No absolute certainty
- No replacing curiosity
- No suppressing perspectives
- No determining what knowledge matters most
- No overriding leadership

## How does Self Love connect to learning?

Curiosity, humility, patience, confidence, compassion, and continuous growth — learning as stewardship, not performance surveillance.

## What surfaces cross-link only?

civilizational_learning_engine, Phase 181 universal stewardship, organizational_memory, and Learning Engine — never duplicate RPCs.`
      : `## What is the ${p.centerTitle}?

The ${p.centerTitle} at \`/app/${p.slug}\` is part of the **${p.era.split("—")[0].trim()}**. ${p.companion} supports reflection and metadata scaffolds — **not** replacement of human judgment, responsibility, or dignity.

## Does ${p.companion} decide for humans?

**No.** ${p.companion} provides informational support only. Humans retain final accountability.

## What are the permissions?

| Permission | Purpose |
|------------|---------|
| \`${p.permPrefix}.view\` | View center and scaffolds |
| \`${p.permPrefix}.manage\` | Update settings |
| \`${p.permPrefix}.steward\` | Record executive reviews and metadata |

## Is Growth Partner terminology used?

**Yes.** Growth Partner — never Affiliate.

## ${p.faqExtra.split("—")[0]}?

${p.faqExtra}`;

  write(
    path.join(ROOT, `content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md`),
    `# ${p.title} Engine — FAQ (Phase ${p.phase})

${faqQuestions}
`,
  );

  const ilmBody =
    p.phase === 182
      ? `ABOS Phase ${p.phase} — ${p.title}
Route: /app/${p.slug}
Era: Universal Stewardship & Shared Futures (181–190)
Collective Wisdom Center: knowledge stewardship, cross-generational learning, companion learning sessions, leadership reflection reviews, institutional wisdom libraries, Growth Partner learning networks.
Shared Learning Framework: knowledge accessibility, leadership development, learning participation, mentorship, institutional memory, cross-functional collaboration.
Learning Companion supports growth — NOT replace understanding. No absolute certainty. No suppressing perspectives.
Self Love in learning: curiosity, humility, patience, confidence, compassion, continuous growth.
Cross-links only: civilizational_learning_engine, Phase 181 universal stewardship, organizational_memory, learning engine.
People First. Wisdom before speed. Growth Partner — never Affiliate.
`
      : `ABOS Phase ${p.phase} — ${p.title}
Route: /app/${p.slug}
Era: ${p.era}
Companion: ${p.companion} — supports, does not replace human judgment.
People First. Wisdom before speed. Growth Partner — never Affiliate.
`;

  write(path.join(ROOT, `aipify-core/knowledge/internal-language-model/${p.ilmFile}`), ilmBody);

  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${p.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_MISSION =
  "${p.centerTitle} — ${p.companion} supports; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_PHILOSOPHY =
  "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_ROUTE = "/app/${p.slug}";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_COMPANION_LIMITATIONS = [
  "replace_human_judgment",
  "assign_worth_or_rank",
  "suppress_individuality",
  "override_leadership_ethics",
  "claim_authorship_or_moral_authority",
] as const;
`,
  );
}

for (const p of PHASES) {
  genCore(p);
  genTsStack(p);
  genMigration(p);
  genDocs(p);
}

console.log("Done generating phases 179-182");
