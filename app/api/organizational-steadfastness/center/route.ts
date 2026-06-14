import { NextResponse } from "next/server";
import { parseOrganizationalSteadfastnessCenter } from "@/lib/organizational-steadfastness-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_steadfastness_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalSteadfastnessCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Steadfastness Center" }, { status: 500 });
  }
}
