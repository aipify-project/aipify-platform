import { NextRequest, NextResponse } from "next/server";
import {
  buildPaymentAnalyticsCsv,
  buildPaymentAnalyticsPdfText,
  exportFilenameForFormat,
  exportTitleForFormat,
  parsePaymentAnalyticsCenter,
} from "@/lib/payment-analytics";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_FORMATS = new Set([
  "csv",
  "xlsx",
  "pdf",
  "board_report",
  "executive_summary",
  "finance_fiken",
  "auditor_package",
  "quarterly_revenue",
]);

function buildFilters(searchParams: URLSearchParams) {
  return {
    date_from: searchParams.get("date_from") ?? undefined,
    date_to: searchParams.get("date_to") ?? undefined,
    provider: searchParams.get("provider") ?? undefined,
    customer_type: searchParams.get("customer_type") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    currency: searchParams.get("currency") ?? undefined,
    subscription_plan: searchParams.get("subscription_plan") ?? undefined,
    growth_partner: searchParams.get("growth_partner") ?? undefined,
    customer_segment: searchParams.get("customer_segment") ?? undefined,
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
    if (!ALLOWED_FORMATS.has(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const filters = buildFilters(request.nextUrl.searchParams);
    const { data, error } = await supabase.rpc("get_payment_analytics_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePaymentAnalyticsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    const title = exportTitleForFormat(format);
    const filename = exportFilenameForFormat(format);
    const csv = buildPaymentAnalyticsCsv(parsed, title);

    if (format === "pdf" || format.endsWith("_report") || format.endsWith("_summary") || format.includes("fiken") || format.includes("package") || format.includes("quarterly")) {
      const text = buildPaymentAnalyticsPdfText(parsed, title);
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    if (format === "xlsx") {
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
