import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidEscalationPayload } from "@/lib/install/escalation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (!isValidEscalationPayload(body)) {
      return NextResponse.json(
        { error: "Invalid escalation payload" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const installationId =
      typeof body.installation_id === "string" ? body.installation_id : undefined;

    const { data, error } = await supabase.rpc("record_install_support_escalation", {
      p_platform_type: body.platform_type,
      p_error_summary: body.error_summary,
      p_domain: body.domain ?? null,
      p_installation_status: body.installation_status ?? null,
      p_installation_id: installationId ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to record escalation" },
      { status: 500 }
    );
  }
}
