import { FAQ_CONTENT_LANGUAGE_CODES } from "@/lib/website-kompis-faq/content-languages";
import { FAQ_IMPORT_SCHEMA_VERSION, FAQ_IMPORT_TEMPLATE_HEADERS } from "@/lib/website-kompis-faq/import-schema";

export type CsvTable = {
  headers: string[];
  rows: string[][];
};

export function parseFaqImportCsv(bytes: Uint8Array): { table: CsvTable } | { error: "encoding" | "empty" | "delimiter" } {
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) return { error: "encoding" };
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return { error: "encoding" };
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return { error: "encoding" };
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  text = text.replace(/^(?:#[^\n\r]*(?:\r?\n|$))+/, "");
  const records = parseCsvRecords(text);
  if (records.length === 0) return { error: "empty" };
  const headers = records[0] ?? [];
  if (headers.filter((header) => header.trim()).length < 2) return { error: "delimiter" };
  return {
    table: {
      headers: headers.map((header) => header.trim()),
      rows: records.slice(1).map((row) => headers.map((_, index) => row[index] ?? "")),
    },
  };
}

function detectDelimiter(headerLine: string): ";" | "," | null {
  const semicolons = countOutsideQuotes(headerLine, ";");
  const commas = countOutsideQuotes(headerLine, ",");
  if (semicolons === 0 && commas === 0) return null;
  return semicolons > commas ? ";" : ",";
}

function countOutsideQuotes(line: string, char: string): number {
  let count = 0;
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const current = line[index];
    if (current === '"') quoted = !quoted;
    else if (!quoted && current === char) count += 1;
  }
  return count;
}

export function parseCsvRecords(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = detectDelimiter(firstLine) ?? ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const current = text[index] ?? "";
    const next = text[index + 1] ?? "";
    if (quoted) {
      if (current === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (current === '"') {
        quoted = false;
      } else {
        cell += current;
      }
      continue;
    }
    if (current === '"') {
      quoted = true;
      continue;
    }
    if (current === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }
    if (current === "\n" || current === "\r") {
      if (current === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += current;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((record) => record.some((value) => value.length > 0));
}

function csvCell(value: string, delimiter: ";" | ","): string {
  if (/["\n\r;,]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return delimiter === ";" ? value : value;
}

export function buildFaqImportCsvTemplate(): Uint8Array {
  const delimiter = ";";
  const examples = [
    [
      "Kan jeg betale med Vipps?",
      "",
      "Ja, vi tilbyr Vipps der dette er tilgjengelig.",
      "Betaling",
      "no",
      "betaling, vipps",
      "JA",
      "",
      "",
    ],
    [
      "Hvordan kontakter jeg kundeservice?",
      "",
      "Du finner kontaktinformasjonen på nettsiden vår.",
      "Kundeservice",
      "no",
      "kontakt, hjelp",
      "JA",
      "",
      "",
    ],
  ];
  const lines = [
    `# ${FAQ_IMPORT_SCHEMA_VERSION}`,
    `# languages: ${FAQ_CONTENT_LANGUAGE_CODES.join(" ")}`,
    "# Norwegian aliases nb, nn, nb-NO and nn-NO are stored as no. pt-BR, pt-PT, zh-Hans and zh-Hant are rejected.",
    FAQ_IMPORT_TEMPLATE_HEADERS.join(delimiter),
    ...examples.map((row) => row.map((cell) => csvCell(cell, delimiter)).join(delimiter)),
  ];
  return new TextEncoder().encode(`\uFEFF${lines.join("\r\n")}\r\n`);
}
