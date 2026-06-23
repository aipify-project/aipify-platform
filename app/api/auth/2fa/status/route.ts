import { NextResponse } from "next/server";
import { getTwoFactorStatusForSession } from "@/lib/auth/two-factor/api";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await getTwoFactorStatusForSession(supabase);
    if (!status) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ error: "Failed to load status" }, { status: 500 });
  }
}
