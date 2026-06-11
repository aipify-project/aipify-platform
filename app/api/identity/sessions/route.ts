import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_identity_sessions");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ sessions: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to list sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { all?: boolean; session_id?: string };
    const { data, error } = await supabase.rpc("revoke_identity_sessions", {
      p_all: Boolean(body.all),
      p_session_id: body.session_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to revoke sessions" }, { status: 500 });
  }
}
