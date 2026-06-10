import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number.parseInt(yearParam, 10) : undefined;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("generate_marketing_proof_statements", {
    p_year: Number.isFinite(year) ? year : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const year = typeof body.year === "number" ? body.year : null;

    const supabase = await createClient();
    const { data: proof, error: proofError } = await supabase.rpc(
      "generate_marketing_proof_statements",
      { p_year: year }
    );

    if (proofError || !proof) {
      return NextResponse.json(
        { error: proofError?.message ?? "Unable to generate proof" },
        { status: 403 }
      );
    }

    await supabase.rpc("record_impact_audit_event", {
      p_event_type: "report_downloaded",
      p_details: { year: (proof as { year?: number }).year ?? year },
    });

    const statements = (proof as { statements?: string[] }).statements ?? [];
    const text = statements.join("\n");

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="aipify-marketing-proof-${(proof as { year?: number }).year ?? "report"}.txt"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
