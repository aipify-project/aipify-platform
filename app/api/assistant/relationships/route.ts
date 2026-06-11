import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_relationship_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Relationship center request failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;

    const { data, error } = await supabase.rpc("update_relationship_settings", {
      p_rsi_enabled: body.rsi_enabled ?? null,
      p_ask_before_remembering: body.ask_before_remembering ?? null,
      p_gift_suggestions_enabled: body.gift_suggestions_enabled ?? null,
      p_follow_up_enabled: body.follow_up_enabled ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Settings update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      person_id?: string | null;
      name?: string;
      relationship?: string;
      person_type?: string;
      birthday?: string | null;
      anniversary?: string | null;
      notes?: string;
      preferred_gifts?: string[];
      favorite_activities?: string[];
      communication_preferences?: string;
      status?: string;
      topic?: string;
      tags?: string[];
      approved?: boolean;
    };

    if (body.action === "upsert_person") {
      const { data, error } = await supabase.rpc("upsert_relationship_person", {
        p_person_id: body.person_id ?? null,
        p_name: body.name ?? null,
        p_relationship: body.relationship ?? null,
        p_person_type: body.person_type ?? "friend",
        p_birthday: body.birthday ?? null,
        p_anniversary: body.anniversary ?? null,
        p_notes: body.notes ?? null,
        p_preferred_gifts: body.preferred_gifts ?? [],
        p_favorite_activities: body.favorite_activities ?? [],
        p_communication_preferences: body.communication_preferences ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data });
    }

    if (body.action === "update_status" && body.person_id && body.status) {
      const { data, error } = await supabase.rpc("update_relationship_person_status", {
        p_person_id: body.person_id,
        p_status: body.status,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_note" && body.person_id && body.topic) {
      const { data, error } = await supabase.rpc("record_relationship_note", {
        p_person_id: body.person_id,
        p_topic: body.topic,
        p_tags: body.tags ?? [],
        p_approved: Boolean(body.approved),
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Relationship action failed" }, { status: 500 });
  }
}
