import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createCspListClient,
  CspScopedReadError,
  resolveCspPartnerScope,
  type CspListClient,
} from "./partner-scoped-read";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Shared handler for partner-scoped CSP list APIs. Fail-closed at every step:
 * no session → 401 · no/inactive partner → 404/403 · Core tables not applied → 503 · anything else → 500.
 * The partner id is ALWAYS resolved from the session user; request input is never consulted.
 */
export async function handleCspPartnerScopedList<T>(input: {
  responseKey: "leads" | "customers";
  failureCode: string;
  load: (client: CspListClient, partnerId: string) => Promise<T[]>;
}): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });

    const scope = await resolveCspPartnerScope(user.id);
    if (!scope.ok) {
      if (scope.reason === "partner_not_found") {
        return NextResponse.json(
          { found: false, backend_ready: true, error: "partner_not_found" },
          { status: 404, headers: NO_STORE },
        );
      }
      if (scope.reason === "partner_not_active") {
        return NextResponse.json({ error: "partner_not_active" }, { status: 403, headers: NO_STORE });
      }
      return NextResponse.json({ error: input.failureCode }, { status: 500, headers: NO_STORE });
    }

    try {
      const rows = await input.load(createCspListClient(), scope.partnerId);
      return NextResponse.json({ found: true, [input.responseKey]: rows }, { headers: NO_STORE });
    } catch (error) {
      if (error instanceof CspScopedReadError && error.kind === "not_applied") {
        return NextResponse.json(
          { found: false, backend_ready: false, error: "csp_backend_not_applied", detail: null },
          { status: 503, headers: NO_STORE },
        );
      }
      return NextResponse.json({ error: input.failureCode }, { status: 500, headers: NO_STORE });
    }
  } catch {
    return NextResponse.json({ error: input.failureCode }, { status: 500, headers: NO_STORE });
  }
}
