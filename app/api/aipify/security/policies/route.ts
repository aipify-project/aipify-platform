import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAccessPolicies } from "@/lib/aipify/security-compliance/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_access_policies");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ policies: parseAccessPolicies(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list policies" }, { status: 500 });
  }
}
