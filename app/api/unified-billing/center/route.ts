import { NextResponse } from "next/server";
import { loadUnifiedBillingCenter } from "@/lib/unified-billing-engine/load-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ found: false, error: "unauthenticated" }, { status: 401 });
    }

    const result = await loadUnifiedBillingCenter(supabase);
    return NextResponse.json(
      {
        ...result.center,
        degraded: result.degraded,
      },
      { status: result.status }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unified_billing_unavailable";
    console.error("[unified-billing/center]", message.slice(0, 240));
    return NextResponse.json({ found: false, error: "billing_center_unavailable" }, { status: 500 });
  }
}
