import { NextResponse } from "next/server";
import {
  buildOtpAuthUrl,
  decryptTotpSecret,
  encryptTotpSecret,
  generateTotpSecret,
  normalizeTotpSecret,
} from "@/lib/auth/two-factor";
import { requireAuthenticatedUser } from "@/lib/auth/two-factor/api";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let regenerate = false;
    try {
      const body = (await request.json()) as { regenerate?: boolean };
      regenerate = body.regenerate === true;
    } catch {
      regenerate = false;
    }

    let secret: string;
    let resumed = false;
    try {
      const { data: existingEncrypted } = await supabase.rpc(
        "_tfa_get_pending_secret_encrypted"
      );

      if (existingEncrypted && !regenerate) {
        secret = normalizeTotpSecret(decryptTotpSecret(String(existingEncrypted)));
        resumed = true;
      } else {
        secret = generateTotpSecret();
        const encryptedSecret = encryptTotpSecret(secret);
        const { error: storeError } = await supabase.rpc("_tfa_store_pending_enrollment", {
          p_encrypted_secret: encryptedSecret,
        });
        if (storeError) {
          return NextResponse.json({ error: storeError.message }, { status: 400 });
        }
      }
    } catch {
      return NextResponse.json({ error: "configError" }, { status: 503 });
    }

    const otpauthUrl = buildOtpAuthUrl(user.email ?? "user@aipify.ai", secret);

    return NextResponse.json({
      secret,
      otpauthUrl,
      resumed,
    });
  } catch {
    return NextResponse.json({ error: "Failed to begin enrollment" }, { status: 500 });
  }
}
