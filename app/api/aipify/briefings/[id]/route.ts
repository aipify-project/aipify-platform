import { NextResponse } from "next/server";
import { parseBriefingDetail } from "@/lib/app-portal/intelligence-briefings";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_briefing", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseBriefingDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load briefing" }, { status: 500 });
  }
}
