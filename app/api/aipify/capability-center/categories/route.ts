import { NextResponse } from "next/server";
import { parseCapabilityCategories } from "@/lib/app-portal/capability-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_capability_categories");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCapabilityCategories(data));
  } catch {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
