import { NextResponse } from "next/server";
import { addAipifyHostsPropertyLicense } from "@/lib/core/aipify-hosts";
import { parseAddAipifyHostsPropertyLicenseResult } from "@/lib/aipify/aipify-hosts";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { count?: number };
    const data = await addAipifyHostsPropertyLicense(supabase, body.count ?? 1);
    const parsed = parseAddAipifyHostsPropertyLicenseResult(data);
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add property license";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
