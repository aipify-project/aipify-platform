import { NextResponse } from "next/server";
import {
  getDynamicAppNavigation,
  parseDynamicAppNavigation,
} from "@/lib/dynamic-navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getDynamicAppNavigation(supabase);
    return NextResponse.json(parseDynamicAppNavigation(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load navigation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
