import { NextResponse } from "next/server";
import {
  BRREG_NAME_MIN_LENGTH,
  searchNorwegianCompanies,
} from "@/lib/brreg/validate-organization";
import { countryHasCompanyLookupProvider, isValidIsoAlpha2Country } from "@/lib/platform-portal/countries";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

/**
 * Server-protected company lookup for Platform customer creation.
 * Norway → Brønnøysund (name or organization number).
 * Other countries → lookup_unavailable (manual operator entry).
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

    const { error: accessError } = await supabase.rpc("get_platform_portal_customers");
    if (accessError) {
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

    if (!row) {
      return jsonError("Invalid lookup input.", 400, "unknown");
    }

    for (const key of Object.keys(row)) {
      if (key !== "countryCode" && key !== "query" && key !== "organizationNumber") {
        return jsonError("Invalid lookup input.", 400, "unknown");
      }
    }

    const countryCode = String(row.countryCode ?? "NO")
      .trim()
      .toUpperCase();
    if (!isValidIsoAlpha2Country(countryCode)) {
      return jsonError("Invalid country.", 400, "invalid_country");
    }

    const query = String(row.query ?? row.organizationNumber ?? "").trim();

    if (!countryHasCompanyLookupProvider(countryCode)) {
      return NextResponse.json(
        {
          status: "lookup_unavailable",
          provider: null,
          countryCode,
          results: [],
        },
        { status: 200, headers: NO_STORE },
      );
    }

    if (!query || query.length < BRREG_NAME_MIN_LENGTH) {
      return NextResponse.json(
        {
          status: "invalid_query",
          provider: "brreg",
          countryCode: "NO",
          results: [],
          minQueryLength: BRREG_NAME_MIN_LENGTH,
        },
        { status: 200, headers: NO_STORE },
      );
    }

    const search = await searchNorwegianCompanies(query);

    if (search.status === "invalid_query") {
      return NextResponse.json(
        {
          status: "invalid_query",
          provider: "brreg",
          countryCode: "NO",
          results: [],
          minQueryLength: BRREG_NAME_MIN_LENGTH,
        },
        { status: 200, headers: NO_STORE },
      );
    }

    if (search.status === "no_results") {
      return NextResponse.json(
        {
          status: "no_results",
          provider: "brreg",
          countryCode: "NO",
          results: [],
        },
        { status: 200, headers: NO_STORE },
      );
    }

    if (search.status === "timeout") {
      return NextResponse.json(
        {
          status: "timeout",
          provider: "brreg",
          countryCode: "NO",
          results: [],
        },
        { status: 200, headers: NO_STORE },
      );
    }

    if (search.status === "rate_limited" || search.status === "service_unavailable") {
      return NextResponse.json(
        {
          status: "service_unavailable",
          provider: "brreg",
          countryCode: "NO",
          results: [],
        },
        { status: 200, headers: NO_STORE },
      );
    }

    // Backward-compatible single-hit shape for existing clients + multi-result list.
    const first = search.results[0] ?? null;
    return NextResponse.json(
      {
        status: search.results.length === 1 ? "valid" : "multiple",
        provider: "brreg",
        countryCode: "NO",
        organizationNumber: first?.registrationNumber ?? null,
        legalName: first?.legalName ?? null,
        results: search.results,
      },
      { status: 200, headers: NO_STORE },
    );
  } catch {
    return jsonError("Unable to look up company.", 500, "unknown");
  }
}
