import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePrivacyRequests } from "@/lib/aipify/security-compliance/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_privacy_requests");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ requests: parsePrivacyRequests(data?.requests ?? data) });
  } catch {
    return NextResponse.json({ error: "Failed to list privacy requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabase.rpc("create_privacy_request", { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create privacy request" }, { status: 500 });
  }
}
