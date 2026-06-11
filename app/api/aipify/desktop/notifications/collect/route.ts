import { NextRequest, NextResponse } from "next/server";
import { collectDesktopEventsJob } from "@/lib/aipify/desktop/jobs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { tenant_slug?: string };
    const data = await collectDesktopEventsJob(body.tenant_slug);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to collect events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
