import { NextResponse } from "next/server";
import { parseFaqImportRequest, requireFaqImportUser } from "@/lib/website-kompis-faq/import-server";

export async function POST(request: Request) {
  const auth = await requireFaqImportUser();
  if ("error" in auth) return auth.error;
  const form = await request.formData();
  const parsed = await parseFaqImportRequest(auth.supabase, form);
  if ("error" in parsed) return parsed.error;
  return NextResponse.json({
    schemaVersion: parsed.parsed.plan.schemaVersion,
    headers: parsed.parsed.plan.headers,
    mapping: parsed.parsed.plan.mapping,
    missing: parsed.parsed.plan.missing,
    fileError: parsed.parsed.plan.fileError,
    sheets: parsed.parsed.sheets,
    selectedSheet: parsed.parsed.selectedSheet,
    scanTruncated: parsed.parsed.scanTruncated,
    summary: parsed.parsed.plan.summary,
    rows: parsed.parsed.plan.rows.map((row) => ({
      rowNumber: row.rowNumber,
      status: row.status,
      reference: row.reference,
      question: row.question,
      title: row.title,
      answer: row.answer,
      category: row.category,
      locale: row.locale,
      tags: row.tags,
      validFrom: row.validFrom,
      validUntil: row.validUntil,
      issues: row.issues,
      warnings: row.warnings,
    })),
  });
}
