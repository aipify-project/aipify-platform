import { NextResponse } from "next/server";
import { getAipifyHostsDocumentCenterDashboard } from "@/lib/core/aipify-hosts-document-center";
import { parseAipifyHostsDocumentCenterDashboard } from "@/lib/aipify/aipify-hosts-document-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getAipifyHostsDocumentCenterDashboard(supabase, {
      section: url.searchParams.get("section") ?? "property_documents",
      search: url.searchParams.get("search"),
      propertyId: url.searchParams.get("property_id"),
      category: url.searchParams.get("category"),
      status: url.searchParams.get("status"),
    });
    const parsed = parseAipifyHostsDocumentCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load document center" }, { status: 500 });
  }
}
