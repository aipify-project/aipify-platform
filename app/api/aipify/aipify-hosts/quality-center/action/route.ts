import { NextResponse } from "next/server";
import {
  addAipifyHostsInspectionPhotoEvidence,
  createAipifyHostsInspectionCorrectiveAction,
  createAipifyHostsQualityReview,
  escalateAipifyHostsInspectionFinding,
  recordAipifyHostsInspectionOutcome,
  scheduleAipifyHostsInspection,
  updateAipifyHostsInspectionStatus,
} from "@/lib/core/aipify-hosts-quality-center";
import { parseAipifyHostsQualityCenterActionResult } from "@/lib/aipify/aipify-hosts-quality-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      inspection_id?: string;
      inspection_type?: string;
      property_id?: string;
      assigned_inspector?: string;
      scheduled_date?: string;
      status?: string;
      outcome?: string;
      property_score?: number;
      inspector_notes?: string;
      recommended_actions?: string;
      improvement_opportunities?: string;
      action_summary?: string;
      assigned_owner?: string;
      due_date?: string;
      create_task?: boolean;
      action_id?: string;
      checklist_category?: string;
      reference_label?: string;
      caption?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "schedule_inspection":
        if (!body.inspection_type) {
          return NextResponse.json({ error: "inspection_type required" }, { status: 400 });
        }
        data = await scheduleAipifyHostsInspection(supabase, {
          inspectionType: body.inspection_type,
          propertyId: body.property_id,
          assignedInspector: body.assigned_inspector,
          scheduledDate: body.scheduled_date,
        });
        break;
      case "update_status":
        if (!body.inspection_id || !body.status) {
          return NextResponse.json({ error: "inspection_id and status required" }, { status: 400 });
        }
        data = await updateAipifyHostsInspectionStatus(supabase, body.inspection_id, body.status);
        break;
      case "record_outcome":
        if (!body.inspection_id || !body.outcome) {
          return NextResponse.json({ error: "inspection_id and outcome required" }, { status: 400 });
        }
        data = await recordAipifyHostsInspectionOutcome(supabase, body.inspection_id, body.outcome);
        break;
      case "create_review":
        if (!body.inspection_id) {
          return NextResponse.json({ error: "inspection_id required" }, { status: 400 });
        }
        data = await createAipifyHostsQualityReview(supabase, {
          inspectionId: body.inspection_id,
          propertyScore: body.property_score,
          inspectorNotes: body.inspector_notes,
          recommendedActions: body.recommended_actions,
          improvementOpportunities: body.improvement_opportunities,
        });
        break;
      case "corrective_action":
        if (!body.inspection_id || !body.action_summary?.trim()) {
          return NextResponse.json({ error: "inspection_id and action_summary required" }, { status: 400 });
        }
        data = await createAipifyHostsInspectionCorrectiveAction(supabase, {
          inspectionId: body.inspection_id,
          actionSummary: body.action_summary.trim(),
          assignedOwner: body.assigned_owner,
          dueDate: body.due_date,
          createTask: body.create_task,
        });
        break;
      case "escalate":
        if (!body.inspection_id) {
          return NextResponse.json({ error: "inspection_id required" }, { status: 400 });
        }
        data = await escalateAipifyHostsInspectionFinding(supabase, body.inspection_id, body.action_id);
        break;
      case "add_photo_evidence":
        if (!body.inspection_id || !body.checklist_category || !body.reference_label?.trim()) {
          return NextResponse.json({ error: "inspection_id, checklist_category, reference_label required" }, { status: 400 });
        }
        data = await addAipifyHostsInspectionPhotoEvidence(supabase, {
          inspectionId: body.inspection_id,
          checklistCategory: body.checklist_category,
          referenceLabel: body.reference_label.trim(),
          caption: body.caption,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsQualityCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
