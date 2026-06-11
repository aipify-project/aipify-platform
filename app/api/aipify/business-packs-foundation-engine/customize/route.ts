import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { pack_key?: string; customizations?: Record<string, unknown> };
    if (!body.pack_key) return NextResponse.json({ error: "pack_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("customize_organization_business_pack", {
      p_pack_key: body.pack_key,
      p_customizations: body.customizations ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to customize business pack" }, { status: 500 });
  }
}
