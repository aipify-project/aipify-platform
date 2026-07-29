import { NextResponse } from "next/server";
import { validateNorwegianOrganization } from "@/lib/brreg/validate-organization";
import { normalizeOrganizationNumber } from "@/lib/platform-portal/create-customer";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

/**
 * Server-protected Brønnøysund company lookup for Platform customer creation.
 * Never exposes raw upstream payloads to the browser.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    // Access gate: Platform Owner/Super Admin via existing portal RPC.
    const { error: accessError } = await supabase.rpc("get_platform_portal_customers");
    if (accessError) {
      const message = (accessError.message ?? "").toLowerCase();
      if (
        message.includes("platform portal access denied") ||
        message.includes("access denied") ||
        message.includes("not authorized") ||
        message.includes("permission") ||
        message.includes("forbidden")
      ) {
        return jsonError("Forbidden", 403, "forbidden");
      }
      return jsonError("Forbidden", 403, "forbidden");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400, "unknown");
    }

    const row =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;
    if (!row || Object.keys(row).some((key) => key !== "organizationNumber")) {
      return jsonError("Invalid lookup input.", 400, "unknown");
    }

    const organizationNumber = normalizeOrganizationNumber(row.organizationNumber);
    if (!organizationNumber) {
      return NextResponse.json(
        {
          status: "invalid",
          organizationNumber: null,
          legalName: null,
        },
        { status: 200, headers: NO_STORE },
      );
    }

    const result = await validateNorwegianOrganization(organizationNumber);

    if (result.status === "valid") {
      return NextResponse.json(
        {
          status: "valid",
          organizationNumber,
          legalName: result.companyName,
        },
        { status: 200, headers: NO_STORE },
      );
    }

    if (result.status === "invalid") {
      return NextResponse.json(
        {
          status: "invalid",
          organizationNumber,
          legalName: null,
        },
        { status: 200, headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        status: "service_unavailable",
        organizationNumber,
        legalName: null,
      },
      { status: 200, headers: NO_STORE },
    );
  } catch {
    return jsonError("Unable to look up company.", 500, "unknown");
  }
}
