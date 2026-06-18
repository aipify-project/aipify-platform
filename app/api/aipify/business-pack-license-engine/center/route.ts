import { NextResponse } from "next/server";
import { getBusinessPackLicenseCenter } from "@/lib/core/business-pack-license-engine";
import { parseBusinessPackLicenseCenter } from "@/lib/aipify/business-pack-license-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packKey = new URL(request.url).searchParams.get("packKey");
    if (!packKey) return NextResponse.json({ error: "packKey required" }, { status: 400 });

    const data = await getBusinessPackLicenseCenter(supabase, packKey);
    const parsed = parseBusinessPackLicenseCenter(data);
    if (!parsed) return NextResponse.json({ found: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load license center" }, { status: 500 });
  }
}
