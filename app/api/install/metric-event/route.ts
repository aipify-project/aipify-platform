import { NextResponse } from "next/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import {
  containsForbiddenMetricField,
  isMetricEventCategory,
  isMetricEventType,
  isMetricRiskLevel,
} from "@/lib/impact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;
    const eventType = body.event_type as string | undefined;
    const eventCategory = body.event_category as string | undefined;
    const sourceModule = body.source_module as string | undefined;
    const eventCount =
      typeof body.event_count === "number" ? body.event_count : 1;
    const riskLevel =
      typeof body.risk_level === "string" ? body.risk_level : "low";

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    if (!eventType || !isMetricEventType(eventType)) {
      return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
    }

    if (!eventCategory || !isMetricEventCategory(eventCategory)) {
      return NextResponse.json(
        { error: "Invalid event_category" },
        { status: 400 }
      );
    }

    if (!sourceModule || typeof sourceModule !== "string") {
      return NextResponse.json(
        { error: "source_module is required" },
        { status: 400 }
      );
    }

    if (!isMetricRiskLevel(riskLevel)) {
      return NextResponse.json({ error: "Invalid risk_level" }, { status: 400 });
    }

    if (eventCount < 1) {
      return NextResponse.json(
        { error: "event_count must be positive" },
        { status: 400 }
      );
    }

    if (body && typeof body === "object" && containsForbiddenMetricField(body)) {
      return NextResponse.json(
        { error: "Private content fields are not allowed in metric events" },
        { status: 400 }
      );
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("record_install_metric_event", {
      p_token: installationToken,
      p_event_type: eventType,
      p_event_category: eventCategory,
      p_source_module: sourceModule,
      p_event_count: eventCount,
      p_risk_level: riskLevel,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ metric_event_id: data });
  } catch {
    return NextResponse.json(
      { error: "Metric event recording failed" },
      { status: 500 }
    );
  }
}
