import { NextResponse } from "next/server";
import { parsePaymentOperationsCenter } from "@/lib/payment-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_payment_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePaymentOperationsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load payment operations center" }, { status: 500 });
  }
}
