export type AiWorkforceTab =
  | "overview"
  | "employees"
  | "departments"
  | "assignments"
  | "performance"
  | "training"
  | "governance"
  | "companion"
  | "executive"
  | "reports";

export type DigitalEmployeeRow = {
  id: string;
  employee_key?: string;
  employee_id_label?: string;
  display_name: string;
  role_title?: string;
  employee_type?: string;
  department_key?: string;
  status?: string;
  assigned_manager?: string;
  owner_label?: string;
  activity_summary?: string;
  skills?: unknown;
  permissions?: unknown;
};

export type AiWorkforceCenter = {
  found: boolean;
  principle?: string;
  supervisor_rule?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  digital_employee_registry?: DigitalEmployeeRow[];
  digital_departments?: Record<string, unknown>[];
  assignment_engine?: Record<string, unknown>[];
  skills_framework?: Record<string, unknown>[];
  training_engine?: Record<string, unknown>[];
  performance_engine?: Record<string, unknown>[];
  workload_balancing?: Record<string, unknown>[];
  team_structures?: Record<string, unknown>[];
  business_pack_integration?: Record<string, unknown>[];
  marketplace_prepared?: Record<string, unknown>[];
  governance_center?: Record<string, unknown>[];
  companion_workforce_manager?: Record<string, unknown>;
  permission_framework?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type AiWorkforceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  supervisorRule: string;
  emptyState: string;
  accessDenied: string;
  tabs: Record<AiWorkforceTab, string>;
  overview: {
    digitalEmployees: string;
    activeEmployees: string;
    departments: string;
    assignments: string;
    trainingInProgress: string;
    governanceOpen: string;
    avgPerformanceScore: string;
    hybridTeams: string;
  };
  actions: {
    createEmployee: string;
    createAssignment: string;
    completeTraining: string;
    updatePerformance: string;
    disableEmployee: string;
    openEmployees: string;
    openTraining: string;
    openLegacyWorkforce: string;
  };
  employeeStatuses: Record<string, string>;
  performanceStatuses: Record<string, string>;
  governanceSeverities: Record<string, string>;
  employeesPage: { title: string; subtitle: string };
  trainingPage: { title: string; subtitle: string };
};
