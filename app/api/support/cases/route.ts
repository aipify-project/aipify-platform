import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      subject?: string;
      customer_identifier?: string;
      channel?: string;
      priority?: string;
    };
    if (!body.subject) return NextResponse.json({ error: "subject required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_organization_support_case", {
      p_subject: body.subject,
      p_customer_identifier: body.customer_identifier ?? null,
      p_channel: body.channel ?? "admin_inbox",
      p_priority: body.priority ?? "medium",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create support case" }, { status: 500 });
  }
}
