import { NextResponse } from "next/server";
import { websiteKompisSiteProvisionDecision } from "@/lib/website-kompis-connection/provision-gate";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decision = websiteKompisSiteProvisionDecision();
  return NextResponse.json(
    { ok: decision.ok, code: decision.code },
    { status: decision.httpStatus },
  );
}
