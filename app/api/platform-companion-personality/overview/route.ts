import { NextRequest, NextResponse } from "next/server";
import {
  getPlatformCompanionPersonalityCenter,
  parsePlatformCompanionPersonalityCenter,
} from "@/lib/platform-companion-personality";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = request.nextUrl.searchParams.get("section") ?? "overview";
    const data = await getPlatformCompanionPersonalityCenter(supabase, section);
    const parsed = parsePlatformCompanionPersonalityCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load Companion Personality" },
      { status: 500 }
    );
  }
}
