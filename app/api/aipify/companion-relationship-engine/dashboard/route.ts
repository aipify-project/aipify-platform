import { NextResponse } from "next/server";
import { parseCompanionRelationshipCenter } from "@/lib/aipify/companion-relationship-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_companion_relationship_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCompanionRelationshipCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load companion relationship center" }, { status: 500 });
  }
}
