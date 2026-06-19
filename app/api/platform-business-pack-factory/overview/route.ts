import { NextRequest, NextResponse } from "next/server";
import {
  getPlatformBusinessPackFactoryCenter,
  parsePlatformBusinessPackFactoryCenter,
} from "@/lib/platform-business-pack-factory";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = request.nextUrl.searchParams.get("section") ?? "overview";
    const data = await getPlatformBusinessPackFactoryCenter(supabase, section);
    const parsed = parsePlatformBusinessPackFactoryCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load business pack factory" },
      { status: 500 }
    );
  }
}
