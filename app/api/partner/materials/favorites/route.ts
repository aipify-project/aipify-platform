import { NextResponse } from "next/server";
import { getPartnerMaterialsFavorites } from "@/lib/core/partner-materials";
import { parsePartnerMaterialsFavorites } from "@/lib/partner-materials";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerMaterialsFavorites(supabase);
    const parsed = parsePartnerMaterialsFavorites(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load favorites" }, { status: 500 });
  }
}
