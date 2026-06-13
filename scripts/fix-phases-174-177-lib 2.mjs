#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "lib/aipify/human-identity-meaning-engine");

const PHASES = [
  {
    slug: "human-creativity-imagination-engine",
    snake: "human_creativity_imagination",
    bp: "hciabp174",
    readiness: "creative_safety_level",
    mode: "imagination_mode",
    reflections: "imagination_reflections",
    third: "experiments",
    thirdCount: "experiments_count",
    centerMeta: "creativity_center_meta",
    engineMeta: "imagination_engine_meta",
    frameworkMeta: "creative_safety_framework_meta",
    reviewsMeta: "executive_creativity_reviews_meta",
    companionMeta: "creativity_companion_meta",
    engine2Meta: "experimentation_engine_meta",
    engine3Meta: "collective_creativity_engine_meta",
    pascal: "HumanCreativityImagination",
  },
  {
    slug: "human-wisdom-augmented-judgment-engine",
    snake: "human_wisdom_augmented_judgment",
    bp: "hwajbp175",
    readiness: "wisdom_readiness_level",
    mode: "judgment_mode",
    reflections: "wisdom_reflections",
    third: "judgment_notes",
    thirdCount: "judgment_notes_count",
    centerMeta: "wisdom_center_meta",
    engineMeta: "judgment_engine_meta",
    frameworkMeta: "wisdom_framework_meta",
    reviewsMeta: "executive_wisdom_reviews_meta",
    companionMeta: "wisdom_companion_meta",
    engine2Meta: "discernment_engine_meta",
    engine3Meta: "ethical_reflection_engine_meta",
    pascal: "HumanWisdomAugmentedJudgment",
  },
  {
    slug: "human-agency-autonomy-engine",
    snake: "human_agency_responsible_autonomy",
    bp: "haarbp176",
    readiness: "agency_readiness_level",
    mode: "autonomy_mode",
    reflections: "agency_reflections",
    third: "autonomy_notes",
    thirdCount: "autonomy_notes_count",
    centerMeta: "agency_center_meta",
    engineMeta: "autonomy_engine_meta",
    frameworkMeta: "responsible_autonomy_framework_meta",
    reviewsMeta: "executive_agency_reviews_meta",
    companionMeta: "agency_companion_meta",
    engine2Meta: "accountability_engine_meta",
    engine3Meta: "consent_engine_meta",
    pascal: "HumanAgencyAutonomy",
  },
  {
    slug: "human-dignity-humility-engine",
    snake: "human_dignity_technological_humility",
    bp: "hdthbp177",
    readiness: "dignity_readiness_level",
    mode: "humility_mode",
    reflections: "dignity_reflections",
    third: "compassion_notes",
    thirdCount: "compassion_notes_count",
    centerMeta: "dignity_center_meta",
    engineMeta: "human_dignity_engine_meta",
    frameworkMeta: "technological_humility_framework_meta",
    reviewsMeta: "executive_humility_reviews_meta",
    companionMeta: "dignity_companion_meta",
    engine2Meta: "compassion_engine_meta",
    engine3Meta: "human_value_framework_meta",
    pascal: "HumanDignityHumility",
  },
];

function transform(content, p) {
  return content
    .split("human_identity_meaning")
    .join(p.snake)
    .split("HumanIdentityMeaning")
    .join(p.pascal)
    .split("himpbp173")
    .join(p.bp)
    .split("meaning_readiness_level")
    .join(p.readiness)
    .split("discovery_mode")
    .join(p.mode)
    .split("MeaningReflection")
    .join("ReflectionEntry")
    .split("meaning_reflections")
    .join(p.reflections)
    .split("AgencyNote")
    .join("ScaffoldNote")
    .split("agency_notes")
    .join(p.third)
    .split("agency_notes_count")
    .join(p.thirdCount)
    .split("meaning_identity_center_meta")
    .join(p.centerMeta)
    .split("human_identity_engine_meta")
    .join(p.engineMeta)
    .split("meaning_preservation_framework_meta")
    .join(p.frameworkMeta)
    .split("executive_humanity_reviews_meta")
    .join(p.reviewsMeta)
    .split("ExecutiveHumanityReview")
    .join("ExecutiveReview")
    .split("meaning_companion_meta")
    .join(p.companionMeta)
    .split("belonging_engine_meta")
    .join(p.engine2Meta)
    .split("agency_preservation_engine_meta")
    .join(p.engine3Meta);
}

