import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      policy_id?: string;
      policy_name?: string;
      record_category?: string;
      retention_period_value?: number;
      retention_period_unit?: string;
      archive_required?: boolean;
      disposal_method?: string;
      status?: string;
    };

    if (body.action === "retire") {
      if (!body.policy_id) {
        return NextResponse.json({ error: "policy_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("retire_retention_policy", {
        p_policy_id: body.policy_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update") {
      if (!body.policy_id) {
        return NextResponse.json({ error: "policy_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_retention_policy", {
        p_policy_id: body.policy_id,
        p_policy_name: body.policy_name ?? null,
        p_retention_period_value: body.retention_period_value ?? null,
        p_retention_period_unit: body.retention_period_unit ?? null,
        p_archive_required: body.archive_required ?? null,
        p_disposal_method: body.disposal_method ?? null,
        p_status: body.status ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("create_retention_policy", {
      p_policy_name: body.policy_name ?? "New retention policy",
      p_record_category: body.record_category ?? "audit_log",
      p_retention_period_value: body.retention_period_value ?? 365,
      p_retention_period_unit: body.retention_period_unit ?? "days",
      p_archive_required: body.archive_required ?? true,
      p_disposal_method: body.disposal_method ?? "secure_delete",
      p_status: body.status ?? "draft",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process policy action" }, { status: 500 });
  }
}
