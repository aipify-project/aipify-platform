import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;
    const activate = Boolean(body.activate);

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: verified, error: verifyError } = await supabase.rpc(
      "verify_installation_token",
      { p_token: installationToken }
    );

    if (verifyError || !verified?.length) {
      return NextResponse.json(
        { error: "Installation not found" },
        { status: 404 }
      );
    }

    if (activate) {
      await supabase.rpc("activate_installation", {
        p_token: installationToken,
      });
    }

    return NextResponse.json({ installation: verified[0] });
  } catch {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
