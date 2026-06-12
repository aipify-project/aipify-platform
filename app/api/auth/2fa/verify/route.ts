import { NextResponse } from "next/server";
import {
  decryptTotpSecret,
  deriveSessionFingerprint,
  verifyTotpCode,
} from "@/lib/auth/two-factor";
import { getClientIpHash } from "@/lib/auth/two-factor/request";
import { requireAuthenticatedUser } from "@/lib/auth/two-factor/api";
import { createClient } from "@/lib/supabase/server";

type Body = {
  challengeId?: string;
  code?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const challengeId = body.challengeId?.trim();
    const code = body.code?.trim();

    if (!challengeId || !code) {
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

    const ipHash = await getClientIpHash();

    if (!(await verifyTotpCode(secret, code))) {
      const { data: failData } = await supabase.rpc("_tfa_record_failed_attempt", {
        p_challenge_id: challengeId,
        p_ip_hash: ipHash,
      });
      const fail = failData as { locked?: boolean; attempts?: number } | null;
      return NextResponse.json(
        {
          error: fail?.locked ? "challengeLocked" : "invalidCode",
          attempts: fail?.attempts,
        },
        { status: 400 }
      );
    }

    const { data: completed, error: completeError } = await supabase.rpc(
      "_tfa_complete_challenge",
      {
        p_challenge_id: challengeId,
        p_method: "totp",
        p_ip_hash: ipHash,
      }
    );

    if (completeError || !completed) {
      return NextResponse.json({ error: "challengeLocked" }, { status: 400 });
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const fingerprint = deriveSessionFingerprint(session.access_token);
      await supabase.rpc("mark_session_two_factor_verified", {
        p_session_fingerprint: fingerprint,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
