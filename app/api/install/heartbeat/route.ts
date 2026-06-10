import { NextResponse } from "next/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import { isHeartbeatStatus } from "@/lib/install";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;
    const status = body.status as string | undefined;
    const details =
      body.details && typeof body.details === "object"
        ? body.details
        : {};

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    if (!status || !isHeartbeatStatus(status)) {
      return NextResponse.json(
        { error: "Invalid heartbeat status" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("record_installation_heartbeat", {
      p_token: installationToken,
      p_status: status,
      p_details: details,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Heartbeat failed" },
      { status: 500 }
    );
  }
}
