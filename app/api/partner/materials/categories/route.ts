import { NextResponse } from "next/server";
import { getPartnerMaterialsCategories } from "@/lib/core/partner-materials";
import { parsePartnerMaterialsCategories } from "@/lib/partner-materials";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerMaterialsCategories(supabase);
    const parsed = parsePartnerMaterialsCategories(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
