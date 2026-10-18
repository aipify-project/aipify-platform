import {
  WPKF_ANSWER_MAX_LENGTH,
  WPKF_CATEGORY_MAX_LENGTH,
  WPKF_MAX_TAGS,
  WPKF_QUESTION_MAX_LENGTH,
  WPKF_TAG_MAX_LENGTH,
  WPKF_TITLE_MAX_LENGTH,
} from "@/lib/website-kompis-faq/constants";
import type { CsvTable } from "@/lib/website-kompis-faq/import-csv";
import {
  FAQ_IMPORT_MAX_ROWS,
  FAQ_IMPORT_REQUIRED_FIELDS,
  FAQ_IMPORT_SCHEMA_VERSION,
  canonicalFaqLocale,
  suggestFaqImportMapping,
  type FaqImportColumnTarget,
  type FaqImportField,
} from "@/lib/website-kompis-faq/import-schema";

export type FaqImportIssueCode =
  | "required"
  | "too_long"
  | "html"
  | "formula"
  | "locale"
  | "permanent"
  | "date"
  | "date_window"
  | "date_required"
  | "tags"
  | "duplicate_file"
  | "duplicate_existing";

export type FaqImportRowStatus = "ready" | "invalid" | "duplicate";

export type FaqImportExistingIdentity = {
  installId: string | null;
  locale: string;
  question: string | null;
  title: string;
  status: string;
};

export type PlannedFaqImportRow = {
  rowNumber: number;
  status: FaqImportRowStatus;
  reference: string;
  question: string;
  title: string;
  answer: string;
  category: string;
  locale: string;
  tags: string[];
  validFrom: string | null;
  validUntil: string | null;
  issues: Array<{ field: string; code: FaqImportIssueCode }>;
  warnings: Array<{ field: string; code: "date_kept" }>;
};

export type FaqImportPlan = {
  schemaVersion: typeof FAQ_IMPORT_SCHEMA_VERSION;
  headers: string[];
  mapping: Record<string, FaqImportColumnTarget>;
  missing: string[];
  rows: PlannedFaqImportRow[];
  summary: { ready: number; duplicates: number; invalid: number };
  fileError: "too_many_rows" | "missing_column" | "duplicate_mapping" | null;
};

const FORMULA_PREFIX = /^[=+\-@\t\r]/;
const HTML_TAG = /<\/?[a-z][^>]*>/i;

export function faqImportIdentity(installId: string | null, locale: string, question: string, title: string): string {
  const text = (question.trim() || title.trim()).toLowerCase().replace(/\s+/g, " ");
  return `${installId ?? ""}|${locale.trim().toLowerCase()}|${text}`;
}

function mappedValue(row: string[], headers: string[], mapping: Record<string, FaqImportColumnTarget>, field: FaqImportField): string {
  const index = headers.findIndex((header) => mapping[header] === field);
  return index >= 0 ? (row[index] ?? "").trim() : "";
}

function parseDate(value: string): string | null | "invalid" {
  if (!value) return null;
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (day) {
    const iso = `${day[1]}-${day[2]}-${day[3]}T00:00:00.000Z`;
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return "invalid";
    return iso;
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return "invalid";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "invalid";
  return parsed.toISOString();
}

function parsePermanent(value: string): boolean | "invalid" {
  if (!value) return true;
  const key = value.trim().toLowerCase();
  if (["ja", "yes", "true", "1", "j", "y"].includes(key)) return true;
  if (["nei", "no", "false", "0", "n"].includes(key)) return false;
  return "invalid";
}

function parseTags(value: string): { tags: string[] } | { error: "tags" } {
  if (!value) return { tags: [] };
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of value.split(",")) {
    const tag = part.trim();
    if (!tag) continue;
    if (tag.length > WPKF_TAG_MAX_LENGTH || FORMULA_PREFIX.test(tag) || HTML_TAG.test(tag)) return { error: "tags" };
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
  }
  if (tags.length > WPKF_MAX_TAGS) return { error: "tags" };
  return { tags };
}

function unsafeText(value: string): "formula" | "html" | null {
  if (FORMULA_PREFIX.test(value)) return "formula";
  if (HTML_TAG.test(value)) return "html";
  return null;
}

