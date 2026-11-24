import { NextResponse } from "next/server";
import {
  callCspRpc,
  failClosedJson,
  maskIban,
  validateBankProfile,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Partner bank profile — validate country-aware; never return full IBAN. */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await callCspRpc(supabase, "csp_get_partner_bank_profile");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    const data = (result.data ?? {}) as { iban?: string; [key: string]: unknown };
    if (typeof data.iban === "string") {
      return NextResponse.json({ ...data, iban: maskIban(data.iban), iban_masked: true });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "bank_profile_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      country?: string;
      account_holder?: string;
      currency?: string;
      iban?: string;
      swift_bic?: string;
      local_account_number?: string;
      local_routing_code?: string;
    };

    const validated = validateBankProfile({
      country: body.country ?? "",
      accountHolder: body.account_holder ?? "",
      currency: (body.currency ?? "").toUpperCase(),
      iban: body.iban,
      swiftBic: body.swift_bic,
      localAccountNumber: body.local_account_number,
      localRoutingCode: body.local_routing_code,
    });
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_save_partner_bank_profile", {
      p_payload: {
        country: body.country,
        account_holder: body.account_holder,
        currency: (body.currency ?? "").toUpperCase(),
        iban: body.iban ?? null,
        swift_bic: body.swift_bic ?? null,
        local_account_number: body.local_account_number ?? null,
        local_routing_code: body.local_routing_code ?? null,
      },
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json({
      saved: true,
      iban_masked: body.iban ? maskIban(body.iban) : null,
    });
  } catch {
    return NextResponse.json({ error: "bank_profile_save_failed" }, { status: 500 });
  }
}
