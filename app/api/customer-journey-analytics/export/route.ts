import { NextRequest, NextResponse } from "next/server";
import {
  buildCustomerJourneyAnalyticsCsv,
  buildCustomerJourneyAnalyticsPdfText,
  parseCustomerJourneyAnalytics,
} from "@/lib/customer-journey-analytics";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    country: searchParams.get("country") ?? undefined,
    industry: searchParams.get("industry") ?? undefined,
    company_size: searchParams.get("company_size") ?? undefined,
    plan: searchParams.get("plan") ?? undefined,
    customer_segment: searchParams.get("customer_segment") ?? undefined,
    customer_id: searchParams.get("customer_id") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const format = request.nextUrl.searchParams.get("format") ?? "csv";
    if (!["csv", "xlsx", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const filters = buildFilters(request.nextUrl.searchParams);
    const { data, error } = await supabase.rpc("get_customer_journey_analytics", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseCustomerJourneyAnalytics(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    await supabase.rpc("record_customer_journey_action", {
      p_payload: { action: "analytics_export", summary: `Analytics export (${format})`, filters },
    });

    const csv = buildCustomerJourneyAnalyticsCsv(parsed);

    if (format === "pdf") {
      const text = buildCustomerJourneyAnalyticsPdfText(parsed);
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": 'attachment; filename="customer-journey-analytics.pdf"',
        },
      });
    }

    if (format === "xlsx") {
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="customer-journey-analytics.xlsx"',
        },
      });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="customer-journey-analytics.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
