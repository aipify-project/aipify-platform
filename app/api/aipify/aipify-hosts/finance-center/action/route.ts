import { NextResponse } from "next/server";
import {
  exportAipifyHostsFinanceReport,
  recordAipifyHostsExpense,
} from "@/lib/core/aipify-hosts-finance-center";
import { parseAipifyHostsFinanceCenterActionResult } from "@/lib/aipify/aipify-hosts-finance-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      category?: string;
      amount?: number;
      property_id?: string;
      expense_date?: string;
      notes?: string;
      report_key?: string;
      format?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "record_expense":
        if (!body.category || !body.amount || body.amount <= 0) {
          return NextResponse.json({ error: "category and positive amount required" }, { status: 400 });
        }
        data = await recordAipifyHostsExpense(
          supabase,
          body.category,
          body.amount,
          body.property_id,
          body.expense_date,
          body.notes,
        );
        break;
      case "export_report":
        if (!body.report_key) {
          return NextResponse.json({ error: "report_key required" }, { status: 400 });
        }
        data = await exportAipifyHostsFinanceReport(supabase, body.report_key, body.format ?? "pdf");
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsFinanceCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
