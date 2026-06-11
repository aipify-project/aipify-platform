import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      schedule_id?: string;
      template_id?: string;
      cadence?: string;
      delivery_method?: string;
      generation_id?: string;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "cancel") {
      if (!body.schedule_id) {
        return NextResponse.json({ error: "schedule_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("cancel_scheduled_output", {
        p_schedule_id: body.schedule_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_delivery") {
      if (!body.generation_id) {
        return NextResponse.json({ error: "generation_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_output_delivery", {
        p_generation_id: body.generation_id,
        p_delivery_method: body.delivery_method ?? "download",
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.template_id) {
      return NextResponse.json({ error: "template_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("schedule_output_delivery", {
      p_template_id: body.template_id,
      p_cadence: body.cadence ?? "monthly",
      p_delivery_method: body.delivery_method ?? "download",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process schedule action" }, { status: 500 });
  }
}
