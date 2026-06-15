import { NextRequest, NextResponse } from "next/server";
import { parseProductRoadmapCenter } from "@/lib/product-roadmap";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await request.json();
    const { data, error } = await supabase.rpc("record_product_roadmap_action", {
      p_payload: payload,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseProductRoadmapCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
