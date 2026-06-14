import { NextResponse } from "next/server";
import { parseOrganizationalFuturesCenter } from "@/lib/organizational-futures-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_futures_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalFuturesCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Futures Center" }, { status: 500 });
  }
}
