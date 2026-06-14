import { NextResponse } from "next/server";
import {
  encryptPaymentCredential,
  parseProviderCard,
  PROVIDER_FIELD_DEFINITIONS,
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

    const body = (await request.json()) as {
      scope?: "platform" | "tenant";
      mode?: string;
      enabled?: boolean;
      status?: string;
      credentials?: Record<string, string>;
    };

    const scope = body.scope === "platform" ? "platform" : "tenant";
    const fieldDefs = PROVIDER_FIELD_DEFINITIONS[provider as PaymentProviderKey];

    const credentialPayload = fieldDefs
      .map((field) => {
        const value = body.credentials?.[field.key]?.trim();
        if (!value) return null;
        return {
          key: field.key,
          category: field.category,
          value,
          encrypted_payload: encryptPaymentCredential(value),
        };
      })
      .filter(Boolean);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("upsert_payment_provider_config", {
      p_payload: {
        scope,
        provider_key: provider,
        mode: body.mode,
        enabled: body.enabled,
        status: body.status,
        credentials: credentialPayload,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseProviderCard(data);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to save provider configuration" }, { status: 500 });
  }
}
