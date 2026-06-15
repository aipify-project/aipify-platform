import { NextResponse } from "next/server";
import {
  performAipifyHostsDocumentAction,
  uploadAipifyHostsDocument,
} from "@/lib/core/aipify-hosts-document-center";
import { parseAipifyHostsDocumentCenterActionResult } from "@/lib/aipify/aipify-hosts-document-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      document_id?: string;
      document_name?: string;
      category?: string;
      property_id?: string;
      expiration_date?: string;
      file_label?: string;
      action_type?: string;
      change_notes?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "upload":
        if (!body.document_name?.trim() || !body.category) {
          return NextResponse.json({ error: "document_name and category required" }, { status: 400 });
        }
        data = await uploadAipifyHostsDocument(supabase, {
          documentName: body.document_name.trim(),
          category: body.category,
          propertyId: body.property_id,
          expirationDate: body.expiration_date,
          fileLabel: body.file_label,
        });
        break;
      case "document_action":
        if (!body.document_id || !body.action_type) {
          return NextResponse.json({ error: "document_id and action_type required" }, { status: 400 });
        }
        data = await performAipifyHostsDocumentAction(supabase, {
          documentId: body.document_id,
          actionType: body.action_type,
          changeNotes: body.change_notes,
          fileLabel: body.file_label,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsDocumentCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
