import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("pay617_validate_checkout", {
      p_booking_key: typeof body.booking_key === "string" ? body.booking_key : "",
      p_amount: typeof body.amount === "number" ? body.amount : null,
      p_currency_code: typeof body.currency_code === "string" ? body.currency_code : "NOK",
    });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to validate checkout" }, { status: 500 });
  }
}
