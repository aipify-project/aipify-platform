import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    return NextResponse.json({
      preview: {
        document_title: body.document_title ?? "Untitled document",
        document_type: body.document_type ?? "general",
        page_count: body.page_count ?? 1,
        printer_id: body.printer_id ?? null,
        printer_name: body.printer_name ?? null,
        paper_size: body.paper_size ?? "A4",
        color_mode: body.color_mode ?? "auto",
        duplex: body.duplex ?? true,
        copies: body.copies ?? 1,
        sensitivity_level: body.sensitivity_level ?? "standard",
        include_header_footer: body.include_header_footer ?? true,
        include_company_logo: body.include_company_logo ?? true,
        prepared_by: "Aipify",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to build print preview" }, { status: 500 });
  }
}
