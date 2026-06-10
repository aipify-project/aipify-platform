import { NextResponse } from "next/server";
import { extractBearerToken } from "@/lib/desktop/session-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("revoke_desktop_session", {
      p_token: token,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}
