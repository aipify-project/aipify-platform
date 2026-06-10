import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { InvoiceAction } from "@/lib/platform/types";

const ACTIONS: InvoiceAction[] = [
  "send",
  "resend",
  "mark_paid",
  "mark_overdue",
  "cancel",
];

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const action = body.action as InvoiceAction;

    if (!ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("platform_invoice_action", {
      p_invoice_id: id,
      p_action: action,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ invoice: data });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
