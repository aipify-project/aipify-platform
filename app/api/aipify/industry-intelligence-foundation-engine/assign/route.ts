import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { industry_key?: string };
    if (!body.industry_key) return NextResponse.json({ error: "industry_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("assign_organization_industry_profile", {
      p_industry_key: body.industry_key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to assign industry profile" }, { status: 500 });
  }
}
