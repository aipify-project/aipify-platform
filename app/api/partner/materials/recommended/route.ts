import { NextResponse } from "next/server";
import { getPartnerMaterialsRecommended } from "@/lib/core/partner-materials";
import { parsePartnerMaterialsRecommended } from "@/lib/partner-materials";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerMaterialsRecommended(supabase);
    const parsed = parsePartnerMaterialsRecommended(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
