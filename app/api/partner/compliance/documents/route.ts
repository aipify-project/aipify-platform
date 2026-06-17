import { NextResponse } from "next/server";
import { getPartnerComplianceDocuments } from "@/lib/core/partner-compliance";
import { parsePartnerComplianceDocuments } from "@/lib/partner-compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerComplianceDocuments(supabase, {
      document_status: url.searchParams.get("document_status") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerComplianceDocuments(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load documents" }, { status: 500 });
  }
}
