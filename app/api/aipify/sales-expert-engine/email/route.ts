import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      customer_id?: string;
      template_key?: string;
      subject_metadata?: string;
      scheduled_for?: string;
    };

    const { data, error } = await supabase.rpc("send_sales_expert_email", {
      p_customer_id: body.customer_id,
      p_template_key: body.template_key,
      p_subject_metadata: body.subject_metadata ?? null,
      p_scheduled_for: body.scheduled_for ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
