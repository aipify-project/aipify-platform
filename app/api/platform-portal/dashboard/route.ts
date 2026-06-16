import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_portal_dashboard");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to load platform dashboard." }, { status: 500 });
  }
}
