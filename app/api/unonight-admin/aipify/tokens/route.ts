import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientIpFromRequest } from "@/lib/unonight-platform";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("list_unonight_aipify_connection_tokens");
    if (error) {
      return NextResponse.json({ error: "Unable to load tokens" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to load tokens" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { token_name?: string };
    const tokenName = typeof body.token_name === "string" ? body.token_name.trim() : "";
    if (!tokenName) {
      return NextResponse.json({ error: "Token name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_unonight_aipify_connection_token", {
      p_token_name: tokenName,
      p_request_ip: clientIpFromRequest(request),
    });

    if (error) {
      return NextResponse.json({ error: "Unable to create token" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to create token" }, { status: 500 });
  }
}
