import { NextResponse } from "next/server";
import { getClientIpHash } from "@/lib/auth/two-factor/request";
import { requireAuthenticatedUser } from "@/lib/auth/two-factor/api";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ipHash = await getClientIpHash();
    const { data: challengeId, error } = await supabase.rpc("create_two_factor_challenge", {
      p_ip_hash: ipHash,
    });

    if (error || !challengeId) {
      return NextResponse.json({ error: error?.message ?? "generic" }, { status: 400 });
    }

    return NextResponse.json({ challengeId });
  } catch {
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }
}
