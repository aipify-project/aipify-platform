import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { FAQ_IMPORT_SCHEMA_VERSION, FAQ_IMPORT_TEMPLATE_HEADERS } from "@/lib/website-kompis-faq/import-schema";
import type { CsvTable } from "@/lib/website-kompis-faq/import-csv";

const README_SHEET = "Read me";

export type XlsxReadResult =
  | { error: "workbook" | "sheet" }
  | { sheets: string[]; selectedSheet: string | null; table: CsvTable | null; formulaCells: string[] };

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function xmlDecode(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function columnIndex(cellRef: string): number {
  const letters = /^[A-Z]+/.exec(cellRef.toUpperCase())?.[0] ?? "A";
  let index = 0;
  for (const letter of letters) index = index * 26 + (letter.charCodeAt(0) - 64);
  return index - 1;
}

function rowIndex(cellRef: string): number {
  return Number(/\d+$/.exec(cellRef)?.[0] ?? "1") - 1;
}

function inlineCell(ref: string, value: string): string {
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(value)}</t></is></c>`;
}

function sheetXml(rows: string[][]): string {
  const body = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, column) => inlineCell(`${String.fromCharCode(65 + column)}${rowIndex + 1}`, value))
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

export function buildFaqImportXlsxTemplate(): Uint8Array {
  const examples = [
    ["Kan jeg betale med Vipps?", "", "Ja, vi tilbyr Vipps der dette er tilgjengelig.", "Betaling", "no", "betaling, vipps", "JA", "", ""],
    ["Hvordan kontakter jeg kundeservice?", "", "Du finner kontaktinformasjonen på nettsiden vår.", "Kundeservice", "no", "kontakt, hjelp", "JA", "", ""],
  ];
  const readme = [
    [FAQ_IMPORT_SCHEMA_VERSION],
    ["Fyll ut arket FAQ. Alle rader lagres som utkast. Ingenting publiseres fra filen."],
    ["Påkrevd: Spørsmål, Svar, Kategori og Språk. Språk: en, no, sv, da, pl, uk."],
    ["Tom tittel bruker spørsmålet som tittel. Permanent JA, eller tom sluttdato, betyr at spørsmålet ikke utløper."],
    ["Datoer skrives som tekst: 2026-10-18 eller 2026-10-18T00:00:00Z. Ikke bruk formler."],
    ["Emneord skilles med komma i samme celle."],
  ];
  const files: Record<string, Uint8Array> = {
    "[Content_Types].xml": strToU8(`<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`),
    "xl/workbook.xml": strToU8(`<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="FAQ" sheetId="1" r:id="rId1"/><sheet name="${README_SHEET}" sheetId="2" r:id="rId2"/></sheets></workbook>`),
    "xl/_rels/workbook.xml.rels": strToU8(`<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>`),
    "xl/worksheets/sheet1.xml": strToU8(sheetXml([[...FAQ_IMPORT_TEMPLATE_HEADERS], ...examples])),
    "xl/worksheets/sheet2.xml": strToU8(sheetXml(readme)),
  };
  return zipSync(files);
}

function sharedStrings(xml: string): string[] {
  const values: string[] = [];
  for (const item of xml.split(/<si\b[^>]*>/i).slice(1)) {
    const end = item.indexOf("</si>");
    const body = end >= 0 ? item.slice(0, end) : item;
    const texts = [...body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gi)].map((match) => xmlDecode(match[1] ?? ""));
    values.push(texts.join(""));
  }
  return values;
}

function worksheetTable(xml: string, strings: string[]): { table: CsvTable; formulaCells: string[] } | { error: "sheet" } {
  const formulaCells: string[] = [];
  const grid = new Map<number, Map<number, string>>();
  let maxColumn = 0;
  let maxRow = 0;
  for (const match of xml.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/gi)) {
    const attrs = match[1] ?? "";
    const inner = match[2] ?? "";
    const ref = /r="([^"]+)"/i.exec(attrs)?.[1] ?? "";
    if (!ref) continue;
    if (/<f\b/i.test(inner)) {
      formulaCells.push(ref);
      continue;
    }
    const kind = /t="([^"]+)"/i.exec(attrs)?.[1] ?? "";
    let value = "";
    if (kind === "inlineStr") {
      value = [...inner.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gi)].map((part) => xmlDecode(part[1] ?? "")).join("");
    } else if (kind === "s") {
      const index = Number(/<v>([\s\S]*?)<\/v>/i.exec(inner)?.[1] ?? "");
      value = strings[index] ?? "";
    } else if (kind === "str") {
      value = xmlDecode(/<v>([\s\S]*?)<\/v>/i.exec(inner)?.[1] ?? "");
    } else {
      value = /<v>([\s\S]*?)<\/v>/i.exec(inner)?.[1]?.trim() ?? "";
      if (value && kind !== "b" && !/^[-+]?\d+(\.\d+)?$/.test(value)) value = xmlDecode(value);
    }
    const row = rowIndex(ref);
    const column = columnIndex(ref);
    if (!grid.has(row)) grid.set(row, new Map());
    grid.get(row)?.set(column, value);
    maxColumn = Math.max(maxColumn, column);
    maxRow = Math.max(maxRow, row);
  }
  if (maxRow === 0 && grid.size === 0) return { error: "sheet" };
  const width = maxColumn + 1;
  const headerMap = grid.get(0) ?? new Map<number, string>();
  const headers = Array.from({ length: width }, (_, index) => headerMap.get(index) ?? "");
  const rows: string[][] = [];
  for (let row = 1; row <= maxRow; row += 1) {
    const cells = grid.get(row);
    const values = Array.from({ length: width }, (_, index) => cells?.get(index) ?? "");
    if (values.some((value) => value.trim())) rows.push(values);
  }
  return { table: { headers, rows }, formulaCells };
}

export function readFaqImportXlsx(bytes: Uint8Array, requestedSheet?: string): XlsxReadResult {
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes);
  } catch {
    return { error: "workbook" };
  }
  if (Object.keys(files).some((name) => name.toLowerCase().includes("vbaproject"))) return { error: "workbook" };
  const workbook = files["xl/workbook.xml"];
  const rels = files["xl/_rels/workbook.xml.rels"];
  if (!workbook || !rels) return { error: "workbook" };
  const workbookXml = strFromU8(workbook);
  const relsXml = strFromU8(rels);
  const sheets = [...workbookXml.matchAll(/<sheet\b[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/gi)].map((match) => ({
    name: xmlDecode(match[1] ?? ""),
    id: match[2] ?? "",
  }));
  if (sheets.length === 0) return { error: "workbook" };
  const names = sheets.map((sheet) => sheet.name);
  const dataSheets = sheets.filter((sheet) => sheet.name !== README_SHEET);
  const selected = requestedSheet
    ? sheets.find((sheet) => sheet.name === requestedSheet) ?? null
    : dataSheets.length === 1
      ? dataSheets[0]
      : sheets.length === 1
        ? sheets[0]
        : null;
  if (!selected) return { sheets: names, selectedSheet: null, table: null, formulaCells: [] };
  const target = new RegExp(`Id="${selected.id}"[^>]*Target="([^"]+)"`, "i").exec(relsXml)?.[1];
  if (!target) return { error: "sheet" };
  const path = target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^\.\.\//, "")}`;
  const sheetFile = files[path] ?? files[`xl/${target}`];
  if (!sheetFile) return { error: "sheet" };
  const strings = files["xl/sharedStrings.xml"] ? sharedStrings(strFromU8(files["xl/sharedStrings.xml"])) : [];
  const parsed = worksheetTable(strFromU8(sheetFile), strings);
  if ("error" in parsed) return { error: "sheet" };
  return { sheets: names, selectedSheet: selected.name, table: parsed.table, formulaCells: parsed.formulaCells };
}
