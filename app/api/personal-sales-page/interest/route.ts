import { NextResponse } from "next/server";
import { personalSalesLeadEnabled, rejectClientSellerIdentity } from "@/lib/personal-sales-page/lead-gate";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Interest registration stays closed until Core storage is applied and verified.
 * This route never writes a lead and never reports a successful store.
 */
export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (rejectClientSellerIdentity(body)) {
    return NextResponse.json({ ok: false, stored: false, error: "rejected_identity" }, { status: 400, headers: NO_STORE });
  }
  if (!personalSalesLeadEnabled()) {
    return NextResponse.json({ ok: false, stored: false, error: "core_pending" }, { status: 503, headers: NO_STORE });
  }
  return NextResponse.json({ ok: false, stored: false, error: "core_pending" }, { status: 503, headers: NO_STORE });
}
