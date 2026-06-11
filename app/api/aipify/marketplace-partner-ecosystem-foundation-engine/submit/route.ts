import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      partner_name?: string;
      partner_type?: string;
      website?: string;
      offering?: Record<string, unknown>;
    };
    if (!body.partner_name) return NextResponse.json({ error: "partner_name required" }, { status: 400 });

    const { data, error } = await supabase.rpc("submit_partner_for_review", {
      p_partner_name: body.partner_name,
      p_partner_type: body.partner_type,
      p_website: body.website,
      p_offering: body.offering,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to submit partner" }, { status: 500 });
  }
}
