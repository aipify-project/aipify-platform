import { getCommerceSubscriptionChangePolicy } from "@/lib/app-commerce/subscription-change-policy";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Self-serve plan changes stay fail-closed until commercial policy is finalized. */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const policy = getCommerceSubscriptionChangePolicy();
  return NextResponse.json(
    {
      ok: false,
      ...policy,
      message: "Subscription changes are read-only until Aipify finalizes proration and effective-date policy.",
    },
    { status: 403 }
  );
}

export async function GET() {
  return NextResponse.json(getCommerceSubscriptionChangePolicy());
}
