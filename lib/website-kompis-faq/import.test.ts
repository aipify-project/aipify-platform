import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { strToU8, zipSync } from "fflate";
import { WPKF_LOCALES } from "@/lib/website-kompis-faq/constants";
import {
  FAQ_CONTENT_LANGUAGE_CODES,
  resolveFaqContentLanguageForSave,
  sortFaqContentLanguageCodes,
} from "@/lib/website-kompis-faq/content-languages";
import { buildFaqImportCsvTemplate, parseFaqImportCsv } from "@/lib/website-kompis-faq/import-csv";
import { planFaqImport } from "@/lib/website-kompis-faq/import-plan";
import {
  FAQ_IMPORT_SCHEMA_VERSION,
  FAQ_IMPORT_TEMPLATE_HEADERS,
  canonicalFaqLocale,
  suggestFaqImportMapping,
  supportedFaqImportLocales,
} from "@/lib/website-kompis-faq/import-schema";
import { buildFaqImportXlsxTemplate, readFaqImportXlsx } from "@/lib/website-kompis-faq/import-xlsx";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const csv = buildFaqImportCsvTemplate();
assert.equal(csv[0], 0xef);
const parsed = parseFaqImportCsv(csv);
assert.ok(!("error" in parsed));
if ("error" in parsed) throw new Error("template");
assert.deepEqual(parsed.table.headers, [...FAQ_IMPORT_TEMPLATE_HEADERS]);
assert.equal(suggestFaqImportMapping(parsed.table.headers).Spørsmål, "question");
assert.equal(suggestFaqImportMapping(["Question", "Answer", "Category", "Language"]).Question, "question");

const quoted = new TextEncoder().encode(
  `\uFEFF${FAQ_IMPORT_SCHEMA_VERSION.startsWith("k") ? "" : ""}Spørsmål,Svar,Kategori,Språk\r\n"Linje\nen","Svar ""sitert""","Betaling","nb-NO"\r\n`,
);
const quotedParsed = parseFaqImportCsv(quoted);
assert.ok(!("error" in quotedParsed));
if (!("error" in quotedParsed)) {
  assert.equal(quotedParsed.table.rows[0]?.[0], "Linje\nen");
  assert.equal(quotedParsed.table.rows[0]?.[1], 'Svar "sitert"');
}

const utf16 = parseFaqImportCsv(Uint8Array.from([0xff, 0xfe, 0x41]));
assert.ok("error" in utf16 && utf16.error === "encoding");

const workbook = readFaqImportXlsx(buildFaqImportXlsxTemplate());
assert.ok(!("error" in workbook));
if (!("error" in workbook)) {
  assert.equal(workbook.selectedSheet, "FAQ");
  assert.deepEqual(workbook.table?.headers, [...FAQ_IMPORT_TEMPLATE_HEADERS]);
  assert.deepEqual(workbook.formulaCells, []);
}

const formulaSheet = `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Spørsmål</t></is></c><c r="B1" t="inlineStr"><is><t>Svar</t></is></c><c r="C1" t="inlineStr"><is><t>Kategori</t></is></c><c r="D1" t="inlineStr"><is><t>Språk</t></is></c></row><row r="2"><c r="A2" t="inlineStr"><is><t>Trygt</t></is></c><c r="B2"><f>SUM(1,1)</f><v>2</v></c><c r="C2" t="inlineStr"><is><t>Betaling</t></is></c><c r="D2" t="inlineStr"><is><t>no</t></is></c></row></sheetData></worksheet>`;
const malicious = zipSync({
  "xl/workbook.xml": strToU8(`<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="FAQ" sheetId="1" r:id="rId1"/></sheets></workbook>`),
  "xl/_rels/workbook.xml.rels": strToU8(`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`),
  "xl/worksheets/sheet1.xml": strToU8(formulaSheet),
});
const maliciousRead = readFaqImportXlsx(malicious);
assert.ok(!("error" in maliciousRead));
if (!("error" in maliciousRead) && maliciousRead.table) {
  const plannedFormula = planFaqImport({
    table: maliciousRead.table,
    formulaCells: maliciousRead.formulaCells,
    installId: "site-a",
    existing: [],
  });
  assert.equal(plannedFormula.rows[0]?.status, "invalid");
  assert.ok(plannedFormula.rows[0]?.issues.some((issue) => issue.code === "formula"));
}

