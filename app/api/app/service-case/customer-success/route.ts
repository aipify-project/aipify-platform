import { NextResponse } from "next/server";
import { getServiceCustomerSuccessCenter, parseServiceCustomerSuccessCenter } from "@/lib/service-case";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getServiceCustomerSuccessCenter(supabase);
    return NextResponse.json(parseServiceCustomerSuccessCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load customer success" },
      { status: 500 },
    );
  }
}
