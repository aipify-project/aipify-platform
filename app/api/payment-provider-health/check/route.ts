import { NextResponse } from "next/server";
import {
  decryptPaymentCredential,
  parseProviderCard,
  PROVIDER_FIELD_DEFINITIONS,
  testPaymentProviderConnection,
  type PaymentProviderKey,
} from "@/lib/payment-providers";
import { parsePaymentProviderHealthCenter } from "@/lib/payment-provider-health";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { provider_key?: string };
    const providerKey = body.provider_key;

    if (!providerKey || !Object.keys(PROVIDER_FIELD_DEFINITIONS).includes(providerKey)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: encryptedData, error: fetchError } = await supabase.rpc(
      "get_payment_provider_encrypted_credentials",
      { p_scope: "platform", p_provider: providerKey }
    );
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });

    const encryptedRow = encryptedData as Record<string, unknown>;
    let success = false;
    let message = "No credentials configured for this provider.";

    if (encryptedRow?.found) {
      const encryptedCredentials =
        (encryptedRow.encrypted_credentials as Record<string, string>) ?? {};
      const credentials: Record<string, string> = {};
      for (const [key, ciphertext] of Object.entries(encryptedCredentials)) {
        try {
          credentials[key] = decryptPaymentCredential(ciphertext);
        } catch {
          credentials[key] = ciphertext;
        }
      }

      const testResult = await testPaymentProviderConnection({
        provider: providerKey as PaymentProviderKey,
        mode: String(encryptedRow.mode ?? "test"),
        credentials,
      });
      success = testResult.success;
      message = testResult.message;
    }

    const { data, error } = await supabase.rpc("record_payment_provider_health_check", {
      p_payload: {
        provider_key: providerKey,
        success,
        message,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const overview = await supabase.rpc("get_payment_provider_health_center");
    if (overview.error) {
      return NextResponse.json({
        success,
        message,
        provider: parseProviderCard(data),
      });
    }

    const parsed = parsePaymentProviderHealthCenter(overview.data);
    return NextResponse.json({
      success,
      message,
      center: parsed,
    });
  } catch {
    return NextResponse.json({ error: "Health check failed" }, { status: 500 });
  }
}
