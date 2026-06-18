import type {
  AgentOrchestrationAdvisorSignal,
  AgentOrchestrationAgent,
  AgentOrchestrationApproval,
  AgentOrchestrationTask,
  AgentOrchestrationTeam,
  AgentOrchestrationWorkflow,
  EnterpriseAiAgentOrchestrationCenter,
} from "./types";

function parseAgent(raw: unknown): AgentOrchestrationAgent {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    agent_key: typeof d.agent_key === "string" ? d.agent_key : undefined,
    agent_name: typeof d.agent_name === "string" ? d.agent_name : undefined,
    agent_role: typeof d.agent_role === "string" ? d.agent_role : undefined,
    agent_type: typeof d.agent_type === "string" ? d.agent_type : undefined,
    agent_status: typeof d.agent_status === "string" ? d.agent_status : undefined,
    workload_score: Number(d.workload_score ?? 0),
    capabilities: d.capabilities,
  };
}

function parseTeam(raw: unknown): AgentOrchestrationTeam {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    team_key: typeof d.team_key === "string" ? d.team_key : undefined,
    team_name: typeof d.team_name === "string" ? d.team_name : undefined,
    team_type: typeof d.team_type === "string" ? d.team_type : undefined,
    agent_ids: d.agent_ids,
  };
}

function parseTask(raw: unknown): AgentOrchestrationTask {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    task_key: typeof d.task_key === "string" ? d.task_key : undefined,
    task_title: typeof d.task_title === "string" ? d.task_title : undefined,
    task_status: typeof d.task_status === "string" ? d.task_status : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    assigned_agent_id: typeof d.assigned_agent_id === "string" ? d.assigned_agent_id : null,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
  };
}

function parseWorkflow(raw: unknown): AgentOrchestrationWorkflow {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    workflow_key: typeof d.workflow_key === "string" ? d.workflow_key : undefined,
    workflow_name: typeof d.workflow_name === "string" ? d.workflow_name : undefined,
    workflow_type: typeof d.workflow_type === "string" ? d.workflow_type : undefined,
    workflow_status: typeof d.workflow_status === "string" ? d.workflow_status : undefined,
    started_at: typeof d.started_at === "string" ? d.started_at : null,
    completed_at: typeof d.completed_at === "string" ? d.completed_at : null,
  };
}

function parseApproval(raw: unknown): AgentOrchestrationApproval {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    approval_key: typeof d.approval_key === "string" ? d.approval_key : undefined,
    approval_type: typeof d.approval_type === "string" ? d.approval_type : undefined,
    approval_status: typeof d.approval_status === "string" ? d.approval_status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    task_id: typeof d.task_id === "string" ? d.task_id : null,
    workflow_id: typeof d.workflow_id === "string" ? d.workflow_id : null,
  };
}

function parseSignal(raw: unknown): AgentOrchestrationAdvisorSignal {
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

export function parseEnterpriseAiAgentOrchestrationCenter(
  raw: unknown
): EnterpriseAiAgentOrchestrationCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    coordination_route: typeof d.coordination_route === "string" ? d.coordination_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    agents: Array.isArray(d.agents) ? d.agents.map(parseAgent) : [],
    teams: Array.isArray(d.teams) ? d.teams.map(parseTeam) : [],
    tasks: Array.isArray(d.tasks) ? d.tasks.map(parseTask) : [],
    workflows: Array.isArray(d.workflows) ? d.workflows.map(parseWorkflow) : [],
    approval_requests: Array.isArray(d.approval_requests) ? d.approval_requests.map(parseApproval) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
