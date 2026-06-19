import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_customer_unified_billing_center");
  if (error) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
