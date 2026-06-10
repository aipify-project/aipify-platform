import { NextResponse } from "next/server";
import { extractBearerToken } from "@/lib/desktop/session-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("desktop_get_command_center", {
      p_token: token,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load command center" },
      { status: 500 }
    );
  }
}
