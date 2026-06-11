import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { campaign_id?: string };

    if (!body.campaign_id) {
      return NextResponse.json({ error: "campaign_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("publish_campaign", {
      p_campaign_id: body.campaign_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to publish campaign" }, { status: 500 });
  }
}
