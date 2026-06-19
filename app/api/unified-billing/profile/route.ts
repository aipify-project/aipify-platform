import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_customer_unified_billing_profile_center");
  if (error) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("upsert_aipify_billing_profile", {
    p_payload: payload,
  });
  if (error) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
