import type {
  ImplementationBlueprintPhase86,
  ImplementationBlueprintPhase133,
  WorkflowOrchestrationEngineCard,
  WorkflowOrchestrationEngineDashboard,
} from "./types";

function asArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseAutonomousOperationsOrchestration(value: unknown): ImplementationBlueprintPhase86 | undefined {
  const block = asObject(value);
  if (!block) return undefined;
  return {
    phase: typeof block.phase === "number" ? block.phase : undefined,
    title: asString(block.title),
    doc: asString(block.doc),
    engine_phase: asString(block.engine_phase),
    route: asString(block.route),
    mapping_note: asString(block.mapping_note),
    distinction_note: asString(block.distinction_note),
    mission: asString(block.mission),
    philosophy: asString(block.philosophy),
    abos_principle: asString(block.abos_principle),
    vision: asString(block.vision),
    objectives: asArray(block.objectives) as ImplementationBlueprintPhase86["objectives"],
    autonomy_levels: asArray(block.autonomy_levels) as ImplementationBlueprintPhase86["autonomy_levels"],
    operational_examples: asArray(block.operational_examples) as ImplementationBlueprintPhase86["operational_examples"],
    human_approval_principle: asObject(block.human_approval_principle) as ImplementationBlueprintPhase86["human_approval_principle"],
    companion_guidance: asObject(block.companion_guidance) as ImplementationBlueprintPhase86["companion_guidance"],
    audit_transparency: asObject(block.audit_transparency) as ImplementationBlueprintPhase86["audit_transparency"],
    self_love_connection: asObject(block.self_love_connection) as ImplementationBlueprintPhase86["self_love_connection"],
    trust_connection: asObject(block.trust_connection) as ImplementationBlueprintPhase86["trust_connection"],
    safety_principles: asObject(block.safety_principles) as ImplementationBlueprintPhase86["safety_principles"],
    dogfooding: asObject(block.dogfooding) as ImplementationBlueprintPhase86["dogfooding"],
    integration_links: asArray(block.integration_links) as ImplementationBlueprintPhase86["integration_links"],
    success_criteria: asArray(block.success_criteria) as ImplementationBlueprintPhase86["success_criteria"],
    orchestration_summary: asObject(block.orchestration_summary) as ImplementationBlueprintPhase86["orchestration_summary"],
  };
}

function parseAutonomousWorkflowOrchestrationBlueprint(
  value: unknown
): ImplementationBlueprintPhase133 | undefined {
  const block = asObject(value);
  if (!block) return undefined;
  return {
    phase: typeof block.phase === "number" ? block.phase : undefined,
    title: asString(block.title),
    doc: asString(block.doc),
    spec_doc: asString(block.spec_doc),
    engine_phase: asString(block.engine_phase),
    era: asString(block.era),
    route: asString(block.route),
    mapping_note: asString(block.mapping_note),
    distinction_note: asString(block.distinction_note),
    mission: asString(block.mission),
    philosophy: asString(block.philosophy),
    abos_principle: asString(block.abos_principle),
    vision: asString(block.vision),
    objectives: asArray(block.objectives) as ImplementationBlueprintPhase133["objectives"],
    workflow_orchestration_center: asObject(
      block.workflow_orchestration_center
    ) as ImplementationBlueprintPhase133["workflow_orchestration_center"],
    supported_workflow_types: asArray(
      block.supported_workflow_types
    ) as ImplementationBlueprintPhase133["supported_workflow_types"],
    visual_workflow_builder: asObject(
      block.visual_workflow_builder
    ) as ImplementationBlueprintPhase133["visual_workflow_builder"],
    workflow_triggers: asArray(block.workflow_triggers) as ImplementationBlueprintPhase133["workflow_triggers"],
    approval_framework: asObject(block.approval_framework) as ImplementationBlueprintPhase133["approval_framework"],
    companion_participation: asObject(
      block.companion_participation
    ) as ImplementationBlueprintPhase133["companion_participation"],
    exception_management: asObject(
      block.exception_management
    ) as ImplementationBlueprintPhase133["exception_management"],
    workflow_analytics: asObject(block.workflow_analytics) as ImplementationBlueprintPhase133["workflow_analytics"],
    template_library: asArray(block.template_library) as ImplementationBlueprintPhase133["template_library"],
    companion_limitations: asArray(
      block.companion_limitations
    ) as ImplementationBlueprintPhase133["companion_limitations"],
    self_love_connection: asObject(block.self_love_connection) as ImplementationBlueprintPhase133["self_love_connection"],
    security_requirements: asObject(
      block.security_requirements
    ) as ImplementationBlueprintPhase133["security_requirements"],
    dogfooding: asObject(block.dogfooding) as ImplementationBlueprintPhase133["dogfooding"],
    integration_links: asArray(block.integration_links) as ImplementationBlueprintPhase133["integration_links"],
    vision_phrases: asArray<string>(block.vision_phrases),
    privacy_note: asString(block.privacy_note),
    era_capstone_note: asString(block.era_capstone_note),
    success_criteria: asArray(block.success_criteria) as ImplementationBlueprintPhase133["success_criteria"],
    engagement_summary: asObject(block.engagement_summary) as ImplementationBlueprintPhase133["engagement_summary"],
  };
}

