import { NextRequest, NextResponse } from "next/server";
import { resolveCspPartnerScope } from "@/lib/certified-sales-partner/partner-scoped-read";
import { getSupportIntakeGateState } from "@/lib/support-intake";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Partner-scoped ticket list. Fail-closed until list_partner_support_requests exists
 * and intake feature gate is intentional — RPC missing → temporarily unavailable.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers: NO_STORE });
    }

    const scope = await resolveCspPartnerScope(user.id);
    if (!scope.ok) {
      return NextResponse.json({ error: "Forbidden", code: "forbidden" }, { status: 403, headers: NO_STORE });
    }

    const status = request.nextUrl.searchParams.get("status");
    const { data, error } = await supabase.rpc("list_partner_support_requests", {
      p_status: status && status.trim() ? status.trim() : null,
      p_page: 1,
      p_page_size: 50,
    });

    if (error) {
      const missing =
        error.code === "PGRST202" ||
        /does not exist|schema cache/i.test(error.message || "");
      return NextResponse.json(
        {
          error: missing
            ? "Supportsaker er midlertidig utilgjengelige."
            : "Kunne ikke hente supportsaker.",
          code: missing ? "core_not_applied" : "unknown",
          ...getSupportIntakeGateState(),
          live: false,
        },
        { status: missing ? 503 : 500, headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        partnerId: scope.partnerId,
        ...(data && typeof data === "object" ? (data as object) : { items: [] }),
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke hente supportsaker.", code: "unknown" },
      { status: 500, headers: NO_STORE },
    );
  }
}
