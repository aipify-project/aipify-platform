import { NextResponse } from "next/server";
import { performCustomerRelationshipAction } from "@/lib/customer-relationship";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const data = await performCustomerRelationshipAction(supabase, body.action_type ?? "", body.payload ?? {});
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Action failed" }, { status: 500 });
  }
}
