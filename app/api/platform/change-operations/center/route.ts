import { NextResponse } from "next/server";
import { parseChangeOperationsCenter } from "@/lib/change-operations-engine/parse";
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

    const { data, error } = await supabase.rpc("get_platform_change_operations_center", { p_section: section });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 403 });
    return NextResponse.json(parseChangeOperationsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Change Operations Center" }, { status: 500 });
  }
}
