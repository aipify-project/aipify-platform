import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDesktopModes } from "@/lib/aipify/desktop";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_desktop_modes");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopModes(data));
  } catch {
    return NextResponse.json({ error: "Failed to load modes" }, { status: 500 });
  }
}
