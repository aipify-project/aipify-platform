import { NextRequest, NextResponse } from "next/server";
import {
  buildComplianceGovernanceCsv,
  buildComplianceGovernancePdfText,
  parseComplianceGovernanceCenter,
} from "@/lib/compliance-governance-center";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    category: searchParams.get("category") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    risk_level: searchParams.get("risk_level") ?? undefined,
    owner: searchParams.get("owner") ?? undefined,
    review_from: searchParams.get("review_from") ?? undefined,
    review_to: searchParams.get("review_to") ?? undefined,
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
    const { data, error } = await supabase.rpc("get_compliance_governance_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseComplianceGovernanceCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    await supabase.rpc("record_compliance_governance_action", {
      p_payload: { action: "generate_report", format, summary: `Compliance report export (${format})`, filters },
    });

    const csv = buildComplianceGovernanceCsv(parsed);

    if (format === "pdf") {
      const text = buildComplianceGovernancePdfText(parsed);
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": 'attachment; filename="compliance-governance-report.pdf"',
        },
      });
    }

    if (format === "xlsx") {
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="compliance-governance-report.xlsx"',
        },
      });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="compliance-governance-report.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
