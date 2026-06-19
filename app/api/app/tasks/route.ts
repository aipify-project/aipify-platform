import { NextResponse } from "next/server";
import { getTaskManagementCenter, parseTaskManagementCenter } from "@/lib/task-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getTaskManagementCenter(supabase);
    return NextResponse.json(parseTaskManagementCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load tasks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
