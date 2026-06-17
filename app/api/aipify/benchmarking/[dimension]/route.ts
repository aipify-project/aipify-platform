import { NextResponse } from "next/server";
import { parseBenchmarkDimensionDetail } from "@/lib/app-portal/enterprise-benchmarking";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ dimension: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { dimension } = await params;
    const { data, error } = await supabase.rpc("get_app_portal_enterprise_benchmarking_dimension", {
      p_dimension_key: dimension,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseBenchmarkDimensionDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dimension detail" }, { status: 500 });
  }
}
