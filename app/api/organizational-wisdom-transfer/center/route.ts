import { NextResponse } from "next/server";
import { parseOrganizationalWisdomTransferCenter } from "@/lib/organizational-wisdom-transfer-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_organizational_wisdom_transfer_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalWisdomTransferCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Wisdom Transfer Center" }, { status: 500 });
  }
}
