import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  try {
    const bookingKey = new URL(request.url).searchParams.get("bookingKey") ?? "";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("int618_booking_readiness", { p_booking_key: bookingKey });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to load booking readiness" }, { status: 500 }); }
}