import { NextResponse } from "next/server";
import {
  decryptTotpSecret,
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyTotpCode,
} from "@/lib/auth/two-factor";
import { requireAuthenticatedUser } from "@/lib/auth/two-factor/api";
import { createClient } from "@/lib/supabase/server";

type Body = { code?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const code = body.code?.trim();
    if (!code) {
      return NextResponse.json({ error: "codeRequired" }, { status: 400 });
    }

    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "invalidCode" }, { status: 400 });
    }

    const recoveryCodes = generateRecoveryCodes();
    const hashes = recoveryCodes.map(hashRecoveryCode);

    const { data, error } = await supabase.rpc("regenerate_two_factor_recovery_codes", {
      p_recovery_code_hashes: hashes,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const result = data as { ok?: boolean; error?: string };
    if (!result?.ok) {
      return NextResponse.json({ error: result.error ?? "generic" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, recoveryCodes });
  } catch {
    return NextResponse.json({ error: "Failed to regenerate recovery codes" }, { status: 500 });
  }
}
