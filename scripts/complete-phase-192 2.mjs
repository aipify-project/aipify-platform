#!/usr/bin/env node
/**
 * Complete ABOS Phase 192 — Aipify Ethical Evolution & Responsible Innovation Engine.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 192,
  migration: "20261352000000_aipify_ethical_evolution_responsible_innovation_engine_phase192.sql",
  slug: "aipify-ethical-evolution-responsible-innovation-engine",
  base: "AipifyEthicalEvolutionResponsibleInnovation",
  camel: "aipifyEthicalEvolutionResponsibleInnovationEngine",
  snake: "aipify_ethical_evolution_responsible_innovation",
  permPrefix: "aipify_ethical_evolution_innovation",
  helper: "aeeri",
  bp: "aeeribp192",
  decisionType: "aipify_ethical_evolution_responsible_innovation_engine",
  prevDecision: "aipify_constitution_perpetual_principles_engine",
  title: "Aipify Ethical Evolution & Responsible Innovation",
  centerTitle: "Responsible Innovation Center",
  companion: "Ethics Companion",
  scoreKey: "aipify_ethical_evolution_responsible_innovation_score",
  modeKey: "ethical_evolution_mode",
  levelKey: "innovation_readiness_level",
  thirdEntity: "governance_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_ETHICAL_EVOLUTION_RESPONSIBLE_INNOVATION_ENGINE",
  ilmFile: "implementation-blueprint-phase192-aipify-ethical-evolution-responsible-innovation.txt",
  navLabel: "Ethical Innovation",
  crossLinkNote:
    "Cross-links only: Phase 191 constitution principles, ai_ethics_responsible_use_engine, governance_policy_engine — never duplicate RPCs.",
  ilmExtra: `
Responsible Innovation Center: innovation review programs, leadership reflection sessions, companion ethical guidance, stakeholder impact assessments, governance dashboards, preparedness frameworks, stewardship reviews, innovation knowledge libraries.
Ethical Evolution Engine prompts: Who benefits? Who may be affected? What assumptions require examination? How do we strengthen transparency? What safeguards deserve implementation?
Responsible Innovation Framework: leadership preparedness, human oversight, governance participation, stakeholder engagement, Growth Partner alignment, knowledge accessibility, long-term consequences.
Executive Ethics Reviews, Ethics Companion, Innovation Governance Engine, Transparency Engine.
Companion limitations: no overriding leadership, no defining moral truth, no suppressing disagreement, no replacing governance, no enforcing ideological conformity.`,
  faqBody: `## What is Ethical Evolution?

Ethical Evolution refers to strengthening an organization's ability to innovate responsibly while preserving human dignity and trust — at \`/app/aipify-ethical-evolution-responsible-innovation-engine\`.

## Can Aipify determine what is morally correct?

**No.** Aipify supports reflection, preparedness, and governance. Human leadership remains responsible.

## Why focus on responsible innovation?

Because capability without stewardship may produce unintended consequences.

## Can organizations innovate quickly while remaining responsible?

Yes. Responsible innovation balances progress with preparedness and oversight.

## Why include Self Love?

Because humility, compassion, and self-awareness strengthen wise decision-making.`,
  companionLimitations: [
    "override_leadership_authority",
    "define_moral_truth",
    "suppress_disagreement",
    "replace_governance_structures",
    "enforce_ideological_conformity",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom191(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyConstitutionPerpetualPrinciples", P.base],
    ["aipify-constitution-perpetual-principles-engine", P.slug],
    ["aipify_constitution_perpetual_principles", P.snake],
    ["aipifyConstitutionPerpetualPrinciples", P.camel.replace(/Engine$/, "")],
    ["aipifyConstitutionPerpetualPrinciplesEngine", P.camel],
    ["acppbp191", P.bp],
    ["_acpp_", `_${P.helper}_`],
    ["aipify_constitution_perpetual_principles_score", P.scoreKey],
    ["constitutional_mode", P.modeKey],
    ["principles_readiness_level", P.levelKey],
    ["principles_notes", P.thirdEntity],
    ["PrinciplesNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["principles_notes_count", `${P.thirdEntity}_count`],
    ["Constitutional Governance Center", P.centerTitle],
    ["Constitution Companion", P.companion],
    ["Aipify Constitution & Perpetual Principles", P.title],
    ["Constitution & Perpetual Principles", "Ethical Evolution & Responsible Innovation"],
    ["Phase 191", `Phase ${P.phase}`],
    ["aipify_constitution_perpetual_principles_engine", P.decisionType],
    ["aipify_constitution_principles.view", `${P.permPrefix}.view`],
    ["aipify_constitution_principles.manage", `${P.permPrefix}.manage`],
    ["aipify_constitution_principles.steward", `${P.permPrefix}.steward`],
    [
      "20261351000000_aipify_constitution_perpetual_principles_engine_phase191.sql",
      P.migration,
    ],
    ["Repo Phase 191", `Repo Phase ${P.phase}`],
    ["Phase 191 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE191_AIPIFY_CONSTITUTION_PERPETUAL_PRINCIPLES_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase191", `implementation-blueprint-phase${P.phase}`],
    ["constitutional_center", "responsible_innovation_center"],
    ["principles_engine", "ethical_evolution_engine"],
    ["perpetual_principles_framework", "responsible_innovation_framework"],
    ["constitutional_review_council", "executive_ethics_reviews"],
    ["constitution_companion", "ethics_companion"],
    ["humanity_engine", "innovation_governance_engine"],
    ["Constitutional Review Council", "Executive Ethics Reviews"],
    ["Ten Articles", "Ethical reflection"],
    ["constitutional", "ethical_evolution"],
    ["Constitutional", "Ethical"],
    ["Perpetual Stewardship era opener", "Perpetual Stewardship era engine"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function genCore() {
  const engine = `${P.base}Engine`;
  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    `/**
 * ${P.title} Engine helpers (Phase ${P.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${P.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function get${engine}Dashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${engine}Card(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_card");
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

function genTsStack() {
  const engine = `${P.base}Engine`;
  const srcDir = path.join(ROOT, "lib/aipify/aipify-constitution-perpetual-principles-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dstDir, f), transformFrom191(fs.readFileSync(path.join(srcDir, f), "utf8")));
  }

  const panelSrc = path.join(
    ROOT,
    `components/app/aipify-constitution-perpetual-principles-engine/AipifyConstitutionPerpetualPrinciplesEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom191(fs.readFileSync(panelSrc, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`,
  );

  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom191(
      fs.readFileSync(
        path.join(ROOT, "app/app/aipify-constitution-perpetual-principles-engine/page.tsx"),
        "utf8",
      ),
    ),
  );

  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom191(
        fs.readFileSync(
          path.join(ROOT, `app/api/aipify/aipify-constitution-perpetual-principles-engine/${route}/route.ts`),
          "utf8",
        ),
      ),
    );
  }
}

function blueprintSqlBlock() {
  const bp = P.bp;
  const h = P.helper;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports awareness — NOT replace human judgment or define moral truth. Cross-link Phase 191 constitution, ai_ethics_responsible_use_engine. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations evolve ethically alongside technological capabilities — reflection, accountability, and human-centered stewardship without fear or paralysis.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Innovation deserves reflection; humans decide; ${P.companion} informs and prepares.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations that ask not only Can we build this? but Should we build this? — innovation guided by stewardship.'; ${D};
create or replace function public._${bp}_responsible_innovation_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'innovation_reviews', 'label', 'Innovation review programs'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection sessions'),
    jsonb_build_object('key', 'companion_guidance', 'label', 'Companion ethical guidance'),
    jsonb_build_object('key', 'stakeholder_assessments', 'label', 'Stakeholder impact assessments'),
    jsonb_build_object('key', 'governance_dashboards', 'label', 'Governance dashboards'),
    jsonb_build_object('key', 'preparedness_frameworks', 'label', 'Preparedness frameworks'),
    jsonb_build_object('key', 'stewardship_reviews', 'label', 'Stewardship reviews'),
    jsonb_build_object('key', 'innovation_libraries', 'label', 'Innovation knowledge libraries')
  )); ${D};
create or replace function public._${bp}_ethical_evolution_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Ethical evolution reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'who_benefits', 'label', 'Who benefits from this innovation?'),
    jsonb_build_object('key', 'who_affected', 'label', 'Who may be unintentionally affected?'),
    jsonb_build_object('key', 'assumptions', 'label', 'What assumptions require examination?'),
    jsonb_build_object('key', 'transparency', 'label', 'How do we strengthen transparency?'),
    jsonb_build_object('key', 'safeguards', 'label', 'What safeguards deserve implementation?')
  )); ${D};
create or replace function public._${bp}_responsible_innovation_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Responsible innovation framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_preparedness', 'label', 'Leadership preparedness'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight practices'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation'),
    jsonb_build_object('key', 'stakeholder_engagement', 'label', 'Stakeholder engagement'),
    jsonb_build_object('key', 'growth_partner_alignment', 'label', 'Growth Partner alignment'),
    jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility'),
    jsonb_build_object('key', 'long_term_consequences', 'label', 'Long-term consequences')
  )); ${D};
create or replace function public._${bp}_executive_ethics_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive ethics reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'values_guide', 'label', 'What values guide our innovation?'),
    jsonb_build_object('key', 'preserve_trust', 'label', 'How do we preserve trust?'),
    jsonb_build_object('key', 'unintended_consequences', 'label', 'What unintended consequences deserve attention?'),
    jsonb_build_object('key', 'transparency', 'label', 'How do we encourage transparency?'),
    jsonb_build_object('key', 'strengthen_stewardship', 'label', 'How do we strengthen stewardship?')
  )); ${D};
create or replace function public._${bp}_ethics_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports awareness, does not replace judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'governance_summaries', 'label', 'Governance summaries'),
    jsonb_build_object('key', 'preparedness_briefings', 'label', 'Preparedness briefings'),
    jsonb_build_object('key', 'stakeholder_insights', 'label', 'Stakeholder insights'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'stewardship_reviews', 'label', 'Stewardship reviews')
  )); ${D};
create or replace function public._${bp}_innovation_governance_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation governance engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'ethics_panels', 'label', 'Ethics review panels'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection'),
    jsonb_build_object('key', 'growth_partner_participation', 'label', 'Growth Partner participation'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight mechanisms'),
    jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship'),
    jsonb_build_object('key', 'cross_functional_governance', 'label', 'Cross-functional governance')
  )); ${D};
create or replace function public._${bp}_transparency_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Transparency engine — openness and accountability.', 'characteristics', jsonb_build_array(
    jsonb_build_object('key', 'openness', 'label', 'Openness'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability'),
    jsonb_build_object('key', 'preparedness', 'label', 'Preparedness'),
    jsonb_build_object('key', 'stakeholder_awareness', 'label', 'Stakeholder awareness'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation'),
    jsonb_build_object('key', 'institutional_integrity', 'label', 'Institutional integrity')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Override leadership authority',
      'Define moral truth',
      'Suppress disagreement',
      'Replace governance structures',
      'Enforce ideological conformity'), 'principle', '${P.companion} supports — humans decide.'); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 191, 'key', 'constitution_principles', 'label', 'Constitution & Principles Phase 191', 'route', '/app/aipify-constitution-perpetual-principles-engine', 'description', 'Era opener — cross-link only'),
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/${P.slug}', 'description', 'Responsible innovation')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'ai_ethics', 'label', 'AI Ethics & Responsible Use Engine', 'route', '/app/ai-ethics-responsible-use-engine', 'relationship', 'Ethics governance — cross-link only'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance Policy Engine', 'route', '/app/governance-policy-engine', 'relationship', 'Policy alignment — cross-link only'),
    jsonb_build_object('key', 'constitution_98', 'label', 'Aipify Constitution Phase 98', 'route', '/app/constitution', 'relationship', 'Core principles — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Humility and compassion — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only ethics reviews and reflection scaffolds. Growth Partner terminology. ${P.companion} supports — never replaces human judgment.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and prepares.', 'Reflection strengthens responsibility.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; ${D};
`.trim();
}

function patchMigrationBlueprint(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );

  if (!sql.includes(`'${P.decisionType}'`)) {
    sql = sql.replace(
      `'${P.prevDecision}'`,
      `'${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  }

  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSqlBlock() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_responsible_innovation_center\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${P.bp}_responsible_innovation_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_ethical_evolution_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Ethical evolution — five questions', 'met', jsonb_array_length(public._${P.bp}_ethical_evolution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );
  sql = sql.replace(
    /'responsible_innovation_center', public\._\w+_responsible_innovation_center\(\), 'ethical_evolution_engine', public\._\w+_ethical_evolution_engine\(\), 'responsible_innovation_framework', public\._\w+_responsible_innovation_framework\(\),/,
    `'responsible_innovation_center', public._${P.bp}_responsible_innovation_center(), 'ethical_evolution_engine', public._${P.bp}_ethical_evolution_engine(), 'responsible_innovation_framework', public._${P.bp}_responsible_innovation_framework(),`,
  );
  sql = sql.replace(
    /'executive_ethics_reviews', public\._\w+_executive_ethics_reviews\(\), 'ethics_companion', public\._\w+_ethics_companion\(\), 'innovation_governance_engine', public\._\w+_innovation_governance_engine\(\),/,
    `'executive_ethics_reviews', public._${P.bp}_executive_ethics_reviews(), 'ethics_companion', public._${P.bp}_ethics_companion(), 'innovation_governance_engine', public._${P.bp}_innovation_governance_engine(),`,
  );

  sql = sql.replace(
    /select 'aipify-ethical-evolution-responsible-innovation-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 197
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify Ethical Evolution[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — responsible innovation within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    /'phase', 'Phase 192 —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase 192', 'route', '[^']+'/g,
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(/center_meta', public\._\w+_responsible_innovation_center\(\)/g, `center_meta', public._${P.bp}_responsible_innovation_center()`);
  sql = sql.replace(/engine_meta', public\._\w+_ethical_evolution_engine\(\)/g, `engine_meta', public._${P.bp}_ethical_evolution_engine()`);
  sql = sql.replace(/framework_meta', public\._\w+_responsible_innovation_framework\(\)/g, `framework_meta', public._${P.bp}_responsible_innovation_framework()`);
  sql = sql.replace(/executive_reviews_meta', public\._\w+_executive_ethics_reviews\(\)/g, `executive_reviews_meta', public._${P.bp}_executive_ethics_reviews()`);
  sql = sql.replace(/companion_meta', public\._\w+_ethics_companion\(\)/g, `companion_meta', public._${P.bp}_ethics_companion()`);
  sql = sql.replace(/sub_engine_meta', public\._\w+_innovation_governance_engine\(\)/g, `sub_engine_meta', public._${P.bp}_innovation_governance_engine()`);

  if (!sql.includes("_transparency_engine")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${P.bp}_innovation_governance_engine(),`,
      `'sub_engine_meta', public._${P.bp}_innovation_governance_engine(), 'transparency_engine_meta', public._${P.bp}_transparency_engine(),`,
    );
  }

  return sql;
}

function genMigration() {
  let m = transformFrom191(
    fs.readFileSync(
      path.join(
        ROOT,
        "supabase/migrations/20261351000000_aipify_constitution_perpetual_principles_engine_phase191.sql",
      ),
      "utf8",
    ),
  );
  m = m.replace(/_acpp_seed_principles_notes/g, `_${P.helper}_seed_governance_notes`);
  m = m.replace(/principles_notes/g, P.thirdEntity);
  m = patchMigrationBlueprint(m);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), m);
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports ethical awareness — does NOT define moral truth or override leadership.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );

  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title}

Route: \`/app/${P.slug}\`
Era: ${P.era}
${P.crossLinkNote}
`,
  );

  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );

  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}
Era: ${P.era}
${P.centerTitle}: innovation reviews, ethics reflection, stakeholder assessments, governance dashboards.
${P.companion} supports awareness — NOT replace human judgment.
${P.crossLinkNote}
People First. Wisdom before speed. Growth Partner — never Affiliate.
${P.ilmExtra}`,
  );

  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION =
  "${P.centerTitle} — ${P.companion} supports; humans retain judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_PHILOSOPHY =
  "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";

export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [
${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}
] as const;
`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports ethical reflection and metadata scaffolds. Supports humans — does NOT define moral truth or override leadership. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive ethics reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Ethical evolution engine — reflection prompts",
    frameworkLabel: "Responsible innovation framework",
    reviewsLabel: "Executive ethics reviews",
    companionLabel: `${P.companion} — supports, does not replace judgment`,
    subEngineLabel: "Innovation governance engine",
    reflections: "Ethics reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT define moral truth`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports ethical awareness — humans retain judgment and governance responsibility.`,
      philosophy: "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNavConfig() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace(
      '| "aipifyConstitutionPerpetualPrinciplesEngine"',
      `| "aipifyConstitutionPerpetualPrinciplesEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyConstitutionPerpetualPrinciplesEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyConstitutionPerpetualPrinciplesEngine",\n  },/,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-constitution-perpetual-principles-engine")) {\n    return "aipifyConstitutionPerpetualPrinciplesEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-constitution-perpetual-principles-engine")) {\n    return "aipifyConstitutionPerpetualPrinciplesEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched nav-config");
}

function patchPermissions() {
  const file = path.join(ROOT, "lib/core/permissions.ts");
  let c = fs.readFileSync(file, "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_constitution_principles.steward",',
        `"aipify_constitution_principles.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(file, c);
  console.log("patched permissions");
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-constitution-perpetual-principles-engine";',
      `export * from "./aipify-constitution-perpetual-principles-engine";\nexport * from "./${P.slug}";`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched tenant");
}

function patchI18n() {
  const block = i18nBlock();
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.nav = data.nav ?? {};
    data.nav[P.camel] =
      locale === "no"
        ? "Etisk innovasjon"
        : locale === "sv"
          ? "Etisk innovation"
          : locale === "da"
            ? "Etisk innovation"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase191-vocabulary";',
      `export * from "./implementation-blueprint-phase191-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpusPath = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpusPath)) {
    c = c.replace(
      '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase191-aipify-constitution-perpetual-principles.txt";',
      `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase191-aipify-constitution-perpetual-principles.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpusPath}";`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Ethical Evolution & Responsible Innovation Engine (Phase 192):** See [AIPIFY_ETHICAL_EVOLUTION_RESPONSIBLE_INNOVATION_ENGINE_PHASE192.md](./AIPIFY_ETHICAL_EVOLUTION_RESPONSIBLE_INNOVATION_ENGINE_PHASE192.md) — ${P.centerTitle} for innovation review programs, leadership reflection, companion ethical guidance, stakeholder impact assessments, governance dashboards, preparedness frameworks, stewardship reviews, and innovation knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports awareness — **NOT** define moral truth or override leadership. Cross-links only: Phase 191 constitution principles, ai_ethics_responsible_use_engine, governance_policy_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 192")) {
    const marker = "Permissions `aipify_constitution_principles.steward`.";
    const idx = c.indexOf(marker);
    if (idx !== -1) c = c.slice(0, idx + marker.length) + entry + c.slice(idx + marker.length);
  }
  fs.writeFileSync(file, c);
  console.log("patched ARCHITECTURE.md");
}

genCore();
genTsStack();
genMigration();
genDocs();
patchNavConfig();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();
patchArchitecture();
console.log("Phase 192 complete");