assert.deepEqual([...supportedFaqImportLocales()], [...WPKF_LOCALES]);
assert.equal(WPKF_LOCALES.length, 30);
assert.equal(new Set(FAQ_CONTENT_LANGUAGE_CODES).size, 30);
assert.deepEqual(FAQ_CONTENT_LANGUAGE_CODES.slice(0, 6), ["no", "en", "sv", "da", "pl", "uk"]);
for (const [alias, code] of [
  ["en", "en"],
  ["english", "en"],
  ["nb-NO", "no"],
  ["norsk", "no"],
  ["svenska", "sv"],
  ["dansk", "da"],
  ["polski", "pl"],
  ["українська", "uk"],
] as const) {
  assert.equal(canonicalFaqLocale(alias), code);
}
assert.equal(canonicalFaqLocale("es"), "es");
assert.equal(canonicalFaqLocale("fr"), "fr");
assert.equal(canonicalFaqLocale("de-AT"), "de");
assert.equal(canonicalFaqLocale("ja"), "ja");
assert.equal(canonicalFaqLocale("zh"), "zh");
assert.equal(canonicalFaqLocale("pt-BR"), null);
assert.equal(canonicalFaqLocale("zh-Hant"), null);
assert.equal(canonicalFaqLocale("xx"), null);
assert.equal(resolveFaqContentLanguageForSave("nb-NO", "nb-NO"), "nb-NO");
assert.equal(resolveFaqContentLanguageForSave("nb-NO", null), "no");
assert.equal(resolveFaqContentLanguageForSave("de", null), "de");

const ready = planFaqImport({
  table: parsed.table,
  installId: "site-a",
  existing: [],
});
assert.equal(ready.fileError, null);
assert.equal(ready.summary.ready, 2);
assert.equal(ready.rows[0]?.validUntil, null);
assert.equal(ready.rows[0]?.title, ready.rows[0]?.question);

const missing = planFaqImport({
  table: { headers: ["Spørsmål", "Svar", "Språk"], rows: [["Hei", "Svar", "no"]] },
  installId: "site-a",
  existing: [],
});
assert.equal(missing.fileError, "missing_column");

const invalid = planFaqImport({
  table: {
    headers: [...FAQ_IMPORT_TEMPLATE_HEADERS],
    rows: [["=cmd", "", "<script>alert(1)</script>", "", "xx", "a, a, =bad", "MAYBE", "18.10.2026", "2026-10-18"]],
  },
  installId: "site-a",
  existing: [],
});
assert.equal(invalid.rows[0]?.status, "invalid");
assert.ok(invalid.rows[0]?.issues.some((issue) => issue.code === "formula"));
assert.ok(invalid.rows[0]?.issues.some((issue) => issue.code === "locale"));
assert.ok(invalid.rows[0]?.issues.some((issue) => issue.code === "html"));

const dated = planFaqImport({
  table: {
    headers: [...FAQ_IMPORT_TEMPLATE_HEADERS],
    rows: [["Åpningstid", "", "Vi svarer på hverdager.", "Kontakt", "no", "kontakt", "NEI", "2026-10-18", "2026-10-18"]],
  },
  installId: "site-a",
  existing: [],
});
assert.ok(dated.rows[0]?.issues.some((issue) => issue.code === "date_window"));

const duplicate = planFaqImport({
  table: {
    headers: ["Spørsmål", "Svar", "Kategori", "Språk"],
    rows: [
      ["Samme", "Svar", "Kontakt", "no"],
      ["Samme", "Svar", "Kontakt", "no"],
      ["Samme", "Svar", "Kontakt", "sv"],
    ],
  },
  installId: "site-a",
  existing: [{ installId: "site-b", locale: "no", question: "Samme", title: "Samme", status: "published" }],
});
assert.equal(duplicate.rows[0]?.status, "ready");
assert.equal(duplicate.rows[1]?.status, "duplicate");
assert.equal(duplicate.rows[2]?.status, "ready");
const sameSite = planFaqImport({
  table: duplicate.rows.length
    ? { headers: ["Spørsmål", "Svar", "Kategori", "Språk"], rows: [["Samme", "Svar", "Kontakt", "no"]] }
    : { headers: [], rows: [] },
  installId: "site-a",
  existing: [{ installId: "site-a", locale: "no", question: "Samme", title: "Samme", status: "published" }],
});
assert.equal(sameSite.rows[0]?.status, "duplicate");

