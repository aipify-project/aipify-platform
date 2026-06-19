import { NextResponse } from "next/server";
import { performMobileApiIntegrationAction } from "@/lib/mobile-api-integration";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const data = await performMobileApiIntegrationAction(
      supabase,
      body.action_type ?? "",
      body.payload ?? {},
    );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to perform mobile API action" },
      { status: 500 },
    );
  }
}
