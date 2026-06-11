import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const targetType = request.nextUrl.searchParams.get("type");
    const targetId = request.nextUrl.searchParams.get("id");
    if (!targetType || !targetId) {
      return NextResponse.json({ error: "type and id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("explain_memory_item", {
      p_target_type: targetType,
      p_target_id: targetId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to explain memory item" }, { status: 500 });
  }
}
