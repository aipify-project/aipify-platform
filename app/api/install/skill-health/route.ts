import { NextResponse } from "next/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import { SKILL_HEALTH_STATUSES } from "@/lib/skillos";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;
    const skillKey = body.skill_key as string | undefined;
    const status = body.status as string | undefined;
    const healthScore =
      typeof body.health_score === "number" ? body.health_score : null;
    const successDelta =
      typeof body.success_delta === "number" ? body.success_delta : 0;
    const failureDelta =
      typeof body.failure_delta === "number" ? body.failure_delta : 0;
    const warningDelta =
      typeof body.warning_delta === "number" ? body.warning_delta : 0;

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    if (!skillKey || typeof skillKey !== "string") {
      return NextResponse.json({ error: "skill_key is required" }, { status: 400 });
    }

    if (!status || !(SKILL_HEALTH_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Invalid health status" }, { status: 400 });
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("record_install_skill_health", {
      p_token: installationToken,
      p_skill_key: skillKey,
      p_status: status,
      p_health_score: healthScore,
      p_success_delta: successDelta,
      p_failure_delta: failureDelta,
      p_warning_delta: warningDelta,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Skill health reporting failed" }, { status: 500 });
  }
}
