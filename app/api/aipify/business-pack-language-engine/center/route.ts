import { NextResponse } from "next/server";
import { getBusinessPackLanguageCenter } from "@/lib/core/business-pack-language-engine";
import { parseBusinessPackLanguageCenter } from "@/lib/aipify/business-pack-language-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packKey = new URL(request.url).searchParams.get("packKey");
    if (!packKey) return NextResponse.json({ error: "packKey required" }, { status: 400 });

    const data = await getBusinessPackLanguageCenter(supabase, packKey);
    const parsed = parseBusinessPackLanguageCenter(data);
    if (!parsed) return NextResponse.json({ found: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load language center" }, { status: 500 });
  }
}
