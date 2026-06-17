import type {
  ManufacturingAdvisorSignal,
  ManufacturingMaterial,
  ManufacturingProductionIndustrialOperationsCenter,
  ManufacturingProductionLine,
  ManufacturingWorkOrder,
} from "./types";

function parseWorkOrder(raw: unknown): ManufacturingWorkOrder {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    work_order_key: typeof d.work_order_key === "string" ? d.work_order_key : undefined,
    product_name: typeof d.product_name === "string" ? d.product_name : undefined,
    quantity: Number(d.quantity ?? 0),
    work_order_status: typeof d.work_order_status === "string" ? d.work_order_status : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    production_line_id: typeof d.production_line_id === "string" ? d.production_line_id : null,
    start_date: typeof d.start_date === "string" ? d.start_date : null,
    completion_date: typeof d.completion_date === "string" ? d.completion_date : null,
  };
}

function parseMaterial(raw: unknown): ManufacturingMaterial {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    material_key: typeof d.material_key === "string" ? d.material_key : undefined,
    material_name: typeof d.material_name === "string" ? d.material_name : undefined,
    material_type: typeof d.material_type === "string" ? d.material_type : undefined,
    inventory_quantity: Number(d.inventory_quantity ?? 0),
    availability_status: typeof d.availability_status === "string" ? d.availability_status : undefined,
    material_cost: Number(d.material_cost ?? 0),
  };
}

function parseProductionLine(raw: unknown): ManufacturingProductionLine {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    line_key: typeof d.line_key === "string" ? d.line_key : undefined,
    line_name: typeof d.line_name === "string" ? d.line_name : undefined,
    capacity_units: Number(d.capacity_units ?? 0),
    output_units: Number(d.output_units ?? 0),
    utilization_percent: Number(d.utilization_percent ?? 0),
    maintenance_status: typeof d.maintenance_status === "string" ? d.maintenance_status : undefined,
    quality_score: Number(d.quality_score ?? 0),
  };
}

function parseSignal(raw: unknown): ManufacturingAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseManufacturingProductionIndustrialOperationsCenter(
  raw: unknown
): ManufacturingProductionIndustrialOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    work_orders: Array.isArray(d.work_orders) ? d.work_orders.map(parseWorkOrder) : [],
    materials: Array.isArray(d.materials) ? d.materials.map(parseMaterial) : [],
    production_lines: Array.isArray(d.production_lines) ? d.production_lines.map(parseProductionLine) : [],
    quality_inspections: Array.isArray(d.quality_inspections)
      ? (d.quality_inspections as Array<Record<string, unknown>>)
      : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
