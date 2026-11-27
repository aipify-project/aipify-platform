import { NextResponse } from "next/server";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";
import { parsePersonalPageInterests } from "@/lib/personal-sales-page/interest";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** The signed-in Growth Partner's own personal-page interests. Missing Core is unavailable, not zero. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });

  const result = await callCspRpc(supabase, "list_own_personal_sales_page_interests");
  if (!result.ready) {
    return NextResponse.json({ available: false, interests: [] }, { headers: NO_STORE });
  }
  return NextResponse.json(
    { available: true, interests: parsePersonalPageInterests(result.data) },
    { headers: NO_STORE },
  );
}
