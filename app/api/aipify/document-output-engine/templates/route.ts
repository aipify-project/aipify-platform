import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      template_id?: string;
      template_name?: string;
      template_type?: string;
      output_format?: string;
      template_config?: Record<string, unknown>;
      status?: string;
    };

    if (body.action === "archive") {
      if (!body.template_id) {
        return NextResponse.json({ error: "template_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("archive_output_template", {
        p_template_id: body.template_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update") {
      if (!body.template_id) {
        return NextResponse.json({ error: "template_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_output_template", {
        p_template_id: body.template_id,
        p_template_name: body.template_name ?? null,
        p_output_format: body.output_format ?? null,
        p_template_config: body.template_config ?? null,
        p_status: body.status ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.template_name || !body.template_type) {
      return NextResponse.json({ error: "template_name and template_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_output_template", {
      p_template_name: body.template_name,
      p_template_type: body.template_type,
      p_output_format: body.output_format ?? "pdf",
      p_template_config: body.template_config ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process template action" }, { status: 500 });
  }
}
