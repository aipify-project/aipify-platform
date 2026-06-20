import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area") ?? "communications";
    const entityType = searchParams.get("entity_type") ?? "";
    const entityKey = searchParams.get("entity_key") ?? "";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_organization_service_experience_detail", {
      p_area: area,
      p_entity_type: entityType,
      p_entity_key: entityKey,
    });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load service experience detail" }, { status: 500 });
  }
}
