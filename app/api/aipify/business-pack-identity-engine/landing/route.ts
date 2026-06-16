import { NextResponse } from "next/server";
import { getBusinessPackIdentityLanding } from "@/lib/core/business-pack-identity-engine";
import { parseBusinessPackIdentityLanding } from "@/lib/aipify/business-pack-identity-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packKey = new URL(request.url).searchParams.get("packKey");
    if (!packKey) return NextResponse.json({ error: "packKey required" }, { status: 400 });

    const data = await getBusinessPackIdentityLanding(supabase, packKey);
    const parsed = parseBusinessPackIdentityLanding(data);
    if (!parsed) return NextResponse.json({ found: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load pack identity" }, { status: 500 });
  }
}
