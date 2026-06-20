import { NextResponse } from "next/server";
import {
  getPlatformBusinessPackActivationOverview,
  performBusinessPackActivationGateAction,
} from "@/lib/business-pack-activation-gate";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const overview = await getPlatformBusinessPackActivationOverview(supabase);
    return NextResponse.json(overview ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load activation overview";
    const status = message.toLowerCase().includes("platform admin") ? 403 : 500;
    return NextResponse.json({ error: message, found: false }, { status });
  }
}

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

    const data = await performBusinessPackActivationGateAction(
      supabase,
      body.action_type,
      body.payload ?? {}
    );
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Activation action failed";
    const status = message.toLowerCase().includes("platform admin") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
