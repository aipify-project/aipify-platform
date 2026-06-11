import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseQualityIncidents } from "@/lib/aipify/quality";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const limit = Number(url.searchParams.get("limit") ?? "50");

    const { data, error } = await supabase.rpc("get_quality_incidents", {
      p_status: status,
      p_limit: limit,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseQualityIncidents(data));
  } catch {
    return NextResponse.json({ error: "Failed to load incidents" }, { status: 500 });
  }
}
