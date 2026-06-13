#!/usr/bin/env node
/**
 * Patch nav, permissions references, and i18n for ABOS Phases 174–182.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const ENGINES = [
  {
    phase: 175,
    navId: "humanWisdomAugmentedJudgmentEngine",
    slug: "human-wisdom-augmented-judgment-engine",
    i18nKey: "humanWisdomAugmentedJudgmentEngine",
    navLabel: "Wisdom & Judgment",
    permPrefix: "human_wisdom_judgment",
    title: "Wisdom & Judgment Center",
    engineTitle: "Human Wisdom & Augmented Judgment Engine (Phase 175)",
    scoreKey: "humanWisdomAugmentedJudgmentScore",
    era: "171–180",
    companion: "Wisdom Companion",
    pageStyle: "wisdom",
  },
  {
    phase: 176,
    navId: "humanAgencyAutonomyEngine",
    slug: "human-agency-autonomy-engine",
    i18nKey: "humanAgencyAutonomyEngine",
    navLabel: "Agency & Autonomy",
    permPrefix: "human_agency_autonomy",
    title: "Agency & Autonomy Center",
    engineTitle: "Human Agency & Responsible Autonomy Engine (Phase 176)",
    scoreKey: "humanAgencyAutonomyScore",
    era: "171–180",
    companion: "Agency Companion",
    pageStyle: "wisdom",
  },
  {
    phase: 177,
    navId: "humanDignityHumilityEngine",
    slug: "human-dignity-humility-engine",
    i18nKey: "humanDignityHumilityEngine",
    navLabel: "Dignity & Humility",
    permPrefix: "human_dignity_humility",
    title: "Dignity Center",
    engineTitle: "Human Dignity & Technological Humility Engine (Phase 177)",
    scoreKey: "humanDignityHumilityScore",
    era: "171–180",
    companion: "Dignity Companion",
    pageStyle: "wisdom",
  },
  {
    phase: 178,
    navId: "humanHopePossibilityEngine",
    slug: "human-hope-possibility-engine",
    i18nKey: "humanHopePossibilityEngine",
    navLabel: "Hope & Possibility",
    permPrefix: "human_hope_possibility",
    title: "Collective Possibility Center",
    engineTitle: "Human Hope & Collective Possibility Engine (Phase 178)",
    scoreKey: "scoreLabel",
    era: "171–180",
    companion: "Hope Companion",
    pageStyle: "hope",
  },
  {
    phase: 179,
    navId: "humanWonderExplorationEngine",
    slug: "human-wonder-exploration-engine",
    i18nKey: "humanWonderExplorationEngine",
    navLabel: "Wonder & Exploration",
    permPrefix: "human_wonder_exploration",
    title: "Wonder & Exploration Center",
    engineTitle: "Human Wonder & Exploration Engine (Phase 179)",
    era: "171–180",
    companion: "Wonder Companion",
    pageStyle: "hope",
  },
  {
    phase: 180,
    navId: "humanLegacyEternalStewardshipEngine",
    slug: "human-legacy-eternal-stewardship-engine",
    i18nKey: "humanLegacyEternalStewardshipEngine",
    navLabel: "Legacy Stewardship",
    permPrefix: "human_legacy_stewardship",
    title: "Legacy & Eternal Stewardship Center",
    engineTitle: "Human Legacy & Eternal Stewardship Engine (Phase 180)",
    era: "171–180",
    companion: "Legacy Companion",
    pageStyle: "hope",
  },
  {
    phase: 181,
    navId: "universalStewardshipSharedFuturesEngine",
    slug: "universal-stewardship-shared-futures-engine",
    i18nKey: "universalStewardshipSharedFuturesEngine",
    navLabel: "Universal Stewardship",
    permPrefix: "universal_stewardship_futures",
    title: "Universal Stewardship Center",
    engineTitle: "Universal Stewardship & Shared Futures Engine (Phase 181)",
    era: "181–190",
    companion: "Stewardship Companion",
    pageStyle: "hope",
  },
  {
    phase: 182,
    navId: "collectiveWisdomSharedLearningEngine",
    slug: "collective-wisdom-shared-learning-engine",
    i18nKey: "collectiveWisdomSharedLearningEngine",
    navLabel: "Collective Wisdom",
    permPrefix: "collective_wisdom_learning",
    title: "Collective Wisdom Center",
    engineTitle: "Humanity's Collective Wisdom & Shared Learning Engine (Phase 182)",
    era: "181–190",
    companion: "Learning Companion",
    pageStyle: "hope",
  },
];

function hopeI18nBlock(e) {
  return {
    title: e.title,
    subtitle: `${e.era.includes("181") ? "Universal Stewardship & Shared Futures Era (181–190)" : "Cosmic Stewardship & Multi-Generational Futures Era (171–180)"} — ${e.companion.toLowerCase()} supports reflection and metadata scaffolds. Supports humans — does NOT replace judgment, curiosity, or leadership accountability. Growth Partner — never Affiliate.`,
    loading: `Loading ${e.engineTitle.replace(/ \(Phase \d+\)/, "")} dashboard…`,
    engineTitle: e.engineTitle,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${e.companion} supports only`,
    eraOpenerSummary: `${e.era.includes("181") ? "Universal Stewardship Era" : "Cosmic Stewardship Era"} — Phases ${e.era}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${e.title} capabilities`,
    engineLabel: `${e.companion.replace(" Companion", "")} engine — reflection prompts`,
    frameworkLabel: "Stewardship framework",
    reviewsLabel: "Executive reviews",
    companionLabel: `${e.companion} — supports, does not replace`,
    subEngineLabel: "Supporting engine",
    reflections: "Reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${e.phase})`,
    companionLimitations: `${e.companion} limitations — does NOT replace human judgment`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${e.phase}`]: {
      mission: `${e.companion} supports stewardship and reflection — humans retain accountability.`,
      philosophy: "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function wisdomI18nBlock(e) {
  return {
    title: e.title,
    subtitle: `Cosmic Stewardship & Multi-Generational Futures Era (171–180) — ${e.companion.toLowerCase()} supports reflection. Humans decide — Companion does not replace judgment. Growth Partner — never Affiliate.`,
    loading: `Loading dashboard…`,
    engineTitle: e.engineTitle,
    [e.scoreKey]: "Engagement score",
    distinctionNote: "Support only — not replacement of human judgment or responsibility.",
    discoveryMode: "Mode",
    meaningReadinessLevel: "Readiness level",
    executiveReviews: "Executive reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — ${e.companion} supports only`,
    eraOpenerSummary: `Cosmic Stewardship Era — Phases 171–${e.phase}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerCapabilities: `${e.title} capabilities`,
    reflectionEngine: "Reflection engine",
    responsibleFramework: "Responsible framework",
    executive_reviews: "Executive reviews",
    companionCapabilities: `${e.companion} capabilities`,
    supportingEngine: "Supporting engine",
    oversightEngine: "Oversight engine",
    reflectionScaffolds: "Reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only",
    blueprintObjectives: `Blueprint objectives (Phase ${e.phase})`,
    companionLimitations: `${e.companion} limitations`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${e.phase}`]: {
      mission: `${e.companion} supports — humans decide.`,
      philosophy: "People First. Wisdom before speed.",
      growthPartnerNotAffiliate: "Growth Partner — never Affiliate.",
    },
  };
}

for (const locale of ["en", "no", "sv", "da"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const json = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const e of ENGINES) {
    if (e.i18nKey === "humanCreativityImaginationEngine") continue;
    const block = e.pageStyle === "hope" ? hopeI18nBlock(e) : wisdomI18nBlock(e);
    json[e.i18nKey] = block;
    if (json.nav) json.nav[e.navId] = e.navLabel;
    if (json.organizationalMemoryEngine) json.organizationalMemoryEngine[e.navId] = e.navLabel;
  }

  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  console.log("patched locale", locale);
}

console.log("i18n patch done");
