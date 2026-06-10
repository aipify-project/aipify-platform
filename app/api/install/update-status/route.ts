import { NextResponse } from "next/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import { isHeartbeatStatus } from "@/lib/install";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;
    const success = Boolean(body.success);
    const currentVersion = body.current_version as string | undefined;
    const details =
      body.details && typeof body.details === "object" ? body.details : {};

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (currentVersion) {
      const { error: versionError } = await supabase.rpc(
        "record_installation_version_report",
        {
          p_token: installationToken,
          p_current_version: currentVersion,
          p_update_result: success ? "success" : "failure",
          p_details: details,
        }
      );

      if (versionError) {
        return NextResponse.json({ error: versionError.message }, { status: 400 });
      }
    }

    const heartbeatStatus = success ? "healthy" : "warning";
    if (!isHeartbeatStatus(heartbeatStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_installation_heartbeat", {
      p_token: installationToken,
      p_status: success ? "healthy" : "warning",
      p_details: {
        ...details,
        update_report: success ? "completed" : "failed",
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      ...data,
      update_success: success,
    });
  } catch {
    return NextResponse.json(
      { error: "Update status report failed" },
      { status: 500 }
    );
  }
}
