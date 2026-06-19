import { NextRequest, NextResponse } from "next/server";
import { performOrganizationOperationsAction } from "@/lib/organization-operations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const actionType = String(body.action_type ?? body.action ?? "");
    const payload = (body.payload ?? body) as Record<string, unknown>;
    const data = await performOrganizationOperationsAction(supabase, actionType, payload);
    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Action failed" },
      { status: 400 }
    );
  }
}