export function parseWorkflowOrchestrationEngineCard(data: unknown): WorkflowOrchestrationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: asString(d.philosophy),
    active_workflows: typeof d.active_workflows === "number" ? d.active_workflows : undefined,
    approval_bottlenecks: typeof d.approval_bottlenecks === "number" ? d.approval_bottlenecks : undefined,
    implementation_blueprint_phase40: asObject(d.implementation_blueprint_phase40) as WorkflowOrchestrationEngineCard["implementation_blueprint_phase40"],
    autonomous_workflow_phase: typeof d.autonomous_workflow_phase === "number" ? d.autonomous_workflow_phase : undefined,
    workflow_abos_principle: asString(d.workflow_abos_principle),
    workflow_orchestration_summary: asObject(d.workflow_orchestration_summary) as WorkflowOrchestrationEngineCard["workflow_orchestration_summary"],
    blueprint_note: asString(d.blueprint_note),
    autonomous_operations_orchestration: parseAutonomousOperationsOrchestration(d.autonomous_operations_orchestration),
    implementation_blueprint_phase133: asObject(
      d.implementation_blueprint_phase133
    ) as WorkflowOrchestrationEngineCard["implementation_blueprint_phase133"],
    awobp133_mission: asString(d.awobp133_mission),
    awobp133_abos_principle: asString(d.awobp133_abos_principle),
    awobp133_engagement_summary: asObject(
      d.awobp133_engagement_summary
    ) as WorkflowOrchestrationEngineCard["awobp133_engagement_summary"],
    awobp133_note: asString(d.awobp133_note),
    autonomous_workflow_orchestration_blueprint: parseAutonomousWorkflowOrchestrationBlueprint(
      d.autonomous_workflow_orchestration_blueprint
    ),
    ...d,
  } as WorkflowOrchestrationEngineCard;
}

