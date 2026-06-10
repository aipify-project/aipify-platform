import { NextResponse } from "next/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;
    const currentVersion = body.current_version as string | undefined;
    const updateResult = body.update_result as string | undefined;
    const details =
      body.details && typeof body.details === "object" ? body.details : {};

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    if (!currentVersion || typeof currentVersion !== "string") {
      return NextResponse.json(
        { error: "current_version is required" },
        { status: 400 }
      );
    }

    if (
      updateResult &&
      updateResult !== "success" &&
      updateResult !== "failure"
    ) {
      return NextResponse.json(
        { error: "update_result must be success or failure" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc(
      "record_installation_version_report",
      {
        p_token: installationToken,
        p_current_version: currentVersion,
        p_update_result: updateResult ?? null,
        p_details: details,
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Version report failed" },
      { status: 500 }
    );
  }
}
