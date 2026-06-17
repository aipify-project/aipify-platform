import { NextResponse } from "next/server";
import { getPartnerMaterials } from "@/lib/core/partner-materials";
import { parsePartnerMaterialsOverview } from "@/lib/partner-materials";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerMaterials(supabase, {
      category: url.searchParams.get("category") ?? undefined,
      language: url.searchParams.get("language") ?? undefined,
      format: url.searchParams.get("format") ?? undefined,
      industry: url.searchParams.get("industry") ?? undefined,
      business_pack: url.searchParams.get("business_pack") ?? undefined,
      version: url.searchParams.get("version") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerMaterialsOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load materials" }, { status: 500 });
  }
}