const commit = read("app/api/website-kompis/faq/import/route.ts");
assert.match(commit, /p_public_safe: false/);
assert.match(commit, /saved.status !== "draft"/);
assert.doesNotMatch(commit, /\/publish/);
assert.match(read("lib/website-kompis-faq/publish-flow.ts"), /export async function runFaqPublishFlow/);
assert.match(read("components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx"), /runFaqPublishFlow|planWebsiteKompisFaqPublish/);
assert.match(read("components/app/website-kompis/WebsiteKompisFaqImportWorkspace.tsx"), /role="dialog"/);
assert.match(read("components/app/website-kompis/WebsiteKompisFaqImportWorkspace.tsx"), /aria-current/);
assert.match(read("components/app/website-kompis/WebsiteKompisFaqImportWorkspace.tsx"), /md:hidden/);
assert.doesNotMatch(read("components/app/website-kompis/WebsiteKompisFaqImportWorkspace.tsx"), /Core|RPC|tenant/);

const csvText = new TextDecoder().decode(csv);
for (const code of FAQ_CONTENT_LANGUAGE_CODES) {
  assert.match(csvText, new RegExp(`(?:^|\\s)${code}(?:\\s|$)`, "m"));
}
const readme = readFaqImportXlsx(buildFaqImportXlsxTemplate(), "Read me");
assert.ok(!("error" in readme));
if (!("error" in readme)) {
  const note = readme.table?.rows.map((row) => row.join(" ")).join("\n") ?? "";
  assert.match(note, /de/);
  assert.match(note, /ja/);
  assert.match(note, /zh/);
  assert.match(note, /pt-BR/);
}

const expanded = planFaqImport({
  table: {
    headers: [...FAQ_IMPORT_TEMPLATE_HEADERS],
    rows: [
      ["Deutsch", "", "Antwort", "Allgemein", "de", "", "JA", "", ""],
      ["Nihongo", "", "Kotae", "Ippan", "ja", "", "JA", "", ""],
      ["Zhongwen", "", "Daan", "Yiban", "zh", "", "JA", "", ""],
      ["Unknown", "", "Answer", "General", "xx", "", "JA", "", ""],
    ],
  },
  installId: "site-a",
  existing: [],
});
assert.equal(expanded.summary.ready, 3);
assert.equal(expanded.summary.invalid, 1);
assert.equal(expanded.summary.duplicates, 0);
assert.equal(expanded.summary.ready + expanded.summary.duplicates + expanded.summary.invalid, expanded.rows.length);
assert.equal(expanded.rows[0]?.locale, "de");
assert.equal(expanded.rows[1]?.locale, "ja");
assert.equal(expanded.rows[2]?.locale, "zh");
assert.equal(expanded.rows[0]?.validUntil, null);
assert.ok(expanded.rows[3]?.issues.some((issue) => issue.code === "locale"));

const norwegian = JSON.parse(read("locales/no/customer-app/core.json")) as {
  websiteKompisFaq: { locales: Record<string, string> };
};
const sorted = sortFaqContentLanguageCodes(
  FAQ_CONTENT_LANGUAGE_CODES,
  (code) => norwegian.websiteKompisFaq.locales[code] ?? code,
  "nb",
);
assert.equal(sorted[0], "ar");
assert.equal(sorted.at(-1), "hu");
assert.equal(norwegian.websiteKompisFaq.locales.no, "Norsk");
assert.equal(norwegian.websiteKompisFaq.locales.de, "Tysk");

const panel = read("components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx");
assert.equal(panel.match(/data-faq-library-actions/g)?.length, 1);
assert.match(panel, /FaqContentLanguagePicker/);
assert.doesNotMatch(panel, /WebsiteKompisFaqImportActions/);
const actionsAt = panel.indexOf("data-faq-library-actions");
const siteAt = panel.indexOf("labels.siteContext.label");
assert.ok(actionsAt > 0 && siteAt > actionsAt);
assert.match(read("components/dashboard/nav-icons.tsx"), /case "kompisWebFaq":\s*return <BookOpen/);
assert.match(read("locales/no/customer-app/portalStructure.json"), /"kompisWebFaq": "Kunnskapssenter"/);
assert.match(read("locales/no/customer-app/portalStructure.json"), /"kompisWebQa": "Spørsmål og svar"/);
assert.match(read("app/api/website-kompis/faq/route.ts"), /resolveFaqContentLanguageForSave/);
assert.match(read("components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"), /FaqContentLanguagePicker/);
assert.match(read("components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"), /backgroundColor: "#ffffff"/);

console.log("faq-import.test.ts: ok");
