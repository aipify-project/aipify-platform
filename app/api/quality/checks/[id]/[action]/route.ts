import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ id: string; action: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id, action } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "resolve") {
      const { data, error } = await supabase.rpc("resolve_quality_check", { p_check_id: id });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "ignore") {
      const { data, error } = await supabase.rpc("ignore_quality_finding", { p_check_id: id });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update quality check" }, { status: 500 });
  }
}
