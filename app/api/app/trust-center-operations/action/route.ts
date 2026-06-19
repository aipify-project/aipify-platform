import { NextResponse } from "next/server";
import { performTrustCenterAction } from "@/lib/trust-center-operations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      payload?: Record<string, unknown>;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performTrustCenterAction(
      supabase,
      body.action_type,
      body.payload ?? {}
    );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Trust Center action failed" },
      { status: 500 }
    );
  }
}
