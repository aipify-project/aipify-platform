import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateTwinHealthJob, detectBottlenecksJob } from "@/lib/aipify/digital-twin/jobs";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [health, bottlenecks] = await Promise.all([
      calculateTwinHealthJob(),
      detectBottlenecksJob(),
    ]);
    return NextResponse.json({ health, bottlenecks });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Job failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
