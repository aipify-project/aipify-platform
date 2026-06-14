import { NextResponse } from "next/server";
import { parseOrganizationalLegacyCenter } from "@/lib/organizational-legacy-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_legacy_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalLegacyCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Legacy Center" }, { status: 500 });
  }
}
