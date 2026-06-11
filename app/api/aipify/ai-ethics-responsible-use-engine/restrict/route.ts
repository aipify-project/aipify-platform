import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { use_case_id?: string; reason?: string };
    if (!body.use_case_id) return NextResponse.json({ error: "use_case_id required" }, { status: 400 });

    const { data, error } = await supabase.rpc("restrict_ai_use_case", {
      p_use_case_id: body.use_case_id,
      p_reason: body.reason,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to restrict use case" }, { status: 500 });
  }
}
