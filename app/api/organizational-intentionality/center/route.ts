import { NextResponse } from "next/server";
import { parseOrganizationalIntentionalityCenter } from "@/lib/organizational-intentionality-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_intentionality_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalIntentionalityCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Intentionality Center" }, { status: 500 });
  }
}