export function planFaqImport(input: {
  table: CsvTable;
  mapping?: Record<string, FaqImportColumnTarget>;
  formulaCells?: string[];
  installId: string | null;
  existing: readonly FaqImportExistingIdentity[];
}): FaqImportPlan {
  const headers = input.table.headers;
  const mapping = input.mapping ?? suggestFaqImportMapping(headers);
  const used = new Map<FaqImportColumnTarget, number>();
  for (const target of Object.values(mapping)) {
    if (target === "ignore" || target === "status") continue;
    used.set(target, (used.get(target) ?? 0) + 1);
  }
  const duplicateMapping = [...used.values()].some((count) => count > 1);
  const missing = FAQ_IMPORT_REQUIRED_FIELDS.filter((field) => !Object.values(mapping).includes(field));
  const fileError = duplicateMapping ? "duplicate_mapping" : missing.length > 0 ? "missing_column" : input.table.rows.length > FAQ_IMPORT_MAX_ROWS ? "too_many_rows" : null;
  const formulaRows = new Set(
    (input.formulaCells ?? []).map((cell) => Number(/\d+$/.exec(cell)?.[0] ?? "0")),
  );
  const seen = new Set<string>();
  const existing = new Set(
    input.existing
      .filter((item) => item.status === "draft" || item.status === "published")
      .map((item) => faqImportIdentity(item.installId, item.locale, item.question ?? "", item.title)),
  );
  const rows: PlannedFaqImportRow[] = fileError
    ? []
    : input.table.rows.map((source, index) => {
        const rowNumber = index + 2;
        const issues: PlannedFaqImportRow["issues"] = [];
        const warnings: PlannedFaqImportRow["warnings"] = [];
        const question = mappedValue(source, headers, mapping, "question");
        const suppliedTitle = mappedValue(source, headers, mapping, "title");
        const answer = mappedValue(source, headers, mapping, "answer");
        const category = mappedValue(source, headers, mapping, "category");
        const localeInput = mappedValue(source, headers, mapping, "locale");
        const locale = canonicalFaqLocale(localeInput) ?? "";
        const permanent = parsePermanent(mappedValue(source, headers, mapping, "permanent"));
        const fromRaw = mappedValue(source, headers, mapping, "validFrom");
        const untilRaw = mappedValue(source, headers, mapping, "validUntil");
        const validFrom = parseDate(fromRaw);
        const validUntil = parseDate(untilRaw);
        const tags = parseTags(mappedValue(source, headers, mapping, "tags"));
        const reference = mappedValue(source, headers, mapping, "reference");
        const title = suppliedTitle || question;

        if (formulaRows.has(rowNumber)) issues.push({ field: "row", code: "formula" });
        for (const [field, value, max] of [
          ["question", question, WPKF_QUESTION_MAX_LENGTH],
          ["answer", answer, WPKF_ANSWER_MAX_LENGTH],
          ["category", category, WPKF_CATEGORY_MAX_LENGTH],
        ] as const) {
          if (!value) issues.push({ field, code: "required" });
          else if (value.length > max) issues.push({ field, code: "too_long" });
          else {
            const unsafe = unsafeText(value);
            if (unsafe) issues.push({ field, code: unsafe });
          }
        }
        if (suppliedTitle) {
          if (suppliedTitle.length > WPKF_TITLE_MAX_LENGTH) issues.push({ field: "title", code: "too_long" });
          else {
            const unsafe = unsafeText(suppliedTitle);
            if (unsafe) issues.push({ field: "title", code: unsafe });
          }
        } else if (question.length > WPKF_TITLE_MAX_LENGTH) {
          issues.push({ field: "title", code: "too_long" });
        }
        if (!localeInput) issues.push({ field: "locale", code: "required" });
        else if (!locale) issues.push({ field: "locale", code: "locale" });
        if (permanent === "invalid") issues.push({ field: "permanent", code: "permanent" });
        if ("error" in tags) issues.push({ field: "tags", code: "tags" });
        if (validFrom === "invalid") issues.push({ field: "validFrom", code: "date" });
        if (validUntil === "invalid") issues.push({ field: "validUntil", code: "date" });
        const from = validFrom === "invalid" ? null : validFrom;
        const until = validUntil === "invalid" ? null : validUntil;
        if (permanent === false && !until) issues.push({ field: "validUntil", code: "date_required" });
        if (from && until && from >= until) issues.push({ field: "validUntil", code: "date_window" });
        if (permanent === true && (from || until)) warnings.push({ field: "validUntil", code: "date_kept" });

        const identity = faqImportIdentity(input.installId, locale, question, title);
        let status: FaqImportRowStatus = issues.length > 0 ? "invalid" : "ready";
        if (status === "ready" && question) {
          if (seen.has(identity)) {
            status = "duplicate";
            issues.push({ field: "question", code: "duplicate_file" });
          } else if (existing.has(identity)) {
            status = "duplicate";
            issues.push({ field: "question", code: "duplicate_existing" });
          } else {
            seen.add(identity);
          }
        }
        return {
          rowNumber,
          status,
          reference,
          question,
          title,
          answer,
          category,
          locale,
          tags: "error" in tags ? [] : tags.tags,
          validFrom: permanent === true && !from && !until ? null : from,
          validUntil: permanent === true && !from && !until ? null : until,
          issues,
          warnings,
        };
      });

  return {
    schemaVersion: FAQ_IMPORT_SCHEMA_VERSION,
    headers,
    mapping,
    missing: [...missing],
    rows,
    summary: {
      ready: rows.filter((row) => row.status === "ready").length,
      duplicates: rows.filter((row) => row.status === "duplicate").length,
      invalid: rows.filter((row) => row.status === "invalid").length,
    },
    fileError,
  };
}
