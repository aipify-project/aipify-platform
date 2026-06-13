import { NextResponse } from "next/server";
import { parseUaafActionAccessCenter } from "@/lib/universal-action-access";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_universal_action_access_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseUaafActionAccessCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load action access center" }, { status: 500 });
  }
}
