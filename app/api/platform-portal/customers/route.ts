import { NextResponse } from "next/server";
import {
  mapCreateCustomerRpcError,
  parseCustomerCreationInput,
  parsePlatformPortalCustomerCreationResult,
} from "@/lib/platform-portal/create-customer";
import { parsePlatformPortalCustomersPayload } from "@/lib/platform-portal/parse";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(
  message: string,
  status: number,
  code?: string,
) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_portal_customers");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(parsePlatformPortalCustomersPayload(data));
  } catch {
    return NextResponse.json({ error: "Unable to load platform customers." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400, "unknown");
    }

    const parsedInput = parseCustomerCreationInput(body);
    if (!parsedInput.ok) {
      return jsonError("Invalid customer creation input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;
    // verificationSource is validated in parseCustomerCreationInput (brreg only for NO).
    const { data, error } = await supabase.rpc("create_platform_portal_customer", {
      p_organization_number: value.organizationNumber,
      p_legal_name: value.legalName,
      p_display_name: value.displayName,
      p_slug: value.slug,
      p_country: value.country,
    });

    if (error) {
      const mapped = mapCreateCustomerRpcError(error.message);
      return jsonError("Unable to create customer.", mapped.status, mapped.code);
    }

    const parsed = parsePlatformPortalCustomerCreationResult(data);
    if (!parsed) {
      return jsonError("Unable to create customer.", 500, "unknown");
    }

    return NextResponse.json(parsed, { status: 201, headers: NO_STORE });
  } catch {
    return jsonError("Unable to create customer.", 500, "unknown");
  }
}
