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

    if (action === "acknowledge") {
      const { data, error } = await supabase.rpc("acknowledge_policy_violation", {
        p_violation_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (id === "run" && action === "scan") {
      const { data, error } = await supabase.rpc("detect_policy_violations");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update violation" }, { status: 500 });
  }
}
