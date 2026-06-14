import { NextResponse } from "next/server";
import { parseChangeManagementCenter } from "@/lib/change-management-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_change_management_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseChangeManagementCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Change Management Center" }, { status: 500 });
  }
}
