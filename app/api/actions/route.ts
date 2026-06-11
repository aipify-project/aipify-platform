import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseActionRequests } from "@/lib/trust-action";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const { data, error } = await supabase.rpc("list_action_requests", {
      p_status: status,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ actions: parseActionRequests(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load actions" }, { status: 500 });
  }
}
