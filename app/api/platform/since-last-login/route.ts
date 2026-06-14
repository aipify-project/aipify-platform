import { NextResponse } from "next/server";
import { parseSinceLastLoginEngineBundle } from "@/lib/since-last-login";
import { createClient } from "@/lib/supabase/server";

const SCOPES = new Set(["platform_executive", "platform_admin", "support"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") ?? "platform_executive";
    const touch = searchParams.get("touch") !== "0";

    if (!SCOPES.has(scope)) {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_since_last_login_engine", {
      p_scope: scope,
      p_touch_login: touch,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    const parsed = parseSinceLastLoginEngineBundle(data);
    if (!parsed) {
      return NextResponse.json({ error: "Unable to generate summary" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load since-last-login summary" }, { status: 500 });
  }
}
