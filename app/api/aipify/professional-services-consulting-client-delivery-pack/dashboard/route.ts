import { NextResponse } from "next/server";
import { parseProfessionalServicesConsultingClientDeliveryCenter } from "@/lib/aipify/professional-services-consulting-client-delivery-pack";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_professional_services_consulting_client_delivery_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProfessionalServicesConsultingClientDeliveryCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load professional services center" }, { status: 500 });
  }
}
