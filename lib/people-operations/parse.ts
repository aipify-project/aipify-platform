import type {
  AttendanceRecord,
  DevelopmentRecord,
  LeaveRequest,
  PeopleEmployee,
  PeopleGoal,
  PeopleOperationsCenter,
  PerformanceReview,
  Recognition,
  WorkforcePlan,
} from "./types";

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseEmployee(row: Record<string, unknown>): PeopleEmployee {
  return {
    id: String(row.id ?? ""),
    employee_number: typeof row.employee_number === "string" ? row.employee_number : null,
    full_name: String(row.full_name ?? ""),
    email: typeof row.email === "string" ? row.email : null,
    job_title: typeof row.job_title === "string" ? row.job_title : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    manager_name: typeof row.manager_name === "string" ? row.manager_name : null,
    office_location: typeof row.office_location === "string" ? row.office_location : null,
    employee_status: typeof row.employee_status === "string" ? row.employee_status : null,
    org_role: typeof row.org_role === "string" ? row.org_role : null,
    start_date: typeof row.start_date === "string" ? row.start_date : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseAttendance(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: String(row.id ?? ""),
    employee_name: typeof row.employee_name === "string" ? row.employee_name : null,
    attendance_date: typeof row.attendance_date === "string" ? row.attendance_date : null,
    status: String(row.status ?? "present"),
    work_hours: row.work_hours != null ? Number(row.work_hours) : null,
    location: typeof row.location === "string" ? row.location : null,
  };
}

function parseLeave(row: Record<string, unknown>): LeaveRequest {
  return {
    id: String(row.id ?? ""),
    request_number: typeof row.request_number === "string" ? row.request_number : null,
    employee_name: typeof row.employee_name === "string" ? row.employee_name : null,
    leave_type: String(row.leave_type ?? "vacation"),
    start_date: typeof row.start_date === "string" ? row.start_date : null,
    end_date: typeof row.end_date === "string" ? row.end_date : null,
    status: String(row.status ?? "pending"),
    approval_status: typeof row.approval_status === "string" ? row.approval_status : null,
  };
}

function parseReview(row: Record<string, unknown>): PerformanceReview {
  return {
    id: String(row.id ?? ""),
    review_number: typeof row.review_number === "string" ? row.review_number : null,
    employee_name: typeof row.employee_name === "string" ? row.employee_name : null,
    review_type: String(row.review_type ?? "quarterly"),
    review_period: typeof row.review_period === "string" ? row.review_period : null,
    status: String(row.status ?? "draft"),
    rating: row.rating != null ? Number(row.rating) : null,
  };
}

function parseDevelopment(row: Record<string, unknown>): DevelopmentRecord {
  return {
    id: String(row.id ?? ""),
    employee_name: typeof row.employee_name === "string" ? row.employee_name : null,
    development_type: String(row.development_type ?? "training"),
    title: String(row.title ?? ""),
    status: String(row.status ?? "in_progress"),
    expires_at: typeof row.expires_at === "string" ? row.expires_at : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
  };
}

function parseGoal(row: Record<string, unknown>): PeopleGoal {
  return {
    id: String(row.id ?? ""),
    goal_number: typeof row.goal_number === "string" ? row.goal_number : null,
    title: String(row.title ?? ""),
    goal_scope: String(row.goal_scope ?? "individual"),
    status: String(row.status ?? "planned"),
    progress_percent: row.progress_percent != null ? Number(row.progress_percent) : null,
    target_date: typeof row.target_date === "string" ? row.target_date : null,
    employee_name: typeof row.employee_name === "string" ? row.employee_name : null,
  };
}

function parsePlan(row: Record<string, unknown>): WorkforcePlan {
  return {
    id: String(row.id ?? ""),
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    headcount_current: row.headcount_current != null ? Number(row.headcount_current) : null,
    headcount_target: row.headcount_target != null ? Number(row.headcount_target) : null,
    open_positions: row.open_positions != null ? Number(row.open_positions) : null,
    capacity_score: row.capacity_score != null ? Number(row.capacity_score) : null,
    workload_level: typeof row.workload_level === "string" ? row.workload_level : null,
    hiring_needs: typeof row.hiring_needs === "string" ? row.hiring_needs : null,
  };
}

function parseRecognition(row: Record<string, unknown>): Recognition {
  return {
    id: String(row.id ?? ""),
    employee_name: typeof row.employee_name === "string" ? row.employee_name : null,
    recognition_type: String(row.recognition_type ?? "achievement"),
    title: String(row.title ?? ""),
    recognized_at: typeof row.recognized_at === "string" ? row.recognized_at : null,
  };
}

export function parsePeopleOperationsCenter(data: unknown): PeopleOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    workforce: mapArr(row.workforce).map(parseEmployee),
    attendance: mapArr(row.attendance).map(parseAttendance),
    leave_requests: mapArr(row.leave_requests).map(parseLeave),
    pending_leave: mapArr(row.pending_leave).map(parseLeave),
    development: mapArr(row.development).map(parseDevelopment),
    performance_reviews: mapArr(row.performance_reviews).map(parseReview),
    goals: mapArr(row.goals).map(parseGoal),
    workforce_planning: mapArr(row.workforce_planning).map(parsePlan),
    recognitions: mapArr(row.recognitions).map(parseRecognition),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
