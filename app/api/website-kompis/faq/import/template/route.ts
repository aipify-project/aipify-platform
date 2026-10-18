import { NextResponse } from "next/server";
import { buildFaqImportCsvTemplate } from "@/lib/website-kompis-faq/import-csv";
import { requireFaqImportUser } from "@/lib/website-kompis-faq/import-server";
import { buildFaqImportXlsxTemplate } from "@/lib/website-kompis-faq/import-xlsx";

export async function GET(request: Request) {
  const auth = await requireFaqImportUser();
  if ("error" in auth) return auth.error;
  const format = new URL(request.url).searchParams.get("format");
  if (format === "xlsx") {
    const bytes = buildFaqImportXlsxTemplate();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=\"kompis-web-faq-import-v1.xlsx\"",
        "Cache-Control": "private, no-store",
      },
    });
  }
  if (format === "csv") {
    const bytes = buildFaqImportCsvTemplate();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"kompis-web-faq-import-v1.csv\"",
        "Cache-Control": "private, no-store",
      },
    });
  }
  return NextResponse.json({ error: "format" }, { status: 400 });
}
