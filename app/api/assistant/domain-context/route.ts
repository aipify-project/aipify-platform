import { NextResponse } from "next/server";
import {
  companionDomainContextFromCenter,
  DomainCenterAccessError,
  readOrganizationDomainCenter,
} from "@/lib/domain-license/read-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = companionDomainContextFromCenter(await readOrganizationDomainCenter(supabase));
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof DomainCenterAccessError) {
      return NextResponse.json({ found: false }, { status: 403 });
    }
    const message = err instanceof Error ? err.message : "Failed to load domain context";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
