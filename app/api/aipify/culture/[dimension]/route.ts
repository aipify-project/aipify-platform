import { NextResponse } from "next/server";
import { parseCultureDimensionDetail } from "@/lib/app-portal/trust-culture";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ dimension: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { dimension } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_culture_dimension", {
      p_dimension: dimension,
      p_from: searchParams.get("from") || null,
      p_to: searchParams.get("to") || null,
      p_department: searchParams.get("department") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCultureDimensionDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load culture dimension" }, { status: 500 });
  }
}
