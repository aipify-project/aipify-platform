import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateAocHealthJob, runAocWatchersJob } from "@/lib/aipify/aoc/jobs";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [watchers, health] = await Promise.all([runAocWatchersJob(), calculateAocHealthJob()]);
    return NextResponse.json({ watchers, health });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Job failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
