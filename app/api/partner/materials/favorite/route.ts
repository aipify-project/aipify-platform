import { NextResponse } from "next/server";
import { togglePartnerMaterialFavorite } from "@/lib/core/partner-materials";
import { parsePartnerMaterialsFavorites } from "@/lib/partner-materials";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { material_id?: string };
    if (!body.material_id) {
      return NextResponse.json({ error: "material_id required" }, { status: 400 });
    }

    const data = await togglePartnerMaterialFavorite(supabase, body.material_id);
    const parsed = parsePartnerMaterialsFavorites(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update favorite";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
