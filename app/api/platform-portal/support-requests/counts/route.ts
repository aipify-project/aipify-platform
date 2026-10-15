import { NextResponse } from "next/server";
import {
  getPlatformSupportTicketCounts,
  getPlatformSupportTicketsReadGateState,
  httpStatusForSupportTicketsReadDenial,
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
 * Platform Support APP SoT counts — inactive until Core apply + feature gate.
 * Never mixes usage_statistics or legacy queue KPIs.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, { code: "unauthorized" });
    }

    const result = await getPlatformSupportTicketCounts(supabase);

    if (!result.ok) {
      return jsonError(result.message, httpStatusForSupportTicketsReadDenial(result.code), {
        code: result.code,
      });
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load support ticket counts.", 500, {
      code: "unknown",
    });
  }
}