export function parseWorkflowOrchestrationEngineDashboard(data: unknown): WorkflowOrchestrationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: asString(d.philosophy),
    safety_note: asString(d.safety_note),
    principles: asArray<string>(d.principles),
    summary: asObject(d.summary),
    workflows: asArray(d.workflows),
    templates: asArray(d.templates),
    recent_executions: asArray(d.recent_executions),
    integration_links: asObject(d.integration_links) as WorkflowOrchestrationEngineDashboard["integration_links"],
    implementation_blueprint_phase40: asObject(d.implementation_blueprint_phase40) as WorkflowOrchestrationEngineDashboard["implementation_blueprint_phase40"],
    autonomous_workflow_mission: asString(d.autonomous_workflow_mission),
    autonomous_workflow_philosophy: asString(d.autonomous_workflow_philosophy),
    workflow_objectives: asArray(d.workflow_objectives) as WorkflowOrchestrationEngineDashboard["workflow_objectives"],
    workflow_examples: asArray(d.workflow_examples) as WorkflowOrchestrationEngineDashboard["workflow_examples"],
    approval_principles: asObject(d.approval_principles) as WorkflowOrchestrationEngineDashboard["approval_principles"],
    explainability_principles: asObject(d.explainability_principles) as WorkflowOrchestrationEngineDashboard["explainability_principles"],
    workflow_marketplace_connection: asObject(d.workflow_marketplace_connection) as WorkflowOrchestrationEngineDashboard["workflow_marketplace_connection"],
    workflow_self_love_connection: asObject(d.workflow_self_love_connection) as WorkflowOrchestrationEngineDashboard["workflow_self_love_connection"],
    workflow_dogfooding: asObject(d.workflow_dogfooding) as WorkflowOrchestrationEngineDashboard["workflow_dogfooding"],
    workflow_orchestration_summary: asObject(d.workflow_orchestration_summary) as WorkflowOrchestrationEngineDashboard["workflow_orchestration_summary"],
    workflow_success_criteria: asArray(d.workflow_success_criteria) as WorkflowOrchestrationEngineDashboard["workflow_success_criteria"],
    workflow_vision_phrases: asArray<string>(d.workflow_vision_phrases),
    workflow_abos_principle: asString(d.workflow_abos_principle),
    workflow_distinction_note: asString(d.workflow_distinction_note),
    workflow_integration_links: asArray(d.workflow_integration_links) as WorkflowOrchestrationEngineDashboard["workflow_integration_links"],
    autonomous_operations_orchestration: parseAutonomousOperationsOrchestration(d.autonomous_operations_orchestration),
    implementation_blueprint_phase133: asObject(
      d.implementation_blueprint_phase133
    ) as WorkflowOrchestrationEngineDashboard["implementation_blueprint_phase133"],
    autonomous_workflow_orchestration_engine_note: asString(d.autonomous_workflow_orchestration_engine_note),
    autonomous_organization_era_note: asString(d.autonomous_organization_era_note),
    awobp133_distinction_note: asString(d.awobp133_distinction_note),
    awobp133_mission: asString(d.awobp133_mission),
    awobp133_philosophy: asString(d.awobp133_philosophy),
    awobp133_abos_principle: asString(d.awobp133_abos_principle),
    awobp133_vision: asString(d.awobp133_vision),
    awobp133_objectives: asArray(d.awobp133_objectives) as WorkflowOrchestrationEngineDashboard["awobp133_objectives"],
    awobp133_workflow_orchestration_center: asObject(
      d.awobp133_workflow_orchestration_center
    ) as WorkflowOrchestrationEngineDashboard["awobp133_workflow_orchestration_center"],
    awobp133_supported_workflow_types: asArray(
      d.awobp133_supported_workflow_types
    ) as WorkflowOrchestrationEngineDashboard["awobp133_supported_workflow_types"],
    awobp133_visual_workflow_builder: asObject(
      d.awobp133_visual_workflow_builder
    ) as WorkflowOrchestrationEngineDashboard["awobp133_visual_workflow_builder"],
    awobp133_workflow_triggers: asArray(
      d.awobp133_workflow_triggers
    ) as WorkflowOrchestrationEngineDashboard["awobp133_workflow_triggers"],
    awobp133_approval_framework: asObject(
      d.awobp133_approval_framework
    ) as WorkflowOrchestrationEngineDashboard["awobp133_approval_framework"],
    awobp133_companion_participation: asObject(
      d.awobp133_companion_participation
    ) as WorkflowOrchestrationEngineDashboard["awobp133_companion_participation"],
    awobp133_exception_management: asObject(
      d.awobp133_exception_management
    ) as WorkflowOrchestrationEngineDashboard["awobp133_exception_management"],
    awobp133_workflow_analytics: asObject(
      d.awobp133_workflow_analytics
    ) as WorkflowOrchestrationEngineDashboard["awobp133_workflow_analytics"],
    awobp133_template_library: asArray(
      d.awobp133_template_library
    ) as WorkflowOrchestrationEngineDashboard["awobp133_template_library"],
    awobp133_companion_limitations: asArray(
      d.awobp133_companion_limitations
    ) as WorkflowOrchestrationEngineDashboard["awobp133_companion_limitations"],
    awobp133_self_love_connection: asObject(
      d.awobp133_self_love_connection
    ) as WorkflowOrchestrationEngineDashboard["awobp133_self_love_connection"],
    awobp133_security_requirements: asObject(
      d.awobp133_security_requirements
    ) as WorkflowOrchestrationEngineDashboard["awobp133_security_requirements"],
    awobp133_integration_links: asArray(
      d.awobp133_integration_links
    ) as WorkflowOrchestrationEngineDashboard["awobp133_integration_links"],
    awobp133_dogfooding: asObject(d.awobp133_dogfooding) as WorkflowOrchestrationEngineDashboard["awobp133_dogfooding"],
    awobp133_engagement_summary: asObject(
      d.awobp133_engagement_summary
    ) as WorkflowOrchestrationEngineDashboard["awobp133_engagement_summary"],
    awobp133_success_criteria: asArray(
      d.awobp133_success_criteria
    ) as WorkflowOrchestrationEngineDashboard["awobp133_success_criteria"],
    awobp133_vision_phrases: asArray<string>(d.awobp133_vision_phrases),
    awobp133_privacy_note: asString(d.awobp133_privacy_note),
    autonomous_workflow_orchestration_blueprint: parseAutonomousWorkflowOrchestrationBlueprint(
      d.autonomous_workflow_orchestration_blueprint
    ),
    ...d,
  } as WorkflowOrchestrationEngineDashboard;
}
