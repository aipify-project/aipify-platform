import { NextResponse } from "next/server";
import { parseRelationshipNoteAction } from "@/lib/aipify/companion-relationship-intelligence/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      profile_id?: string;
      title?: string;
      description?: string;
      interaction_type?: string;
    };

    const { data, error } = await supabase.rpc("create_companion_relationship_note", {
      p_profile_id:       body.profile_id ?? null,
      p_title:            body.title ?? "",
      p_description:      body.description ?? "",
      p_interaction_type: body.interaction_type ?? "note",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseRelationshipNoteAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
