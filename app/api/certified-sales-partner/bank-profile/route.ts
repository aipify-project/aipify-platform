import { NextResponse } from "next/server";
import {
  callCspRpc,
  failClosedJson,
  maskIban,
  sanitizeBankProfileResponse,
  validateBankProfile,
} from "@/lib/certified-sales-partner";
import { encryptBankPayload } from "@/lib/certified-sales-partner/bank-crypto";
import { createClient } from "@/lib/supabase/server";

/**
 * Partner payout bank profile — fail-closed until Core RPCs exist.
 * Responses NEVER carry a plaintext full IBAN / account number (last 4 only).
 * POST encrypts server-side (AES-256-GCM, `AIPIFY_CSP_BANK_ENCRYPTION_KEY`); without a key it
 * returns 503 and nothing is sent to Core.
 */
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
    return NextResponse.json(sanitizeBankProfileResponse(result.data));
  } catch {
    return NextResponse.json({ error: "bank_profile_load_failed" }, { status: 500 });
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const input = {
      country: str(body.country),
      accountHolder: str(body.account_holder ?? body.accountHolder),
      currency: str(body.currency),
      iban: str(body.iban) || null,
      swiftBic: str(body.swift_bic ?? body.swiftBic) || null,
      localAccountNumber: str(body.local_account_number ?? body.localAccountNumber) || null,
      localRoutingCode: str(body.local_routing_code ?? body.localRoutingCode) || null,
    };

    const validated = validateBankProfile(input);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error, field: validated.field ?? null }, { status: 400 });
    }

    const country = input.country.trim().toUpperCase();
    const rawIban = input.iban ? input.iban.replace(/\s+/g, "").toUpperCase() : "";
    const rawLocal = input.localAccountNumber ? input.localAccountNumber.replace(/\s+/g, "") : "";
    // NO 11-digit kontonummer entered in the IBAN field → store as local account, not IBAN.
    const norwegianLocal =
      country === "NO" && (/^\d{11}$/.test(rawIban) || /^\d{11}$/.test(rawLocal))
        ? /^\d{11}$/.test(rawIban)
          ? rawIban
          : rawLocal
        : null;
    const normalized = {
      country,
      account_holder: input.accountHolder.trim(),
      currency: input.currency.trim().toUpperCase(),
      iban: norwegianLocal ? null : rawIban || null,
      swift_bic: input.swiftBic ? input.swiftBic.replace(/\s+/g, "").toUpperCase() : null,
      local_account_number: norwegianLocal || rawLocal || null,
      local_routing_code: input.localRoutingCode ? input.localRoutingCode.replace(/\s+/g, "") : null,
    };

    // FAIL-CLOSED: encrypt in this server route BEFORE any RPC. Plaintext bank data never reaches Core.
    const encrypted = encryptBankPayload(JSON.stringify(normalized));
    if (!encrypted.ok) {
      return NextResponse.json(
        { error: encrypted.error, backend_ready: false, stored: false },
        { status: 503 },
      );
    }
    const identifier = normalized.iban ?? normalized.local_account_number ?? "";
    const maskedHint = identifier ? `****${identifier.slice(-4)}` : "";

    const result = await callCspRpc(supabase, "csp_save_partner_bank_profile", {
      p_encrypted_payload: {
        ciphertext: encrypted.encrypted_payload,
        key_version: encrypted.key_version,
        masked_hint: maskedHint,
      },
      p_fingerprint: encrypted.fingerprint,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json({
      ...(sanitizeBankProfileResponse(
        result.data && typeof result.data === "object" && !Array.isArray(result.data)
          ? (result.data as Record<string, unknown>)
          : { data: result.data },
      ) as Record<string, unknown>),
      iban_masked: input.iban ? maskIban(input.iban) : null,
    });
  } catch {
    return NextResponse.json({ error: "bank_profile_save_failed" }, { status: 500 });
  }
}
