import { NextResponse } from "next/server";
import {
  getPlatformSupportTicket,
  getPlatformSupportTicketsReadGateState,
  httpStatusForSupportTicketsReadDenial,
} from "@/lib/platform-portal/support-tickets-read-adapter";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

type RouteContext = { params: Promise<{ id: string }> };

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
 * Platform Support APP SoT detail — inactive until Core apply + feature gate.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, { code: "unauthorized" });
    }

    const { id } = await context.params;
    const result = await getPlatformSupportTicket(supabase, id);

    if (!result.ok) {
      return jsonError(result.message, httpStatusForSupportTicketsReadDenial(result.code), {
        code: result.code,
      });
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load support ticket.", 500, { code: "unknown" });
  }
}
