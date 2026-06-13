import { NextResponse } from "next/server";
import {
  parsePackageUpgradeResult,
  parsePackageUpgradeStart,
} from "@/lib/package-access";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "start" | "complete";
      target_package?: string;
      upgrade_event_id?: string;
      payment_reference?: string;
    };

    if (body.action === "complete") {
      const { data, error } = await supabase.rpc("complete_package_upgrade_instant", {
        p_payload: {
          target_package: body.target_package,
          upgrade_event_id: body.upgrade_event_id,
          payment_reference: body.payment_reference ?? `mock_${Date.now()}`,
          instant_activation: true,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parsePackageUpgradeResult(data));
    }

    if (!body.target_package) {
      return NextResponse.json({ error: "target_package required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("start_package_upgrade", {
      p_target_package: body.target_package,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePackageUpgradeStart(data));
  } catch {
    return NextResponse.json({ error: "Failed to process upgrade" }, { status: 500 });
  }
}
