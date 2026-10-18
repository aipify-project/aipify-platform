import { NextResponse } from "next/server";
import { parseWebsiteKompisFaqUpsertResult } from "@/lib/website-kompis-faq/parse";
import { parseFaqImportRequest, requireFaqImportUser } from "@/lib/website-kompis-faq/import-server";

export async function POST(request: Request) {
  const auth = await requireFaqImportUser();
  if ("error" in auth) return auth.error;
  const form = await request.formData();
  const parsed = await parseFaqImportRequest(auth.supabase, form);
  if ("error" in parsed) return parsed.error;
  if (parsed.parsed.plan.fileError || parsed.ready.length === 0) {
    return NextResponse.json(
      {
        outcome: "blocked",
        imported: 0,
        fileError: parsed.parsed.plan.fileError,
        summary: parsed.parsed.plan.summary,
        results: parsed.parsed.plan.rows.map((row) => ({
          rowNumber: row.rowNumber,
          status: row.status === "ready" ? "skipped" : row.status,
        })),
      },
      { status: 422 },
    );
  }

  const results: Array<{ rowNumber: number; status: "draft" | "skipped" | "failed"; id?: string }> = [];
  let imported = 0;
  for (const row of parsed.parsed.plan.rows) {
    if (row.status !== "ready") {
      results.push({ rowNumber: row.rowNumber, status: "skipped" });
      continue;
    }
    const { data, error } = await auth.supabase.rpc("upsert_tenant_public_companion_faq_item", {
      p_item_id: null,
      p_install_id: parsed.parsed.installId,
      p_domain: parsed.parsed.domain,
      p_locale: row.locale,
      p_title: row.title,
      p_question: row.question,
      p_answer: row.answer,
      p_category: row.category,
      p_content_type: "faq",
      p_public_safe: false,
      p_priority: 100,
      p_tags: row.tags,
      p_source_url: null,
      p_valid_from: row.validFrom,
      p_valid_until: row.validUntil,
      p_last_reviewed_at: null,
    });
    let saved: { id: string; status: string; created: boolean } | null = null;
    try {
      saved = error ? null : parseWebsiteKompisFaqUpsertResult(data);
    } catch {
      saved = null;
    }
    if (!saved || saved.status !== "draft" || saved.created !== true) {
      results.push({ rowNumber: row.rowNumber, status: "failed" });
      continue;
    }
    imported += 1;
    results.push({ rowNumber: row.rowNumber, status: "draft", id: saved.id });
  }

  const failed = results.some((row) => row.status === "failed");
  return NextResponse.json({
    outcome: imported === 0 ? "failed" : failed ? "partial" : "imported",
    imported,
    published: 0,
    summary: parsed.parsed.plan.summary,
    results,
  });
}
