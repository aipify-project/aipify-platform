import { NextResponse } from "next/server";
import { parseAipifyDocumentIntelligenceEnterpriseDocumentEngineDashboard } from "@/lib/aipify/aipify-document-intelligence-enterprise-document-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_document_intelligence_enterprise_document_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyDocumentIntelligenceEnterpriseDocumentEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
