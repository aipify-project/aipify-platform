#!/usr/bin/env node
/** ABOS Phase 218 — Aipify Employee Recognition & Celebration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const P = {
  phase: 218,
  migration: "20261378000000_aipify_employee_recognition_celebration_engine_phase218.sql",
  slug: "aipify-employee-recognition-celebration-engine",
  base: "AipifyEmployeeRecognitionCelebration",
  camel: "aipifyEmployeeRecognitionCelebrationEngine",
  snake: "aipify_employee_recognition_celebration",
  permPrefix: "aipify_employee_recognition_celebration",
  helper: "aerce",
  bp: "aercebp218",
  decisionType: "aipify_employee_recognition_celebration_engine",
  prevDecision: "aipify_organizational_communication_announcements_engine",
  title: "Aipify Employee Recognition & Celebration",
  centerTitle: "Recognition Center",
  companion: "Recognition Companion",
  scoreKey: "aipify_employee_recognition_celebration_score",
  modeKey: "recognition_mode",
  levelKey: "recognition_maturity_level",
  thirdEntity: "recognition_notes",
  docSlug: "AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE",
  ilmFile: "implementation-blueprint-phase218-aipify-employee-recognition-celebration.txt",
  navLabel: "Recognition & Celebration",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
};

const SOURCE = {
  slug: "aipify-organizational-communication-announcements-engine",
  base: "AipifyOrganizationalCommunicationAnnouncements",
  camel: "aipifyOrganizationalCommunicationAnnouncementsEngine",
  snake: "aipify_organizational_communication_announcements",
  helper: "aocae",
  bp: "aocaebp217",
  migration: "20261377000000_aipify_organizational_communication_announcements_engine_phase217.sql",
  docSlug: "AIPIFY_ORGANIZATIONAL_COMMUNICATION_ANNOUNCEMENTS_ENGINE",
  ilmFile: "implementation-blueprint-phase217-aipify-organizational-communication-announcements.txt",
};

const REPLACEMENTS = [
  [SOURCE.base, P.base],
  [SOURCE.slug, P.slug],
  [SOURCE.snake, P.snake],
  [SOURCE.camel.replace(/Engine$/, ""), P.camel.replace(/Engine$/, "")],
  [SOURCE.camel, P.camel],
  [SOURCE.bp, P.bp],
  [SOURCE.helper, P.helper],
  ["aercebp217", "aercebp218"],
  [SOURCE.migration, P.migration],
  [SOURCE.docSlug, P.docSlug],
  [SOURCE.ilmFile, P.ilmFile],
  ["Phase 217", "Phase 218"],
  ["phase217", "phase218"],
  ["Repo Phase 217", "Repo Phase 218"],
  ["Aipify Organizational Communication & Announcements", P.title],
  ["Communication Center", P.centerTitle],
  ["Communication Companion", P.companion],
  ["Communication & Announcements", P.navLabel],
  ["communication_mode", P.modeKey],
  ["communication_maturity_level", P.levelKey],
  ["communication_notes", P.thirdEntity],
  ["aipify_organizational_communication_announcements_score", P.scoreKey],
  ["communication_dashboard", "recognition_dashboard"],
  ["leadership_broadcast_center", "peer_recognition_framework"],
  ["department_communication_hub", "leadership_appreciation_center"],
  ["announcement_scheduler", "milestone_celebration_engine"],
  ["read_acknowledgement_framework", "values_recognition_program"],
  ["executive_communication_insights", "recognition_insights_dashboard"],
  ["digital_headquarters_notification_integration", "unified_workspace_recognition_integration"],
  ["communication_knowledge_libraries", "recognition_knowledge_libraries"],
  ["communication_companion", "recognition_companion"],
  ["Communication Dashboard", "Recognition Dashboard"],
  ["Leadership Broadcast Center", "Peer Recognition Framework"],
  ["Department Communication Hub", "Leadership Appreciation Center"],
  ["Announcement Scheduler", "Milestone Celebration Engine"],
  ["Read & Acknowledgement Framework", "Values Recognition Program"],
  ["Executive Communication Insights", "Recognition Insights Dashboard"],
  ["communication dashboard", "recognition dashboard"],
  ["leadership broadcast center", "peer recognition framework"],
  ["department communication hub", "leadership appreciation center"],
  ["announcement scheduler", "milestone celebration engine"],
  ["read & recognition acknowledgement framework", "values recognition program"],
  ["communication knowledge libraries", "recognition knowledge libraries"],
  ["organizational communication and announcements within Innovation Era", "employee recognition and celebration within Innovation Era"],
  ["structured communication", "structured recognition"],
  ["leadership broadcasts", "leadership appreciation initiatives"],
  ["steward broadcasts", "steward recognition participation"],
  ["organizational communication", "organizational recognition"],
  ["communication builds clarity", "recognition builds belonging"],
  ["announcements reach the right audiences", "appreciation reaches the right teams"],
  ["broadcast preparation", "recognition preparation"],
  ["communication signals", "recognition signals"],
  ["Communication gaps", "Recognition gaps"],
  ["communication gaps", "recognition gaps"],
  ["communication metrics", "recognition metrics"],
  ["communication prompts", "recognition prompts"],
  ["Communication prompts", "Recognition prompts"],
  ["Communication audit trails", "Recognition audit trails"],
  ["communication RBAC", "recognition RBAC"],
  ["protected sensitive communications", "protected employee recognition preferences"],
  ["sensitive communications", "employee recognition preferences"],
  ["organizational messaging", "organizational appreciation"],
  ["miscommunication", "low belonging"],
  ["communication center", "communication center"],
  ["Communication score", "Recognition score"],
  ["Communication maturity level", "Recognition maturity level"],
  ["Executive communication insights", "Recognition insights dashboard"],
  ["Leadership broadcast scaffolds", "Recognition activity scaffolds"],
  ["Communication insight entries", "Recognition insight entries"],
  ["Communication summaries", "Recognition summaries"],
  ["communication summaries", "recognition summaries"],
  ["communication insights", "recognition insights"],
  ["communication prompts", "recognition prompts"],
  ["communication metrics", "recognition metrics"],
  ["communication gaps", "recognition gaps"],
  ["communication scaffolds", "recognition scaffolds"],
  ["Communication scaffolds", "Recognition scaffolds"],
  ["communication visibility", "recognition visibility"],
  ["auto-broadcast", "auto-publish recognition"],
  ["broadcast authority", "recognition authority"],
  ["broadcast recommendations", "recognition recommendations"],
  ["communication stewardship loops", "recognition stewardship loops"],
  ["acknowledgement", "recognition acknowledgement"],
  ["What is Organizational Recognition & Celebration Engine?", "What is the Employee Recognition & Celebration Engine?"],
  ["Organizational Recognition & Celebration provides a structured professional communication framework ensuring important information reaches the right people at the right time — at `/app/aipify-employee-recognition-celebration-engine`.", "Employee Recognition & Celebration provides a structured recognition framework for celebrating achievements, contributions, and values-aligned behaviors at `/app/aipify-employee-recognition-celebration-engine`."],
  ["Does the Recognition Companion broadcast announcements automatically?", "Does the Recognition Companion publish recognition automatically?"],
  ["Communication dashboard, peer recognition framework, leadership appreciation center, milestone celebration engine, read & recognition acknowledgement framework, and executive recognition insights — metadata only.", "Recognition dashboard, peer recognition framework, leadership appreciation center, milestone celebration engine, values recognition program, and recognition insights dashboard — metadata only."],
  ["Why human approval for broadcasts?", "Why are privacy controls and human approval required?"],
  ["Humans retain communication authority. Aipify advises and prepares — it does not auto-publish recognition or bypass approval for protected employee recognition preferences.", "Humans retain recognition authority. Aipify advises and prepares — it does not auto-publish recognition or bypass privacy controls for protected employee recognition preferences."],
  ["Companion limitations: no auto-publishing recognition without approval, no bypassing human approval, no exposing protected employee recognition preferences, no punitive communication enforcement, no assuming readership without evidence.", "Companion limitations: no auto-publishing recognition without approval, no bypassing privacy controls, no exposing protected employee recognition preferences, no punitive recognition enforcement, no assuming participation without consent."],
  ["Design principles: belonging before bureaucracy, appreciation before entitlement, communication before confusion.", "Design principles: recognition before assumption, appreciation before entitlement, belonging before bureaucracy."],
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function write(file, content) {
  const abs = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
  console.log("wrote", file);
}

function transform(content) {
  let out = content;
  for (const [from, to] of REPLACEMENTS) out = out.split(from).join(to);

  out = out.replace("recognition before confusion", "recognition before assumption");
  out = out.replace("transparency before assumptions", "appreciation before entitlement");
  out = out.replace("clarity before complexity", "belonging before bureaucracy");
  out = out.replaceAll("auto-publish recognitioning", "auto-publishing recognition");
  out = out.replaceAll("auto-recognitioning", "auto-publishing recognition");

  out = out.replace(
    "Cross-links only: Phase 203 digital headquarters, Phase 202 unified workspace / recognition hub — never auto-publish recognition, bypass human approval, or expose protected sensitive recognition activity.",
    "Cross-links only: Phase 203 digital headquarters, Phase 217 communication center, and Phase 202 unified workspace recognition feed — never auto-publish recognition, bypass privacy controls, or expose protected employee recognition preferences.",
  );
  out = out.replaceAll(
    "Digital headquarters & notification hub integration — cross-links only",
    "Digital headquarters, communication center, and unified workspace recognition feed integration — cross-links only",
  );
  out = out.replaceAll(
    "Digital headquarters & notification hub — cross-links only.",
    "Digital headquarters, communication center, and unified workspace recognition feed — cross-links only.",
  );
  out = out.replace(
    "Cross-link only: Phase 203 digital headquarters (`/app/aipify-digital-headquarters-engine`), Phase 202 unified workspace (`/app/aipify-unified-workspace-engine`). Never duplicate their RPCs.",
    "Cross-link only: Phase 203 digital headquarters (`/app/aipify-digital-headquarters-engine`), Phase 217 communication center (`/app/aipify-organizational-communication-announcements-engine`), and Phase 202 unified workspace (`/app/aipify-unified-workspace-engine`). Never duplicate their RPCs.",
  );
  out = out.replaceAll("Phase 202 unified workspace / recognition hub", "Phase 203 digital headquarters, Phase 217 communication center, and Phase 202 unified workspace recognition feed");
  out = out.replaceAll("Phase 202 unified workspace / notification hub", "Phase 203 digital headquarters, Phase 217 communication center, and Phase 202 unified workspace recognition feed");
  out = out.replaceAll("Phase 203 digital headquarters, Phase 203 digital headquarters, Phase 217 communication center, and Phase 202 unified workspace recognition feed", "Phase 203 digital headquarters, Phase 217 communication center, and Phase 202 unified workspace recognition feed");
  out = out.replaceAll("notification hub", "unified workspace recognition feed");
  out = out.replaceAll("protected sensitive communications", "protected employee recognition preferences");
  out = out.replaceAll("bypass human approval", "bypass privacy controls");
  out = out.replaceAll("auto-publish recognitions", "auto-publish recognition");
  out = out.replaceAll("Training & Certification Phase 216", "Communication & Announcements Phase 217");
  out = out.replaceAll("'phase', 217, 'key', 'organizational_communication_announcements', 'label', 'Recognition & Celebration Phase 218'", "'phase', 218, 'key', 'employee_recognition_celebration', 'label', 'Recognition & Celebration Phase 218'");
  out = out.replaceAll("'key', 'communication_center', 'label', 'Training & Certification Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine'", "'key', 'communication_center', 'label', 'Communication & Announcements Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine'");
  out = out.replaceAll("Read & recognition acknowledgement framework", "Values recognition program");
  out = out.replaceAll("'key', 'read_recognition acknowledgement'", "'key', 'values_recognition_program'");
  out = out.replaceAll("'key', 'communication_libraries'", "'key', 'recognition_knowledge_libraries'");
  out = out.replaceAll("approved communication resources", "approved recognition resources");
  out = out.replaceAll("supports communication clarity", "supports recognition culture");
  out = out.replaceAll("organizational communication and broadcasts", "organizational recognition and celebration authority");
  out = out.replaceAll("no_auto_broadcast", "no_auto_recognition");

  return out;
}

function patchDecisionTypeChain(sql) {
  const chain = [
    "aipify_organizational_rhythms_operating_cadence_engine",
    "aipify_continuous_improvement_optimization_engine",
    "aipify_innovation_opportunity_discovery_engine",
    "aipify_customer_success_value_realization_engine",
    "aipify_customer_journey_experience_orchestration_engine",
    "aipify_onboarding_adoption_acceleration_engine",
    "aipify_enterprise_training_certification_engine",
    "aipify_organizational_communication_announcements_engine",
    P.decisionType,
  ];
  const additions = chain.filter((entry) => !sql.includes(`'${entry}'`));
  if (additions.length === 0) return sql;
  const anchor = sql.includes("'aipify_organizational_communication_announcements_engine'")
    ? "'aipify_organizational_communication_announcements_engine'"
    : sql.includes("'aipify_enterprise_training_certification_engine'")
      ? "'aipify_enterprise_training_certification_engine'"
      : "'aipify_onboarding_adoption_acceleration_engine'";
  const anchorValue = anchor.replace(/'/g, "");
  const toAdd = additions.filter((e) => e !== anchorValue);
  if (toAdd.length === 0) return sql;
  return sql.replace(anchor, `${anchor},\n    ${toAdd.map((e) => `'${e}'`).join(",\n    ")}`);
}

function patchMigration(sql) {
  let out = patchDecisionTypeChain(sql);
  out = out.replace(
    /jsonb_build_object\('phase', 216, 'key', 'enterprise_training_certification', 'label', 'Training & Certification Phase 216', 'route', '\/app\/aipify-enterprise-training-certification-engine', 'description', 'Cross-link only'\),/,
    "jsonb_build_object('phase', 217, 'key', 'organizational_communication_announcements', 'label', 'Communication & Announcements Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine', 'description', 'Cross-link only'),",
  );
  out = out.replace(
    /jsonb_build_object\('phase', 216, 'key', 'organizational_communication_announcements', 'label', 'Communication & Announcements Phase 217', 'route', '\/app\/aipify-organizational-communication-announcements-engine', 'description', 'Cross-link only'\),/,
    "jsonb_build_object('phase', 217, 'key', 'organizational_communication_announcements', 'label', 'Communication & Announcements Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine', 'description', 'Cross-link only'),",
  );
  out = out.replace(/'key', 'enterprise_training_certification'/g, "'key', 'organizational_communication_announcements'");
  out = out.replace(
    "'key', 'enterprise_training'",
    "'key', 'communication_center'",
  );
  out = out.replace(
    "Training communications — cross-link only",
    "Communication center coordination — cross-link only",
  );
  out = out.replace(
    "cross-link only for digital headquarters and unified workspace notification hub.",
    "cross-link only for digital headquarters, communication center, and unified workspace recognition feed.",
  );
  out = out.replace(
    "digital headquarters or unified workspace notification hub RPCs.",
    "digital headquarters, communication center, or unified workspace recognition feed RPCs.",
  );
  out = out.replaceAll("Training & Certification Phase 216", "Communication & Announcements Phase 217");
  out = out.replaceAll("'phase', 217, 'key', 'organizational_communication_announcements', 'label', 'Recognition & Celebration Phase 218'", "'phase', 218, 'key', 'employee_recognition_celebration', 'label', 'Recognition & Celebration Phase 218'");
  out = out.replaceAll("'route', '/app/aipify-enterprise-training-certification-engine'", "'route', '/app/aipify-organizational-communication-announcements-engine'");
  out = out.replaceAll("Leadership broadcast center — five questions", "Peer recognition framework — five questions");
  out = out.replaceAll("no_auto_broadcast", "no_auto_recognition");
  out = out.replaceAll("aercebp217", "aercebp218");
  return out;
}

function genStack() {
  write(`lib/core/${P.slug}.ts`, transform(read(`lib/core/${SOURCE.slug}.ts`)));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(`lib/aipify/${P.slug}/${f}`, transform(read(`lib/aipify/${SOURCE.slug}/${f}`)));
  }
  write(
    `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`,
    transform(read(`components/app/${SOURCE.slug}/${SOURCE.base}EngineDashboardPanel.tsx`)),
  );
  write(`components/app/${P.slug}/index.ts`, `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(`app/app/${P.slug}/page.tsx`, transform(read(`app/app/${SOURCE.slug}/page.tsx`)));
  write(`app/api/aipify/${P.slug}/card/route.ts`, transform(read(`app/api/aipify/${SOURCE.slug}/card/route.ts`)));
  write(`app/api/aipify/${P.slug}/dashboard/route.ts`, transform(read(`app/api/aipify/${SOURCE.slug}/dashboard/route.ts`)));

  const migration = patchMigration(transform(read(`supabase/migrations/${SOURCE.migration}`)));
  write(`supabase/migrations/${P.migration}`, migration);

  write(`${P.docSlug}_PHASE${P.phase}.md`, transform(read(`${SOURCE.docSlug}_PHASE217.md`)));
  write(
    `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`,
    transform(read(`IMPLEMENTATION_BLUEPRINT_PHASE217_${SOURCE.docSlug}.md`)),
  );
  write(
    `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`,
    transform(read(`content/knowledge/aipify/${SOURCE.slug}/faq/implementation-blueprint-phase217-faq.md`)),
  );
  write(
    `aipify-core/knowledge/internal-language-model/${P.ilmFile}`,
    transform(read(`aipify-core/knowledge/internal-language-model/${SOURCE.ilmFile}`)),
  );
  write(
    `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`,
    transform(read("lib/internal-language-model/implementation-blueprint-phase217-vocabulary.ts")),
  );
}

function patchShared() {
  let nav = read("lib/app/nav-config.ts");
  if (!nav.includes(`"${P.camel}"`)) {
    nav = nav.replace(`| "${SOURCE.camel}"`, `| "${SOURCE.camel}"\n  | "${P.camel}"`);
    nav = nav.replace(
      /id: "aipifyOrganizationalCommunicationAnnouncementsEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOrganizationalCommunicationAnnouncementsEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${P.camel}",\n    href: "/app/${P.slug}",\n    labelKey: "customerApp.nav.${P.camel}",\n  },`,
    );
    nav = nav.replace(
      'if (pathname.startsWith("/app/aipify-organizational-communication-announcements-engine")) {\n    return "aipifyOrganizationalCommunicationAnnouncementsEngine";\n  }',
      'if (pathname.startsWith("/app/aipify-organizational-communication-announcements-engine")) {\n    return "aipifyOrganizationalCommunicationAnnouncementsEngine";\n  }\n  if (pathname.startsWith("/app/aipify-employee-recognition-celebration-engine")) {\n    return "aipifyEmployeeRecognitionCelebrationEngine";\n  }',
    );
    write("lib/app/nav-config.ts", nav);
  }

  let perms = read("lib/core/permissions.ts");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!perms.includes(`"${perm}"`)) {
      perms = perms.replace('"aipify_organizational_communication_announcements.steward",', `"aipify_organizational_communication_announcements.steward",\n    "${perm}",`);
    }
  }
  write("lib/core/permissions.ts", perms);

  let tenant = read("lib/core/tenant.ts");
  if (!tenant.includes(`./${P.slug}`)) {
    tenant = tenant.replace(
      'export * from "./aipify-organizational-communication-announcements-engine";',
      `export * from "./aipify-organizational-communication-announcements-engine";\nexport * from "./${P.slug}";`,
    );
    write("lib/core/tenant.ts", tenant);
  }

  const block = {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports peer recognition, milestone celebrations, and values-aligned appreciation. Supports humans — does NOT auto-publish recognition or bypass privacy controls. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Recognition score",
    modeLabel: "Mode",
    readinessLabel: "Recognition maturity level",
    executiveReviews: "Recognition insights dashboard",
    activeReflections: "Active recognition scaffolds",
    humanOversightRequired: `Human oversight required — humans steward recognition participation and privacy; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate digital headquarters, communication center, or unified workspace RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Peer recognition framework — recognition prompts",
    frameworkLabel: "Leadership appreciation center",
    reviewsLabel: "Recognition insights dashboard",
    companionLabel: `${P.companion} — supports, does not auto-publish recognition`,
    subEngineLabel: "Milestone celebration engine",
    reflections: "Recognition activity scaffolds",
    executiveReviewEntries: "Recognition insight entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-publish recognition or bypass privacy controls`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    phase218: {
      mission: `${P.companion} supports recognition visibility — humans retain recognition authority.`,
      philosophy: "People First. Metadata-only recognition scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      recognitionEra: `${P.era} — Phase ${P.phase}.`,
    },
  };
  for (const locale of ["en", "no", "sv", "da"]) {
    const data = JSON.parse(read(`locales/${locale}/customerApp.json`));
    data.nav = data.nav ?? {};
    data.nav[P.camel] = locale === "no" ? "Anerkjennelse og feiring" : locale === "sv" ? "Erkännande och firande" : locale === "da" ? "Anerkendelse og fejring" : P.navLabel;
    data[P.camel] = block;
    write(`locales/${locale}/customerApp.json`, `${JSON.stringify(data, null, 2)}\n`);
  }

  let ilm = read("lib/internal-language-model/index.ts");
  if (!ilm.includes(`phase${P.phase}-vocabulary`)) {
    ilm = ilm.replace(
      'export * from "./implementation-blueprint-phase217-vocabulary";',
      'export * from "./implementation-blueprint-phase217-vocabulary";\nexport * from "./implementation-blueprint-phase218-vocabulary";',
    );
  }
  if (!ilm.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    ilm = ilm.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE217_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase217-aipify-organizational-communication-announcements.txt";',
      'export const IMPLEMENTATION_BLUEPRINT_PHASE217_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase217-aipify-organizational-communication-announcements.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE218_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase218-aipify-employee-recognition-celebration.txt";',
    );
  }
  write("lib/internal-language-model/index.ts", ilm);

  let arch = read("ARCHITECTURE.md");
  const marker = "Permissions `aipify_organizational_communication_announcements.view`, `aipify_organizational_communication_announcements.manage`, `aipify_organizational_communication_announcements.steward`.";
  const entry = `\n**Aipify Employee Recognition & Celebration Engine (Phase 218):** See [${P.docSlug}_PHASE218.md](./${P.docSlug}_PHASE218.md) — Recognition Center for recognition dashboard, peer recognition framework, leadership appreciation center, milestone celebration engine, values recognition program, recognition insights dashboard, and unified workspace recognition integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-publishing recognition or bypassing privacy controls. Cross-links only: Phase 203 digital headquarters, Phase 217 communication center, and Phase 202 unified workspace. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!arch.includes("Phase 218")) {
    const idx = arch.indexOf(marker);
    arch = idx === -1 ? `${arch}\n${entry}\n` : `${arch.slice(0, idx + marker.length)}${entry}${arch.slice(idx + marker.length)}`;
    write("ARCHITECTURE.md", arch);
  }
}

genStack();
patchShared();
console.log(`Phase ${P.phase} complete`);
