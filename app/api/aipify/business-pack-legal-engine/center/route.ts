import { NextResponse } from "next/server";
import { getBusinessPackLegalCenter } from "@/lib/core/business-pack-legal-engine";
import { parseBusinessPackLegalCenter } from "@/lib/aipify/business-pack-legal-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packKey = new URL(request.url).searchParams.get("packKey");
    if (!packKey) return NextResponse.json({ error: "packKey required" }, { status: 400 });

    const data = await getBusinessPackLegalCenter(supabase, packKey);
    const parsed = parseBusinessPackLegalCenter(data);
    if (!parsed) return NextResponse.json({ found: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load legal center" }, { status: 500 });
  }
}
