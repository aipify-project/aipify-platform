import { NextResponse } from "next/server";
import { parseOrganizationalCourageCenter } from "@/lib/organizational-courage-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_courage_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalCourageCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Courage Center" }, { status: 500 });
  }
}
