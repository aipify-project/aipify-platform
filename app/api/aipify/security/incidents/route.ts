import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSecurityIncidents } from "@/lib/aipify/security-compliance";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_security_incidents");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ incidents: parseSecurityIncidents(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list incidents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabase.rpc("create_security_incident", { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 });
  }
}
