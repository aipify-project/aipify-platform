import { NextResponse } from "next/server";
import { parseOrganizationalPresenceCenter } from "@/lib/organizational-presence-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_presence_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalPresenceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Presence Center" }, { status: 500 });
  }
}
