#!/usr/bin/env node
/**
 * Batch-replace user-facing AI terminology in locale JSON files.
 * Run: node scripts/replace-aipify-first-language.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALE_DIR = join(ROOT, "locales");

/** Longest phrases first */
const REPLACEMENTS = [
  [/AI Meeting Assistant/gi, "Aipify Meeting Companion"],
  [/AI Chief of Staff/gi, "Aipify executive companion"],
  [/AI-powered business systems/gi, "operational business systems"],
  [/AI-powered recommendations/gi, "Aipify Recommendations"],
  [/AI-powered platform/gi, "Aipify Business Operating System"],
  [/AI-powered/gi, "Aipify-powered"],
  [/AI Recommendations/gi, "Aipify Recommendations"],
  [/AI Recommendation/gi, "Aipify Recommendation"],
  [/AI Assistant/gi, "Aipify Companion"],
  [/AI Companion/gi, "Aipify Companion"],
  [/AI learning assistant/gi, "Aipify learning companion"],
  [/AI læringsassistent/gi, "Aipify læringscompanion"],
  [/AI lärassistent/gi, "Aipify lärcompanion"],
  [/AI læringsassistent/gi, "Aipify læringscompanion"],
  [/AI Chat/gi, "Aipify Companion"],
  [/AI Insights/gi, "Aipify Insights"],
  [/AI System Summary/gi, "Aipify System Summary"],
  [/AI Health Score/gi, "Aipify Health Score"],
  [/AI engine status/gi, "Aipify engine status"],
  [/AI escalation/gi, "Aipify escalation"],
  [/AI-eskalerings/gi, "Aipify-eskalerings"],
  [/AI-eskaleringsstatus/gi, "Aipify-eskaleringsstatus"],
  [/Automated AI actions/gi, "Automated Aipify actions"],
  [/AI actions completed/gi, "Aipify actions completed"],
  [/Last AI Scan/gi, "Last Aipify scan"],
  [/Siste AI-skanning/gi, "Siste Aipify-skanning"],
  [/First AI interaction/gi, "First Aipify interaction"],
  [/Første AI-interaksjon/gi, "Første Aipify-interaksjon"],
  [/Første AI-interaktion/gi, "Første Aipify-interaktion"],
  [/Första AI-interaktion/gi, "Första Aipify-interaktion"],
  [/AI governance/gi, "Aipify governance"],
  [/AI-governance/gi, "Aipify-governance"],
  [/Resolved by AI/gi, "Resolved by Aipify"],
  [/Løst av AI/gi, "Løst av Aipify"],
  [/Analytics AI/gi, "Aipify Analytics"],
  [/Commerce AI/gi, "Aipify Commerce"],
  [/Support AI/gi, "Aipify Support"],
  [/Support-AI/gi, "Aipify Support"],
  [/Commerce-AI/gi, "Aipify Commerce"],
  [/Aipify Support AI/gi, "Aipify Support"],
  [/Aipify Analytics AI/gi, "Aipify Analytics"],
  [/Aipify Commerce AI/gi, "Aipify Commerce"],
  [/Aipify Install AI/gi, "Aipify Install"],
  [/Aipify Moderation AI/gi, "Aipify Moderation"],
  [/Secure AI Actions/gi, "Secure Aipify Actions"],
  [/Sikre AI-handlinger/gi, "Sikre Aipify-handlinger"],
  [/Säkra AI-åtgärder/gi, "Säkra Aipify-åtgärder"],
  [/AI-handlinger/gi, "Aipify-handlinger"],
  [/AI-handling/gi, "Aipify-handling"],
  [/AI-åtgärder/gi, "Aipify-åtgärder"],
  [/AI-åtgärd/gi, "Aipify-åtgärd"],
  [/AI-anbefalinger/gi, "Aipify-innsikt"],
  [/AI-rekommendationer/gi, "Aipify-innsikter"],
  [/AI-innsikt/gi, "Aipify-innsikt"],
  [/AI-systemsammendrag/gi, "Aipify-systemsammendrag"],
  [/AI-drevne anbefalinger/gi, "Aipify-anbefalinger"],
  [/AI-drevne rekommendationer/gi, "Aipify-rekommendationer"],
  [/AI-drevet ledelseskontroll/gi, "Aipify-ledelseskontroll"],
  [/AI-drevna rekommendationer/gi, "Aipify-rekommendationer"],
  [/AI-drevne forretningssystemer/gi, "operasjonelle forretningssystemer"],
  [/AI-drevede forretningssystemer/gi, "operationelle forretningssystemer"],
  [/AI-drivna rekommendationer/gi, "Aipify-rekommendationer"],
  [/AI-drivna följeslagare/gi, "Aipify Companion"],
  [/AI-drevne ledsager/gi, "Aipify Companion"],
  [/AI-drevet ledsager/gi, "Aipify Companion"],
  [/AI-arbeidsflyter/gi, "Aipify-arbeidsflyter"],
  [/AI-agenter/gi, "Aipify-kapabiliteter"],
  [/AI-agenter/gi, "Aipify-kapabiliteter"],
  [/AI-genererte/gi, "Aipify-genererte"],
  [/AI-genererede/gi, "Aipify-genererede"],
  [/AI-genererade/gi, "Aipify-genererade"],
  [/AI-godkendelser/gi, "Aipify-godkendelser"],
  [/AI-godkjenninger/gi, "Aipify-godkjenninger"],
  [/AI-autonomi/gi, "Companion-autonomi"],
  [/AI-autonominivå/gi, "Companion-autonominivå"],
  [/AI-acceptrate/gi, "Aipify-acceptrate"],
  [/AI-motorstatus/gi, "Aipify-motorstatus"],
  [/AI-etik/gi, "Ansvarlig bruk"],
  [/AI-omkostningsstyring/gi, "Aipify-omkostningsstyring"],
  [/AI-kostnadsstyrning/gi, "Aipify-kostnadsstyrning"],
  [/AI-forbrug/gi, "Aipify-forbrug"],
  [/AI-användningsvolym/gi, "Aipify-användningsvolym"],
  [/AI-hændelser/gi, "Aipify-aktivitet"],
  [/AI-händelser/gi, "Aipify-aktivitet"],
  [/AI-aktivitetstidslinje/gi, "Aipify-aktivitetstidslinje"],
  [/AI-aktivitetstidslinje/gi, "Aipify-aktivitetstidslinje"],
  [/AI-handlingsdashboard/gi, "Aipify-handlingsdashboard"],
  [/AI-handlingsmotor/gi, "Aipify-handlingsmotor"],
  [/AI-handlingsprincipper/gi, "Aipify-handlingsprincipper"],
  [/AI-handlingsframework/gi, "Aipify-handlingsframework"],
  [/AI-handlingsramverk/gi, "Aipify-handlingsramverk"],
  [/AI-risikoklassificering/gi, "Aipify-risikoklassificering"],
  [/AI-riskklassificering/gi, "Aipify-riskklassificering"],
  [/AI involveret/gi, "Aipify involveret"],
  [/AI inblandad/gi, "Aipify inblandad"],
  [/forbudt for AI/gi, "forbudt uten menneskelig bekreftelse"],
  [/forbudt for autonom AI/gi, "forbudt uten menneskelig bekreftelse"],
  [/forbuden for AI/gi, "forbuden uten mänsklig bekräftelse"],
  [/forbuden for autonom AI/gi, "forbuden uten mänsklig bekräftelse"],
  [/forbudt for AI/gi, "forbudt uden menneskelig bekræftelse"],
  [/Responsible AI-forpligtelser/gi, "Ansvarlige bruksforpliktelser"],
  [/Responsible AI-åtaganden/gi, "Ansvarsfulla användningsåtaganden"],
  [/Specialiserede AI-agenter/gi, "Spesialiserte Aipify-kapabiliteter"],
  [/Specialiserade AI-agenter/gi, "Specialiserade Aipify-kapabiliteter"],
  [/Spesialiserte AI-agenter/gi, "Spesialiserte Aipify-kapabiliteter"],
  [/Install AI discovers/gi, "Aipify Install discovers"],
  [/prohibited for AI/gi, "prohibited without human confirmation"],
  [/never AI alone/gi, "never without human confirmation"],
  [/AI prohibited/gi, "Human confirmation required"],
  [/Väntande AI-godkännanden/gi, "Väntande Aipify-godkännanden"],
  [/forbudna för AI/gi, "förbjudna utan mänsklig bekräftelse"],
  [/forbudna för autonom AI/gi, "förbjudna uten mänsklig bekräftelse"],
  [/Dokumenterade AI-användningsfall/gi, "Dokumenterade Aipify-användningsfall"],
  [/Laddar AI-kostnadspanel/gi, "Laddar Aipify-kostnadspanel"],
  [/Responsible AI-forpliktelser/gi, "Ansvarlige bruksforpliktelser"],
  [/Kundevendt AI-support/gi, "Aipify Support for kunder"],
  [/Din AI-drevne følgesvenn/gi, "Din Aipify Companion"],
  [/AI-hendelser/gi, "Aipify-aktivitet"],
  [/AI-risikoklassifisering/gi, "Aipify-risikoklassifisering"],
  [/AI involvert/gi, "Aipify involvert"],
  [/AI-kostnadsstyring/gi, "Aipify-kostnadsstyring"],
  [/AI-bruksvolum/gi, "Aipify-bruksvolum"],
  [/Dokumenterte AI-bruksområder/gi, "Dokumenterte Aipify-bruksområder"],
  [/Laster AI-kostnadsdashbord/gi, "Laster Aipify-kostnadsdashbord"],
  [/Dokumenterede AI-brugsscenarier/gi, "Dokumenterede Aipify-brugsscenarier"],
  [/Indlæser AI-omkostningsdashboard/gi, "Indlæser Aipify-omkostningsdashboard"],
  [/Aipify assistant/gi, "Aipify Companion"],
  [/AI actions/gi, "Aipify actions"],
  [/AI action/gi, "Aipify action"],
  [/AI usage/gi, "Aipify usage"],
  [/AI usage rate/gi, "Aipify usage rate"],
  [/AI Events/gi, "Aipify activity"],
  [/AI Timeline/gi, "Aipify activity timeline"],
  [/AI Risk Classification/gi, "Aipify risk classification"],
  [/AI involved/gi, "Aipify involved"],
  [/AI Action Framework/gi, "Aipify Action Framework"],
  [/AI Autonomy/gi, "Companion autonomy"],
  [/AI acceptance rate/gi, "Aipify acceptance rate"],
  [/AI Responses/gi, "Aipify Responses"],
  [/AI Statistics/gi, "Aipify Support Statistics"],
  [/AI Cost Governance/gi, "Aipify Cost Governance"],
  [/AI Ethics/gi, "Responsible Use"],
  [/AI-generated/gi, "Aipify-generated"],
  [/AI-genererte/gi, "Aipify-genererte"],
];

