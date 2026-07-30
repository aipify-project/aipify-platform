import { NextResponse } from "next/server";
import { runKompisAiProviderHealthCheck } from "@/lib/kompis-operator/ai-runtime";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(request.url).host;
    const originHost = new URL(origin).host;
    return originHost === host || originHost.endsWith(".aipify.ai") || originHost === "localhost:3000";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!originAllowed(request)) {
      return NextResponse.json({ error: "Invalid origin.", code: "origin_denied" }, { status: 403, headers });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const profile = await getPlatformProfile(supabase);
    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden", code: "forbidden" }, { status: 403, headers });
    }

    const rate = await assertKompisOperatorRateLimit({
      supabase,
      userId: user.id,
      organizationId: "platform",
      kind: "health",
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded.", code: "rate_limited", resetInSeconds: rate.resetInSeconds ?? 60 },
        { status: 429, headers },
      );
    }

    const result = await runKompisAiProviderHealthCheck(supabase);
    return NextResponse.json(
      {
        ok: result.ok,
        status: result.status,
        latencyMs: result.latencyMs,
        checkedAt: result.checkedAt,
        modelProfile: result.modelProfile,
        providerFamily: result.providerFamily,
        safeErrorCode: result.safeErrorCode ?? null,
        fallbackAvailable: true,
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to check provider.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
