import { NextResponse } from "next/server";
import { parseGroupOverviewCenter } from "@/lib/group-organization";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_group_overview_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseGroupOverviewCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load group overview" }, { status: 500 });
  }
}
