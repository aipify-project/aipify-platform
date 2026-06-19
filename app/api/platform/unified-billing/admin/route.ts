import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") ?? "overview";
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_platform_unified_billing_admin_center", {
    p_section: section,
  });
  if (error) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
