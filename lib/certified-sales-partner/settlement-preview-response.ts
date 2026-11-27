import { NextResponse } from "next/server";
import { renderSettlementPreviewPdf } from "./settlement-document-pdf";
import { buildSettlementDocument, readSettlementSource } from "./settlement-document";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Preview PDF for one settlement already returned by the caller's own list RPC. */
export async function settlementPreviewResponse(payload: unknown, id: string, locale: string) {
  if (!UUID.test(id)) return NextResponse.json({ error: "invalid_settlement_id" }, { status: 400 });
  const source = readSettlementSource(payload, id);
  if (!source) return NextResponse.json({ error: "settlement_not_found" }, { status: 404 });
  const model = buildSettlementDocument(source, locale);
  const bytes = await renderSettlementPreviewPdf(model);
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="commission-statement-preview.pdf"',
      "Cache-Control": "private, no-store",
      "X-Aipify-Document-Issued": "false",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
