import { NextResponse } from "next/server";
import { deriveSessionFingerprint } from "@/lib/auth/two-factor";
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

    const ipHash = await getClientIpHash();

    const { data, error } = await supabase.rpc("verify_two_factor_challenge", {
      p_challenge_id: challengeId,
      p_code: code,
      p_use_recovery: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const result = data as { ok?: boolean; error?: string; locked?: boolean };
    if (!result?.ok) {
      return NextResponse.json(
        {
          error: result.locked ? "challengeLocked" : result.error ?? "invalidCode",
        },
        { status: 400 }
      );
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