function walkJsonFiles(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkJsonFiles(p, files);
    else if (name.endsWith(".json")) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walkJsonFiles(LOCALE_DIR)) {
  let text = readFileSync(file, "utf8");
  const before = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }
  if (text !== before) {
    writeFileSync(file, text);
    changed++;
    console.log("updated:", file.replace(ROOT + "/", ""));
  }
}

/** Non-locale user-facing sources */
const EXTRA = [
  join(ROOT, "lib/branding/company.ts"),
  join(ROOT, "lib/internal-language-model/vocabulary.ts"),
  join(ROOT, "lib/internal-language-model/company-foundation-vocabulary.ts"),
  join(ROOT, "content/knowledge/aipify/faq/aipify-itself.md"),
  join(ROOT, "content/knowledge/aipify/admin-assistant-engine/faq/admin-assistant-engine-faq.md"),
];

for (const file of EXTRA) {
  try {
    let text = readFileSync(file, "utf8");
    const before = text;
    for (const [pattern, replacement] of REPLACEMENTS) {
      text = text.replace(pattern, replacement);
    }
    text = text.replace(
      /An AI-powered business operations platform/gi,
      "An operational business platform from Aipify"
    );
    text = text.replace(
      /AI-powered helper designed to support/gi,
      "Aipify Companion designed to support"
    );
    text = text.replace(
      /Building AI-powered business systems/gi,
      "Building operational business systems"
    );
    text = text.replace(
      /AI-powered business operating systems/gi,
      "operational business operating systems"
    );
    if (text !== before) {
      writeFileSync(file, text);
      changed++;
      console.log("updated:", file.replace(ROOT + "/", ""));
    }
  } catch {
    /* skip missing */
  }
}

console.log(`Done. ${changed} files updated.`);
