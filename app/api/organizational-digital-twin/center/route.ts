import { NextResponse } from "next/server";
import { parseOrganizationalDigitalTwinCenter } from "@/lib/organizational-digital-twin-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_digital_twin_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalDigitalTwinCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Digital Twin Center" }, { status: 500 });
  }
}
