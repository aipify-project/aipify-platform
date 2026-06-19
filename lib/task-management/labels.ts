import type { Translator } from "@/lib/i18n/translate";

export type TaskManagementLabels = {
  title: string;
  subtitle: string;
  overview: string;
  myTasks: string;
  assignedByMe: string;
  departmentTasks: string;
  completed: string;
  approvals: string;
  templates: string;
  reports: string;
  accessDenied: string;
  createTask: string;
  taskTitle: string;
  taskDescription: string;
  priority: string;
  dueDate: string;
  save: string;
  complete: string;
  approve: string;
  reject: string;
  escalate: string;
  cancel: string;
  useTemplate: string;
  open: string;
  overdue: string;
  awaitingApproval: string;
  completionRate: string;
  department: string;
  pack: string;
  status: string;
  noTasks: string;
  noTasksHint: string;
  statusWaiting: string;
  statusInformation: string;
  statusNeedsAttention: string;
  statusCompleted: string;
  statusCancelled: string;
  statusAwaitingApproval: string;
  statusOverdue: string;
  priorityLow: string;
  priorityNormal: string;
  priorityHigh: string;
  priorityCritical: string;
};

export function buildTaskManagementLabels(t: Translator): TaskManagementLabels {
  const p = "customerApp.taskManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    overview: t(`${p}.overview`),
    myTasks: t(`${p}.myTasks`),
    assignedByMe: t(`${p}.assignedByMe`),
    departmentTasks: t(`${p}.departmentTasks`),
    completed: t(`${p}.completed`),
    approvals: t(`${p}.approvals`),
    templates: t(`${p}.templates`),
    reports: t(`${p}.reports`),
    accessDenied: t(`${p}.accessDenied`),
    createTask: t(`${p}.createTask`),
    taskTitle: t(`${p}.taskTitle`),
    taskDescription: t(`${p}.taskDescription`),
    priority: t(`${p}.priority`),
    dueDate: t(`${p}.dueDate`),
    save: t(`${p}.save`),
    complete: t(`${p}.complete`),
    approve: t(`${p}.approve`),
    reject: t(`${p}.reject`),
    escalate: t(`${p}.escalate`),
    cancel: t(`${p}.cancel`),
    useTemplate: t(`${p}.useTemplate`),
    open: t(`${p}.open`),
    overdue: t(`${p}.overdue`),
    awaitingApproval: t(`${p}.awaitingApproval`),
    completionRate: t(`${p}.completionRate`),
    department: t(`${p}.department`),
    pack: t(`${p}.pack`),
    status: t(`${p}.status`),
    noTasks: t(`${p}.noTasks`),
    noTasksHint: t(`${p}.noTasksHint`),
    statusWaiting: t(`${p}.statusWaiting`),
    statusInformation: t(`${p}.statusInformation`),
    statusNeedsAttention: t(`${p}.statusNeedsAttention`),
    statusCompleted: t(`${p}.statusCompleted`),
    statusCancelled: t(`${p}.statusCancelled`),
    statusAwaitingApproval: t(`${p}.statusAwaitingApproval`),
    statusOverdue: t(`${p}.statusOverdue`),
    priorityLow: t(`${p}.priorityLow`),
    priorityNormal: t(`${p}.priorityNormal`),
    priorityHigh: t(`${p}.priorityHigh`),
    priorityCritical: t(`${p}.priorityCritical`),
  };
}

export function statusLabel(labels: TaskManagementLabels, status: string): string {
  switch (status) {
    case "waiting": return labels.statusWaiting;
    case "information": return labels.statusInformation;
    case "needs_attention": return labels.statusNeedsAttention;
    case "completed": return labels.statusCompleted;
    case "cancelled": return labels.statusCancelled;
    case "awaiting_approval": return labels.statusAwaitingApproval;
    case "overdue": return labels.statusOverdue;
    default: return status;
  }
}

export function priorityLabel(labels: TaskManagementLabels, priority: string): string {
  switch (priority) {
    case "low": return labels.priorityLow;
    case "normal": return labels.priorityNormal;
    case "high": return labels.priorityHigh;
    case "critical": return labels.priorityCritical;
    default: return priority;
  }
}
