import { NextResponse } from "next/server";
import {
  decryptTotpSecret,
  verifyTotpCode,
} from "@/lib/auth/two-factor";
import { logTwoFactorAuditEvent } from "@/lib/auth/two-factor/audit";
import { requireAuthenticatedUser } from "@/lib/auth/two-factor/api";
import { verifyUserPassword } from "@/lib/auth/two-factor/verify-password";
import { createClient } from "@/lib/supabase/server";

type Body = { code?: string; password?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const code = body.code?.trim();
    const password = body.password ?? "";
    if (!code) {
      return NextResponse.json({ error: "codeRequired" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "passwordRequired" }, { status: 400 });
    }

    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passwordOk = await verifyUserPassword(
      supabase,
      user.email ?? "",
      password
    );
    if (!passwordOk) {
      await logTwoFactorAuditEvent(
        supabase,
        "verification_failed",
        "Sign-in verification disable blocked — invalid password",
        { step: "password_confirmation" }
      );
      return NextResponse.json({ error: "invalidPassword" }, { status: 400 });
    }

    const { data: encrypted, error: secretError } = await supabase.rpc(
      "_tfa_get_active_secret_encrypted"
    );
    if (secretError || !encrypted) {
      return NextResponse.json({ error: "notEnabled" }, { status: 400 });
    }

    let secret: string;
    try {
      secret = decryptTotpSecret(String(encrypted));
    } catch {
      return NextResponse.json({ error: "configError" }, { status: 503 });
    }

    if (!(await verifyTotpCode(secret, code))) {
      await logTwoFactorAuditEvent(
        supabase,
        "verification_failed",
        "Sign-in verification disable blocked — invalid authenticator code"
      );
      return NextResponse.json({ error: "invalidCode" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("disable_two_factor");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const result = data as { ok?: boolean; error?: string };
    if (!result?.ok) {
      return NextResponse.json({ error: result.error ?? "generic" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to disable two-factor" }, { status: 500 });
  }
}
