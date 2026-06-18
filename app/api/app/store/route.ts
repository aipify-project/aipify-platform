import { NextResponse } from "next/server";
import { getAppStoreHome, parseAppStoreHome } from "@/lib/app-store";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const locale = new URL(request.url).searchParams.get("locale") ?? "en";
    const data = await getAppStoreHome(supabase, locale);
    return NextResponse.json(parseAppStoreHome(data) ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load App Store" }, { status: 500 });
  }
}
