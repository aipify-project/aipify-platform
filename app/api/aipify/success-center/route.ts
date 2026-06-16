import { NextResponse } from "next/server";
import { parseSuccessCenter } from "@/lib/app-portal/success-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_success_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseSuccessCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load success center" }, { status: 500 });
  }
}