for (const p of PHASES) {
  const dst = path.join(ROOT, `lib/aipify/${p.slug}`);
  fs.mkdirSync(dst, { recursive: true });
  for (const f of ["types.ts", "parse.ts"]) {
    const content = transform(fs.readFileSync(path.join(SRC, f), "utf8"), p);
    fs.writeFileSync(path.join(dst, f), content);
  }
  fs.writeFileSync(path.join(dst, "index.ts"), `export * from "./types";\nexport * from "./parse";\n`);
}

// Fix panels + API to use correct parse names
for (const p of PHASES) {
  const parseName = `parse${p.pascal}Dashboard`;
  const cardName = `parse${p.pascal}Card`;
  const dashType = `${p.pascal}Dashboard`;
  const panelPath = path.join(ROOT, `components/app/${p.slug}/${p.pascal}EngineDashboardPanel.tsx`);

  let panel = fs.readFileSync(path.join(ROOT, "components/app/human-identity-meaning-engine/HumanIdentityMeaningEngineDashboardPanel.tsx"), "utf8");
  panel = transform(panel, p)
    .split("human-identity-meaning-engine")
    .join(p.slug)
    .split("HumanIdentityMeaningEngineDashboardPanel")
    .join(`${p.pascal}EngineDashboardPanel`)
    .split("meaningReflections")
    .join("reflectionsLabel")
    .split("agencyNotes")
    .join("scaffoldNotes")
    .split("humanIdentityMeaningScore")
    .join("scoreLabel")
    .split("discoveryMode")
    .join("modeLabel")
    .split("meaningReadinessLevel")
    .join("readinessLabel")
    .split("meaningIdentityCenter")
    .join("centerLabel")
    .split("humanIdentityEngine")
    .join("engineLabel")
    .split("meaningPreservationFramework")
    .join("frameworkLabel")
    .split("executiveHumanityReviews")
    .join("reviewsLabel")
    .split("meaningCompanion")
    .join("companionLabel")
    .split("belongingEngine")
    .join("subEngineLabel")
    .split("agencyPreservationEngine")
    .join("supportingEngineLabel");

  panel = panel.replace(/parseHuman\w+Dashboard/g, parseName);
  panel = panel.replace(/Human\w+Dashboard(?![P])/g, dashType);
  panel = panel.replace(/MeaningReflection/g, "ReflectionEntry");
  panel = panel.replace(/ExecutiveHumanityReview/g, "ExecutiveReview");
  panel = panel.replace(/AgencyNote/g, "ScaffoldNote");
  panel = panel.replace(/AgencyRow/g, "ScaffoldRow");
  panel = panel.replace(/meaning_identity_center_meta/g, p.centerMeta);
  panel = panel.replace(/human_identity_engine_meta/g, p.engineMeta);
  panel = panel.replace(/meaning_preservation_framework_meta/g, p.frameworkMeta);
  panel = panel.replace(/executive_humanity_reviews_meta/g, p.reviewsMeta);
  panel = panel.replace(/meaning_companion_meta/g, p.companionMeta);
  panel = panel.replace(/belonging_engine_meta/g, p.engine2Meta);
  panel = panel.replace(/agency_preservation_engine_meta/g, p.engine3Meta);
  panel = panel.replace(/meaning_reflections/g, p.reflections);
  panel = panel.replace(/agency_notes/g, p.third);
  panel = panel.replace(/labels\.meaningReflections/g, "labels.reflectionsLabel");
  panel = panel.replace(/labels\.agencyNotes/g, "labels.scaffoldNotes");
  panel = panel.replace(/labels\.humanIdentityMeaningScore/g, "labels.scoreLabel");
  panel = panel.replace(/labels\.discoveryMode/g, "labels.modeLabel");
  panel = panel.replace(/labels\.meaningReadinessLevel/g, "labels.readinessLabel");

  fs.mkdirSync(path.dirname(panelPath), { recursive: true });
  fs.writeFileSync(panelPath, panel);
  fs.writeFileSync(path.join(ROOT, `components/app/${p.slug}/index.ts`), `export { ${p.pascal}EngineDashboardPanel } from "./${p.pascal}EngineDashboardPanel";\n`);

  for (const route of ["dashboard", "card"]) {
    const fn = route === "dashboard" ? parseName : cardName;
    const api = `import { NextResponse } from "next/server";
import { ${fn} } from "@/lib/aipify/${p.slug}";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_${p.snake}_engine_${route}");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(${fn}(data));
  } catch {
    return NextResponse.json({ error: "Failed to load ${route}" }, { status: 500 });
  }
}
`;
    fs.mkdirSync(path.join(ROOT, `app/api/aipify/${p.slug}/${route}`), { recursive: true });
    fs.writeFileSync(path.join(ROOT, `app/api/aipify/${p.slug}/${route}/route.ts`), api);
  }

  // page.tsx
  const camelMap = {
    "human-creativity-imagination-engine": "humanCreativityImaginationEngine",
    "human-wisdom-augmented-judgment-engine": "humanWisdomAugmentedJudgmentEngine",
    "human-agency-autonomy-engine": "humanAgencyAutonomyEngine",
    "human-dignity-humility-engine": "humanDignityHumilityEngine",
  };
  const i18nKey = camelMap[p.slug];

  const page = `import { ${p.pascal}EngineDashboardPanel } from "@/components/app/${p.slug}";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ${p.pascal}EnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.${i18nKey}";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(\`\${p}.title\`)}</h1>
        <p className="mt-2 text-gray-600">{t(\`\${p}.subtitle\`)}</p>
      </div>
      <${p.pascal}EngineDashboardPanel
        labels={{
          loading: t(\`\${p}.loading\`),
          engineTitle: t(\`\${p}.engineTitle\`),
          scoreLabel: t(\`\${p}.scoreLabel\`),
          distinctionNote: t(\`\${p}.distinctionNote\`),
          modeLabel: t(\`\${p}.modeLabel\`),
          readinessLabel: t(\`\${p}.readinessLabel\`),
          executiveReviews: t(\`\${p}.executiveReviews\`),
          activeReflections: t(\`\${p}.activeReflections\`),
          humanOversightRequired: t(\`\${p}.humanOversightRequired\`),
          eraOpenerSummary: t(\`\${p}.eraOpenerSummary\`),
          eraOpenerNote: t(\`\${p}.eraOpenerNote\`),
          centerLabel: t(\`\${p}.centerLabel\`),
          engineLabel: t(\`\${p}.engineLabel\`),
          frameworkLabel: t(\`\${p}.frameworkLabel\`),
          reviewsLabel: t(\`\${p}.reviewsLabel\`),
          companionLabel: t(\`\${p}.companionLabel\`),
          subEngineLabel: t(\`\${p}.subEngineLabel\`),
          supportingEngineLabel: t(\`\${p}.supportingEngineLabel\`),
          reflectionsLabel: t(\`\${p}.reflectionsLabel\`),
          executiveReviewEntries: t(\`\${p}.executiveReviewEntries\`),
          scaffoldNotes: t(\`\${p}.scaffoldNotes\`),
          crossLinks: t(\`\${p}.crossLinks\`),
          blueprintObjectives: t(\`\${p}.blueprintObjectives\`),
          companionLimitations: t(\`\${p}.companionLimitations\`),
          successCriteria: t(\`\${p}.successCriteria\`),
          criterionMet: t(\`\${p}.criterionMet\`),
          criterionPending: t(\`\${p}.criterionPending\`),
        }}
      />
    </div>
  );
}
`;
  fs.mkdirSync(path.join(ROOT, `app/app/${p.slug}`), { recursive: true });
  fs.writeFileSync(path.join(ROOT, `app/app/${p.slug}/page.tsx`), page);
}

console.log("Fixed lib, panels, API, pages");
