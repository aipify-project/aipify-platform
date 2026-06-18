import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("digital_workforce_recruitment_provisioning_action", {
      p_payload: payload,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to perform digital workforce action" }, { status: 500 });
  }
}
