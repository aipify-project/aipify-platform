import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const urlParam = new URL(request.url).searchParams.get("url");
    const { data, error } = await supabase.rpc("get_growth_partner_marketing_attribution_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const targetUrl = urlParam ?? (typeof data?.partner_url === "string" ? data.partner_url : null);
    if (!targetUrl) return NextResponse.json({ error: "Partner URL not available" }, { status: 400 });

    const png = await QRCode.toBuffer(targetUrl, { type: "png", margin: 2, width: 512 });
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
