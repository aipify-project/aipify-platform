import type {
  LogisticsAdvisorSignal,
  LogisticsShipment,
  LogisticsTransportationFleetOperationsCenter,
  LogisticsVehicle,
} from "./types";

function parseVehicle(raw: unknown): LogisticsVehicle {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    vehicle_key: typeof d.vehicle_key === "string" ? d.vehicle_key : undefined,
    vehicle_name: typeof d.vehicle_name === "string" ? d.vehicle_name : undefined,
    vehicle_type: typeof d.vehicle_type === "string" ? d.vehicle_type : undefined,
    vehicle_status: typeof d.vehicle_status === "string" ? d.vehicle_status : undefined,
    utilization_percent: Number(d.utilization_percent ?? 0),
    fleet_value: Number(d.fleet_value ?? 0),
  };
}

function parseShipment(raw: unknown): LogisticsShipment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    shipment_reference: typeof d.shipment_reference === "string" ? d.shipment_reference : undefined,
    origin_label: typeof d.origin_label === "string" ? d.origin_label : undefined,
    destination_label: typeof d.destination_label === "string" ? d.destination_label : undefined,
    shipment_status: typeof d.shipment_status === "string" ? d.shipment_status : undefined,
    transportation_cost: Number(d.transportation_cost ?? 0),
    on_time: typeof d.on_time === "boolean" ? d.on_time : null,
    route_id: typeof d.route_id === "string" ? d.route_id : null,
  };
}

function parseSignal(raw: unknown): LogisticsAdvisorSignal {
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

export function parseLogisticsTransportationFleetOperationsCenter(
  raw: unknown
): LogisticsTransportationFleetOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    warehouse_operations_route: typeof d.warehouse_operations_route === "string" ? d.warehouse_operations_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    vehicles: Array.isArray(d.vehicles) ? d.vehicles.map(parseVehicle) : [],
    drivers: Array.isArray(d.drivers) ? (d.drivers as Array<Record<string, unknown>>) : [],
    routes: Array.isArray(d.routes) ? (d.routes as Array<Record<string, unknown>>) : [],
    shipments: Array.isArray(d.shipments) ? d.shipments.map(parseShipment) : [],
    distribution_centers: Array.isArray(d.distribution_centers)
      ? (d.distribution_centers as Array<Record<string, unknown>>)
      : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
