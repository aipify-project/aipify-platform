import { NextResponse } from "next/server";
import { parseGenerateDocumentOutputResult } from "@/lib/aipify/document-output-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      template_id?: string;
      report_type?: string;
      format?: string;
      source_context?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("generate_document_output", {
      p_template_id: body.template_id ?? null,
      p_report_type: body.report_type ?? "executive",
      p_format: body.format ?? "pdf",
      p_source_context: body.source_context ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGenerateDocumentOutputResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate output" }, { status: 500 });
  }
}
