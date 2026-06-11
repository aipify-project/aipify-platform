import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePartnerCredentialVerification } from "@/lib/aipify/partner-certification";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { credential_code?: string };
    if (!body.credential_code) {
      return NextResponse.json({ error: "credential_code is required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("verify_partner_credential", {
      p_credential_code: body.credential_code,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePartnerCredentialVerification(data));
  } catch {
    return NextResponse.json({ error: "Failed to verify credential" }, { status: 500 });
  }
}
