import { NextRequest, NextResponse } from "next/server";
import {
  buildPaymentAnalyticsCsv,
  buildPaymentAnalyticsPdfText,
  parsePaymentAnalyticsCenter,
} from "@/lib/payment-analytics";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    date_from: searchParams.get("date_from") ?? undefined,
    date_to: searchParams.get("date_to") ?? undefined,
    provider: searchParams.get("provider") ?? undefined,
    customer_type: searchParams.get("customer_type") ?? undefined,
    country: searchParams.get("country") ?? undefined,
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
    const { data, error } = await supabase.rpc("get_payment_analytics_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePaymentAnalyticsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    const csv = buildPaymentAnalyticsCsv(parsed);

    if (format === "pdf") {
      const text = buildPaymentAnalyticsPdfText(parsed);
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": 'attachment; filename="payment-analytics.pdf"',
        },
      });
    }

    if (format === "xlsx") {
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="payment-analytics.xlsx"',
        },
      });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="payment-analytics.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
