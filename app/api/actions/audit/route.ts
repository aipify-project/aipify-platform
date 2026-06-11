import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("request_id");
    if (!requestId) {
      return NextResponse.json({ error: "request_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("get_action_request_audit", {
      p_request_id: requestId,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ audit: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load audit log" }, { status: 500 });
  }
}
