import { NextResponse } from "next/server";
import { getPartnerOpportunitiesPipeline } from "@/lib/core/partner-opportunities";
import { parsePartnerOpportunitiesPipeline } from "@/lib/partner-opportunities";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerOpportunitiesPipeline(supabase);
    const parsed = parsePartnerOpportunitiesPipeline(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load pipeline" }, { status: 500 });
  }
}
