export type PeopleEmployee = {
  id: string;
  employee_number?: string | null;
  full_name: string;
  email?: string | null;
  job_title?: string | null;
  department_name?: string | null;
  manager_name?: string | null;
  office_location?: string | null;
  employee_status?: string | null;
  org_role?: string | null;
  start_date?: string | null;
  updated_at?: string | null;
};

export type AttendanceRecord = {
  id: string;
  employee_name?: string | null;
  attendance_date?: string | null;
  status: string;
  work_hours?: number | null;
  location?: string | null;
};

export type LeaveRequest = {
  id: string;
  request_number?: string | null;
  employee_name?: string | null;
  leave_type: string;
  start_date?: string | null;
  end_date?: string | null;
  status: string;
  approval_status?: string | null;
};

export type PerformanceReview = {
  id: string;
  review_number?: string | null;
  employee_name?: string | null;
  review_type: string;
  review_period?: string | null;
  status: string;
  rating?: number | null;
};

export type DevelopmentRecord = {
  id: string;
  employee_name?: string | null;
  development_type: string;
  title: string;
  status: string;
  expires_at?: string | null;
  business_pack_key?: string | null;
};

export type PeopleGoal = {
  id: string;
  goal_number?: string | null;
  title: string;
  goal_scope: string;
  status: string;
  progress_percent?: number | null;
  target_date?: string | null;
  employee_name?: string | null;
};

export type WorkforcePlan = {
  id: string;
  department_name?: string | null;
  headcount_current?: number | null;
  headcount_target?: number | null;
  open_positions?: number | null;
  capacity_score?: number | null;
  workload_level?: string | null;
  hiring_needs?: string | null;
};

export type Recognition = {
  id: string;
  employee_name?: string | null;
  recognition_type: string;
  title: string;
  recognized_at?: string | null;
};

export type PeopleOperationsCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  workforce?: PeopleEmployee[];
  attendance?: AttendanceRecord[];
  leave_requests?: LeaveRequest[];
  pending_leave?: LeaveRequest[];
  development?: DevelopmentRecord[];
  performance_reviews?: PerformanceReview[];
  goals?: PeopleGoal[];
  workforce_planning?: WorkforcePlan[];
  recognitions?: Recognition[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
