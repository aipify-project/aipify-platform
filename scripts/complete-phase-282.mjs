#!/usr/bin/env node
/** ABOS Phase 282 — Enterprise Printing & Document Output Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 282,
  migration: "20261421000000_aipify_enterprise_printing_document_output_engine_phase282.sql",
  slug: "aipify-enterprise-printing-document-output-engine",
  docSlug: "AIPIFY_ENTERPRISE_PRINTING_DOCUMENT_OUTPUT",
  ilmFile: "implementation-blueprint-phase282-aipify-enterprise-printing-document-output.txt",
  permKeys: ["print.view", "print.execute", "print.department", "print.organization", "print.manage"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Print & Output Center",
    subtitle:
      "Connect printers, manage print permissions, preview jobs, and keep full audit trails. Aipify supports physical output when useful — users decide.",
    loading: "Loading Print & Output Center…",
    devicesTitle: "Devices & Integrations",
    devicesSubtitle: "Manage printers and output integrations for your workspace.",
    devicesHub: "Devices hub",
    devicesPrintersHint: "Configure office printers, permissions, and print policies.",
    printersNav: "Printers",
    printersTitle: "Connected printers",
    addPrinter: "Add office printer",
    noPrinters: "No printers connected yet. Add a printer or pair the Desktop Companion to discover local devices.",
    jobsTitle: "Recent print jobs",
    noJobs: "No print jobs yet.",
    policyTitle: "Print governance",
    printingEnabled: "Printing enabled for workspace",
    requireApproval: "Require approval for sensitive documents",
    savePolicy: "Save print policy",
    saved: "Saved",
    auditTitle: "Print audit trail",
    noAudit: "No print audit entries yet.",
    historyTitle: "Print job history",
    historySubtitle: "Full audit history for print jobs in your organization.",
    historyNote: "Every print job is logged with user, document type, printer, status, and sensitivity level.",
    backToPrinters: "Back to printers",
    historyLink: "Print history",
    defaultBadge: "Default",
    location: "Location",
    department: "Department",
    settingsLink: "Devices & printers",
    offerPrompt: "Should I print this for you?",
    offerPromptNo: "Skal jeg printe dette ut for deg?",
    status: {
      draft: "Draft",
      waiting_for_confirmation: "Waiting for confirmation",
      queued: "Queued",
      printing: "Printing",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
      online: "Online",
      offline: "Offline",
      unknown: "Unknown",
    },
    connectionType: {
      local: "Local printer",
      network: "Network printer",
      shared: "Shared company printer",
      cloud: "Cloud print service",
      department: "Department printer",
    },
    phase282: {
      mission: "Aipify supports digital and physical output — users decide when printing is useful.",
      philosophy: "People First. Permission-based printing with full audit logging. Growth Partner — never Affiliate.",
    },
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Utskrift og utdatasenter",
    subtitle:
      "Koble til skrivere, administrer utskriftsrettigheter, forhåndsvis jobber og behold full revisjon. Aipify støtter fysisk utskrift når det er nyttig — brukeren bestemmer.",
    loading: "Laster Utskrift og utdatasenter…",
    devicesTitle: "Enheter og integrasjoner",
    devicesSubtitle: "Administrer skrivere og utdata-integrasjoner for arbeidsområdet ditt.",
    devicesHub: "Enhetssenter",
    devicesPrintersHint: "Konfigurer kontorskrivere, tillatelser og utskriftspolicyer.",
    printersNav: "Skrivere",
    printersTitle: "Tilkoblede skrivere",
    addPrinter: "Legg til kontorskriver",
    noPrinters: "Ingen skrivere tilkoblet ennå. Legg til en skriver eller koble Desktop Companion for å oppdage lokale enheter.",
    jobsTitle: "Nylige utskriftsjobber",
    noJobs: "Ingen utskriftsjobber ennå.",
    policyTitle: "Utskriftsstyring",
    printingEnabled: "Utskrift aktivert for arbeidsområdet",
    requireApproval: "Krev godkjenning for sensitive dokumenter",
    savePolicy: "Lagre utskriftspolicy",
    saved: "Lagret",
    auditTitle: "Utskriftsrevisjon",
    noAudit: "Ingen revisjonsoppføringer ennå.",
    historyTitle: "Historikk for utskriftsjobber",
    historySubtitle: "Full revisjonshistorikk for utskriftsjobber i organisasjonen.",
    historyNote: "Hver utskriftsjobb logges med bruker, dokumenttype, skriver, status og sensitivitetsnivå.",
    backToPrinters: "Tilbake til skrivere",
    historyLink: "Utskriftshistorikk",
    defaultBadge: "Standard",
    location: "Plassering",
    department: "Avdeling",
    settingsLink: "Enheter og skrivere",
    offerPrompt: "Skal jeg printe dette ut for deg?",
    offerPromptNo: "Skal jeg printe dette ut for deg?",
    status: {
      draft: "Utkast",
      waiting_for_confirmation: "Venter på bekreftelse",
      queued: "I kø",
      printing: "Skriver ut",
      completed: "Fullført",
      failed: "Mislyktes",
      cancelled: "Avbrutt",
      online: "Tilkoblet",
      offline: "Frakoblet",
      unknown: "Ukjent",
    },
    connectionType: {
      local: "Lokal skriver",
      network: "Nettverksskriver",
      shared: "Delt firmaskriver",
      cloud: "Skytjeneste for utskrift",
      department: "Avdelingsskriver",
    },
    phase282: {
      mission: "Aipify støtter digital og fysisk utdata — brukeren bestemmer når utskrift er nyttig.",
      philosophy: "People First. Tillatelsesbasert utskrift med full revisjon. Growth Partner — never Affiliate.",
    },
  };

  const svBlock = {
    ...i18nBlock(),
    title: "Utskrift och utdatacenter",
    subtitle:
      "Anslut skrivare, hantera utskriftsbehörigheter, förhandsgranska jobb och behåll full revision. Aipify stöder fysisk utskrift när det är användbart — användaren bestämmer.",
    loading: "Laddar Utskrift och utdatacenter…",
    devicesTitle: "Enheter och integrationer",
    devicesSubtitle: "Hantera skrivare och utdata-integrationer för din arbetsyta.",
    devicesHub: "Enhetshubb",
    devicesPrintersHint: "Konfigurera kontorsskrivare, behörigheter och utskriftspolicyer.",
    printersNav: "Skrivare",
    settingsLink: "Enheter och skrivare",
    offerPrompt: "Ska jag skriva ut detta åt dig?",
    offerPromptNo: "Ska jag skriva ut detta åt dig?",
  };

  const daBlock = {
    ...i18nBlock(),
    title: "Udskrift og output-center",
    subtitle:
      "Forbind printere, administrer udskriftstilladelser, forhåndsvis job og behold fuld revision. Aipify understøtter fysisk output når det er nyttigt — brugeren bestemmer.",
    loading: "Indlæser Udskrift og output-center…",
    devicesTitle: "Enheder og integrationer",
    devicesSubtitle: "Administrer printere og output-integrationer for dit arbejdsområde.",
    devicesHub: "Enhedshub",
    devicesPrintersHint: "Konfigurer kontorprintere, tilladelser og udskriftspolitikker.",
    printersNav: "Printere",
    settingsLink: "Enheder og printere",
    offerPrompt: "Skal jeg udskrive dette for dig?",
    offerPromptNo: "Skal jeg udskrive dette for dig?",
  };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.printOutput = block;
    if (!data.settings?.links) data.settings = { ...data.settings, links: {} };
    data.settings.links.devicesPrinters = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"outputs.manage_templates",',
        `"outputs.manage_templates",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchSettingsPage() {
  const page = path.join(ROOT, "app/app/settings/page.tsx");
  let c = fs.readFileSync(page, "utf8");
  if (!c.includes("devicesPrinters")) {
    c = c.replace(
      "twoFactor: t(\"customerApp.settings.links.twoFactor\"),",
      "twoFactor: t(\"customerApp.settings.links.twoFactor\"),\n          devicesPrinters: t(\"customerApp.settings.links.devicesPrinters\"),",
    );
    fs.writeFileSync(page, c);
  }

  const panel = path.join(ROOT, "components/app/settings/CustomerSettingsCenterPanel.tsx");
  let p = fs.readFileSync(panel, "utf8");
  if (!p.includes("devicesPrinters")) {
    p = p.replace(
      "twoFactor: string;",
      "twoFactor: string;\n      devicesPrinters: string;",
    );
    p = p.replace(
      '<Link href="/app/settings/two-factor"',
      '<Link href="/app/settings/devices" className="block text-indigo-600 hover:underline">\n          {labels.links.devicesPrinters}\n        </Link>\n        <Link href="/app/settings/two-factor"',
    );
    fs.writeFileSync(panel, p);
  }
  console.log("patched settings links");
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Enterprise Printing & Document Output Engine
Route: /app/settings/devices/printers

Print & Output Center: printer connection, print permission control, print offer detection, print preview, print settings, secure printing, print job status, audit log, desktop companion support, enterprise print governance, printable output format, PDF fallback.
Offer prompts: "Should I print this for you?" / "Skal jeg printe dette ut for deg?"
Flow: content created → print relevance detected → user confirms → preview → policy check → job created → desktop/printer execution → status tracked → audit stored.
Security: permission-based printing, sensitive approval, full audit logging, metadata only.
Cross-links: Document Output Engine A.59, Desktop Command Center Phase 27.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "Print & Output Center — Aipify supports physical output when useful; users decide.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/settings/devices/printers";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_PRINT_OFFER_EN = "Should I print this for you?";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_PRINT_OFFER_NO = "Skal jeg printe dette ut for deg?";
`,
  );

  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase281-vocabulary";',
      `export * from "./implementation-blueprint-phase281-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE281_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase281-aipify-enterprise-organizational-consciousness.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE281_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase281-aipify-enterprise-organizational-consciousness.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
  console.log("patched ILM");
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Printing & Document Output Engine (Phase 282):** See [AIPIFY_ENTERPRISE_PRINTING_DOCUMENT_OUTPUT_PHASE282.md](./AIPIFY_ENTERPRISE_PRINTING_DOCUMENT_OUTPUT_PHASE282.md) — Print & Output Center at \`/app/settings/devices/printers\`. Printer connection, permission control, print offer detection, preview, secure printing, job status, audit log, desktop companion bridge, enterprise print governance, and PDF fallback. Migration \`${P.migration}\`. Helpers \`_apoe_*\`, \`_apoebp282_*\`. APIs at \`/api/print/*\` and \`/api/desktop/print/*\`. Permissions \`print.view\`, \`print.execute\`, \`print.department\`, \`print.organization\`, \`print.manage\`. Cross-links Document Output Engine A.59.`;
  if (!c.includes("Phase 282")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_ENTERPRISE_PRINTING_DOCUMENT_OUTPUT_PHASE${P.phase}.md`),
  `# Enterprise Printing & Document Output Engine — Phase ${P.phase}

## Vision

Print & Output Center at \`/app/settings/devices/printers\`. Aipify supports digital and physical output — users decide when printing is useful.

## Permissions

- \`print.view\` · \`print.execute\` · \`print.department\` · \`print.organization\` · \`print.manage\`

## Helpers

- Engine: \`_apoe_*\` · Blueprint: \`_apoebp282_*\`

Cross-links only: Document Output Engine A.59, Desktop Command Center Phase 27.
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Enterprise Printing & Document Output Engine

Route: \`/app/settings/devices/printers\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Enterprise Printing & Document Output Engine — FAQ (Phase ${P.phase})

## Where is Print & Output Center?

Settings → Devices & Integrations → Printers at \`/app/settings/devices/printers\`.

## Can Aipify offer to print documents?

**Yes.** Aipify may ask "Should I print this for you?" / "Skal jeg printe dette ut for deg?" when content is suitable for printing.

## Is printing permission-based?

**Yes.** Users print only to printers they can access. Sensitive documents may require approval. Every job is audited.
`,
);

patchI18n();
patchPermissions();
patchSettingsPage();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
