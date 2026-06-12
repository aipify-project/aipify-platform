import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const { data, error } = await supabase.rpc("list_organization_relationship_profiles", {
      p_category: category,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json({ error: "Failed to list profiles" }, { status: 500 });
  }
}
