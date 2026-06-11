import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { partner_id?: string; reason?: string };
    if (!body.partner_id) return NextResponse.json({ error: "partner_id required" }, { status: 400 });

    const { data, error } = await supabase.rpc("suspend_partner", {
      p_partner_id: body.partner_id,
      p_reason: body.reason,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to suspend partner" }, { status: 500 });
  }
}
