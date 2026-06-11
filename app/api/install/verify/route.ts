import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import { parsePlatformInstallActionResult } from "@/lib/aipify/platform-install";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationId = body.installation_id as string | undefined;
    const installationToken = body.installation_token as string | undefined;
    const activate = Boolean(body.activate);

    if (installationId) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const { data, error } = await supabase.rpc("verify_install_connection", {
        p_installation_id: installationId,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parsePlatformInstallActionResult(data));
    }

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json({ error: "Invalid installation token" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: verified, error: verifyError } = await supabase.rpc(
      "verify_installation_token",
      { p_token: installationToken }
    );

    if (verifyError || !verified?.length) {
      return NextResponse.json({ error: "Installation not found" }, { status: 404 });
    }

    if (activate) {
      await supabase.rpc("activate_installation", {
        p_token: installationToken,
      });
    }

    return NextResponse.json({ installation: verified[0] });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
