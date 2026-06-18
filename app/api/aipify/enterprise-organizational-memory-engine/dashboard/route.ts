import { NextResponse } from "next/server";
import { parseOrganizationalMemoryCenter } from "@/lib/aipify/enterprise-organizational-memory-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_organizational_memory_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalMemoryCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load organizational memory center" }, { status: 500 });
  }
}
