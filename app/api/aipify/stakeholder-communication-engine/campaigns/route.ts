import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      campaign_name?: string;
      stakeholder_type?: string;
      communication_type?: string;
      delivery_channels?: unknown[];
      owner_user_id?: string;
      scheduled_at?: string;
      campaign_id?: string;
      status?: string;
      channel?: string;
      delivery_status?: string;
      delivery_metadata?: Record<string, unknown>;
      outcome_summary?: string;
      engagement_metadata?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    if (body.action === "update_status") {
      if (!body.campaign_id || !body.status) {
        return NextResponse.json({ error: "campaign_id and status required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_campaign_status", {
        p_campaign_id: body.campaign_id,
        p_status: body.status,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "schedule") {
      if (!body.campaign_id || !body.scheduled_at) {
        return NextResponse.json({ error: "campaign_id and scheduled_at required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("schedule_campaign", {
        p_campaign_id: body.campaign_id,
        p_scheduled_at: body.scheduled_at,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "cancel") {
      if (!body.campaign_id) {
        return NextResponse.json({ error: "campaign_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("cancel_campaign", {
        p_campaign_id: body.campaign_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_delivery") {
      if (!body.campaign_id || !body.channel) {
        return NextResponse.json({ error: "campaign_id and channel required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_campaign_delivery", {
        p_campaign_id: body.campaign_id,
        p_channel: body.channel,
        p_status: body.delivery_status ?? "delivered",
        p_metadata: body.delivery_metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_outcome") {
      if (!body.campaign_id || !body.outcome_summary) {
        return NextResponse.json({ error: "campaign_id and outcome_summary required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_communication_outcome", {
        p_campaign_id: body.campaign_id,
        p_outcome_summary: body.outcome_summary,
        p_engagement_metadata: body.engagement_metadata ?? {},
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.campaign_name || !body.stakeholder_type || !body.communication_type) {
      return NextResponse.json(
        { error: "campaign_name, stakeholder_type, and communication_type required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("create_communication_campaign", {
      p_campaign_name: body.campaign_name,
      p_stakeholder_type: body.stakeholder_type,
      p_communication_type: body.communication_type,
      p_delivery_channels: body.delivery_channels ?? ["in_platform"],
      p_owner_user_id: body.owner_user_id ?? null,
      p_scheduled_at: body.scheduled_at ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process campaign action" }, { status: 500 });
  }
}
