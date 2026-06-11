import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      commitment_id?: string;
      commitment_name?: string;
      commitment_type?: string;
      target_value?: number;
      measurement_unit?: string;
      severity_scope?: string;
      period?: string;
      compliance_rate?: number;
      missed_count?: number;
      average_value?: number;
      trend_metadata?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    if (body.action === "pause") {
      if (!body.commitment_id) {
        return NextResponse.json({ error: "commitment_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("pause_service_commitment", {
        p_commitment_id: body.commitment_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "retire") {
      if (!body.commitment_id) {
        return NextResponse.json({ error: "commitment_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("retire_service_commitment", {
        p_commitment_id: body.commitment_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_performance") {
      if (!body.commitment_id || body.compliance_rate === undefined) {
        return NextResponse.json({ error: "commitment_id and compliance_rate required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_commitment_performance", {
        p_commitment_id: body.commitment_id,
        p_period: body.period ?? null,
        p_compliance_rate: body.compliance_rate,
        p_missed_count: body.missed_count ?? 0,
        p_average_value: body.average_value ?? null,
        p_trend_metadata: body.trend_metadata ?? {},
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update") {
      if (!body.commitment_id) {
        return NextResponse.json({ error: "commitment_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_service_commitment", {
        p_commitment_id: body.commitment_id,
        p_commitment_name: body.commitment_name ?? null,
        p_target_value: body.target_value ?? null,
        p_measurement_unit: body.measurement_unit ?? null,
        p_severity_scope: body.severity_scope ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.commitment_name || !body.commitment_type || !body.target_value || !body.measurement_unit) {
      return NextResponse.json(
        { error: "commitment_name, commitment_type, target_value, and measurement_unit required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("create_service_commitment", {
      p_commitment_name: body.commitment_name,
      p_commitment_type: body.commitment_type,
      p_target_value: body.target_value,
      p_measurement_unit: body.measurement_unit,
      p_severity_scope: body.severity_scope ?? "medium",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process commitment action" }, { status: 500 });
  }
}
