import { NextResponse } from "next/server";
import { parseRelationshipProfileDetail } from "@/lib/aipify/companion-relationship-intelligence/parse";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_relationship_profile", {
      p_profile_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseRelationshipProfileDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load relationship profile" }, { status: 500 });
  }
}
