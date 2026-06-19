import { NextResponse } from "next/server";
import { parseBusinessPackRuntimeCenter } from "@/lib/business-pack-runtime-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "overview";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organization_business_pack_runtime", {
      p_section: section,
    });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 403 });
    return NextResponse.json(parseBusinessPackRuntimeCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Business Pack runtime" }, { status: 500 });
  }
}
