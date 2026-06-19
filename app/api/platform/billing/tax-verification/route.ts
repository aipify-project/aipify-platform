import { NextResponse } from "next/server";
import { getPlatformTaxVerificationCenter } from "@/lib/checkout-vat-operations/client";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPlatformTaxVerificationCenter(supabase);
    return NextResponse.json(data ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load tax verification center" },
      { status: 500 }
    );
  }
}
