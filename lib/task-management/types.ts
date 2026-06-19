export type TaskStatus =
  | "waiting"
  | "information"
  | "needs_attention"
  | "completed"
  | "cancelled"
  | "awaiting_approval"
  | "overdue";

export type TaskPriority = "low" | "normal" | "high" | "critical";

export type TaskRecord = {
  id: string;
  task_number: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_user_id: string | null;
  created_by: string | null;
  department_id: string | null;
  domain_id: string | null;
  related_module_key: string | null;
  business_pack_key: string | null;
  due_date: string | null;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type DepartmentTaskStats = {
  department_id: string;
  department_name: string;
  open: number;
  overdue: number;
  completed: number;
};

export type TaskTemplate = {
  id: string;
  template_key: string;
  name: string;
  description: string;
  business_pack_key: string | null;
  requires_approval: boolean;
};

export type TaskApproval = {
  approval_id: string;
  task_id: string;
  task_title: string;
  approval_status: string;
  submitted_by: string | null;
  created_at: string;
};

export type TaskManagementCenter = {
  found: boolean;
  principle?: string;
  structure?: string;
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  overview?: {
    open: number;
    my_open: number;
    overdue: number;
    awaiting_approval: number;
    completed_30d: number;
    completion_rate: number;
  };
  my_tasks?: TaskRecord[];
  assigned_by_me?: TaskRecord[];
  department_tasks?: DepartmentTaskStats[];
  completed?: TaskRecord[];
  approvals?: TaskApproval[];
  templates?: TaskTemplate[];
  reports?: {
    open_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    by_priority: { critical: number; high: number };
    by_pack: { pack_key: string; count: number }[];
  };
  domains_route?: string;
};
