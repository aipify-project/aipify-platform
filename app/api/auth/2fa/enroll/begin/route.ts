import { NextResponse } from "next/server";
import {
  buildOtpAuthUrl,
  encryptTotpSecret,
  generateTotpSecret,
} from "@/lib/auth/two-factor";
import { requireAuthenticatedUser } from "@/lib/auth/two-factor/api";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let secret: string;
    let encryptedSecret: string;
    try {
      secret = generateTotpSecret();
      encryptedSecret = encryptTotpSecret(secret);
    } catch {
      return NextResponse.json({ error: "configError" }, { status: 503 });
    }

    const { error: storeError } = await supabase.rpc("_tfa_store_pending_enrollment", {
      p_encrypted_secret: encryptedSecret,
    });
    if (storeError) {
      return NextResponse.json({ error: storeError.message }, { status: 400 });
    }

    const otpauthUrl = buildOtpAuthUrl(user.email ?? "user@aipify.ai", secret);

    return NextResponse.json({
      secret,
      otpauthUrl,
    });
  } catch {
    return NextResponse.json({ error: "Failed to begin enrollment" }, { status: 500 });
  }
}
