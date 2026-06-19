import { NextRequest, NextResponse } from "next/server";
import {
  getVerifiedProviderRegistry,
  parseVerifiedProviderCenter,
} from "@/lib/platform-verified-providers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = request.nextUrl.searchParams.get("section") ?? "overview";
    const data = await getVerifiedProviderRegistry(supabase, section);
    return NextResponse.json(parseVerifiedProviderCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load Provider Registry" },
      { status: 500 }
    );
  }
}
