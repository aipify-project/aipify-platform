import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      cycle_id?: string;
      attested?: boolean;
      notes?: string;
    };

    if (!body.cycle_id) {
      return NextResponse.json({ error: "cycle_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_compliance_attestation", {
      p_cycle_id: body.cycle_id,
      p_attested: Boolean(body.attested),
      p_notes: body.notes ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record attestation" }, { status: 500 });
  }
}
