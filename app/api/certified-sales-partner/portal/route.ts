import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson, isKompisHelpAvailableInPartnerContext } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserFromSession } from "@/lib/supabase/session-auth";

/** Partner portal bundle — fail-closed when CSP Core is inactive. */
export async function GET() {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUserFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(
        {
          ...closed.body,
          kompis_help_enabled: isKompisHelpAvailableInPartnerContext(),
        },
        { status: closed.status },
      );
    }
    return NextResponse.json({
      ...(typeof result.data === "object" && result.data ? result.data : { data: result.data }),
      kompis_help_enabled: isKompisHelpAvailableInPartnerContext(),
    });
  } catch {
    return NextResponse.json({ error: "portal_load_failed" }, { status: 500 });
  }
}
