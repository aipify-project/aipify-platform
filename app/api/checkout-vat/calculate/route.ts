import { NextResponse } from "next/server";
import { calculateCheckoutVat } from "@/lib/checkout-vat-operations/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const data = await calculateCheckoutVat(supabase, body);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to calculate VAT" },
      { status: 500 }
    );
  }
}
