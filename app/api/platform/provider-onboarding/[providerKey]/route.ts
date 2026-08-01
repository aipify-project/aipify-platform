import { NextResponse } from "next/server";
import { parseCoreProviderOnboardingContract } from "@/lib/app-portal/integrations/onboarding";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

type RouteContext = { params: Promise<{ providerKey: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { providerKey } = await context.params;
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_provider_onboarding_contract", {
      p_provider_key: providerKey,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? {}, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to load provider contract" }, { status: 500, headers: NO_STORE });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { providerKey } = await context.params;
    const body = await request.json();
    const parsed = parseCoreProviderOnboardingContract(body?.onboarding_contract, {
      expectedProviderKey: providerKey,
    });
    if (!parsed.ok) {
      return NextResponse.json(
        { error: "invalid_contract", code: parsed.code, detail: parsed.detail },
        { status: 400, headers: NO_STORE }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("upsert_platform_provider_onboarding_contract", {
      p_provider_key: providerKey,
      p_contract: parsed.contract,
    });
    if (error) {
      const denied = /platform admin/i.test(error.message);
      return NextResponse.json(
        { error: error.message },
        { status: denied ? 403 : 400, headers: NO_STORE }
      );
    }
    return NextResponse.json(data ?? { ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to save provider contract" }, { status: 500, headers: NO_STORE });
  }
}
