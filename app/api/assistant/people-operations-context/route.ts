import { NextResponse } from "next/server";
import { getCompanionPeopleOperationsContext } from "@/lib/people-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getCompanionPeopleOperationsContext(supabase);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load people context" },
      { status: 500 },
    );
  }
}
