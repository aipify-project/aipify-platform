import { NextResponse } from "next/server";
import { parseCustomerExperienceAdoptionDelightCenter } from "@/lib/aipify/customer-experience-adoption-delight-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_customer_experience_adoption_delight_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCustomerExperienceAdoptionDelightCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load customer experience center" }, { status: 500 });
  }
}
