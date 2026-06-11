import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      alert_id?: string;
      commitment_id?: string;
      alert_type?: string;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "acknowledge") {
      if (!body.alert_id) {
        return NextResponse.json({ error: "alert_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("acknowledge_commitment_alert", {
        p_alert_id: body.alert_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.commitment_id || !body.alert_type) {
      return NextResponse.json({ error: "commitment_id and alert_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_commitment_alert", {
      p_commitment_id: body.commitment_id,
      p_alert_type: body.alert_type,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process alert action" }, { status: 500 });
  }
}
