import { NextRequest, NextResponse } from "next/server";
import {
  getPlatformSupportTicketsReadGateState,
  httpStatusForSupportTicketsReadDenial,
  listPlatformSupportTickets,
} from "@/lib/platform-portal/support-tickets-read-adapter";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(
  error: string,
  status: number,
  extras: Record<string, unknown> = {},
) {
  return NextResponse.json(
    { error, ...getPlatformSupportTicketsReadGateState(), ...extras },
    { status, headers: NO_STORE },
  );
}

/**
 * Platform Support APP SoT list — inactive until Core apply + feature gate.
 * Never invents tickets. Never uses service-role. Never trusts client role flags.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, { code: "unauthorized" });
    }

    const sp = request.nextUrl.searchParams;
    const result = await listPlatformSupportTickets(supabase, {
      status: sp.get("status"),
      channel: sp.get("channel"),
      category: sp.get("category"),
      priority: sp.get("priority"),
      companyId: sp.get("company_id"),
      dateFrom: sp.get("date_from"),
      dateTo: sp.get("date_to"),
      search: sp.get("search"),
      sort: sp.get("sort"),
      page: sp.get("page") ? Number(sp.get("page")) : 1,
      pageSize: sp.get("page_size") ? Number(sp.get("page_size")) : 25,
    });

    if (!result.ok) {
      return jsonError(result.message, httpStatusForSupportTicketsReadDenial(result.code), {
        code: result.code,
      });
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to list support tickets.", 500, { code: "unknown" });
  }
}
