import { NextResponse } from "next/server";
import { guardPrivilegedPlatformScopeSession } from "@/lib/auth/platform-server-access";
import {
  decryptPaymentCredential,
  parseProviderCard,
  PROVIDER_FIELD_DEFINITIONS,
  testPaymentProviderConnection,
  type PaymentProviderKey,
} from "@/lib/payment-providers";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ provider: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { provider } = await context.params;
    if (!Object.keys(PROVIDER_FIELD_DEFINITIONS).includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const body = (await request.json()) as { scope?: "platform" | "tenant" };
    const scope = body.scope === "platform" ? "platform" : "tenant";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (scope === "platform") {
      const platformGuard = await guardPrivilegedPlatformScopeSession(supabase, scope);
      if (platformGuard) return platformGuard;
    }

    const { data: encryptedData, error: fetchError } = await supabase.rpc(
      "get_payment_provider_encrypted_credentials",
      { p_scope: scope, p_provider: provider }
    );
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });

    const encryptedRow = encryptedData as Record<string, unknown>;
    if (!encryptedRow?.found) {
      return NextResponse.json({
        success: false,
        message: "No credentials configured for this provider.",
      });
    }

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
      provider: provider as PaymentProviderKey,
      mode: String(encryptedRow.mode ?? "test"),
      credentials,
    });

    const { data, error } = await supabase.rpc("record_payment_provider_test_result", {
      p_payload: {
        scope,
        provider_key: provider,
        success: testResult.success,
        message: testResult.message,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      ...testResult,
      provider: parseProviderCard(data),
    });
  } catch {
    return NextResponse.json({ error: "Test connection failed" }, { status: 500 });
  }
}
