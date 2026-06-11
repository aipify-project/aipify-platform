import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAipifyAgents, parseAgentRegisterResult } from "@/lib/aipify/enterprise";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_aipify_agents");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ agents: parseAipifyAgents(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list agents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("register_aipify_agent", { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAgentRegisterResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to register agent" }, { status: 500 });
  }
}
