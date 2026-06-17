#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Work Prioritization",
  subtitle: "Identify, organize and focus on the most important work — transparent recommendations, human decisions.",
  loading: "Aipify is prioritizing your work...",
  principle: "Focus on what matters. Reduce decision fatigue. Support human judgment.",
  privacyNote: "Aipify recommends priorities with transparent reasoning. Users remain responsible for decisions.",
  emptyTitle: "No priorities are currently available.",
  emptyBody: "As tasks, projects and activity increase, Aipify will help identify what deserves attention first.",
  emptyCta: "Review Tasks",
  accessDenied: "Work prioritization access requires an active organization membership.",
  filters: {
    search: "Search priorities...",
    priority: "Priority",
    department: "Department",
    status: "Status",
    project: "Project",
    owner: "Owner",
    all: "All",
  },
  sections: {
    criticalItems: "Critical Items",
    todaysFocus: "Today's Focus",
    upcomingDeadlines: "Upcoming Deadlines",
    delegationOpportunities: "Delegation Opportunities",
    recommendedActions: "Recommended Actions",
    workloadBalance: "Workload Balance",
    dependencies: "Dependencies",
    focusMode: "Focus Mode",
    timeline: "Prioritization Timeline",
    usageExamples: "Companion Prioritization Examples",
    allPriorities: "All Priorities",
  },
  dashboard: {
    workPriorityScore: "Work Priority Score",
    criticalItems: "Critical Items",
    todaysFocus: "Today's Focus",
    upcomingDeadlines: "Upcoming Deadlines",
    delegationOpportunities: "Delegation Opportunities",
    recommendedActions: "Recommended Actions",
  },
  card: {
    reason: "Why this matters",
    recommendedAction: "Recommended action",
    owner: "Owner",
    dueDate: "Due date",
    priority: "Priority",
    status: "Status",
    source: "Source",
    project: "Project",
  },
  actions: {
    recalculate: "Recalculate Priorities",
    viewDetails: "View Details",
    reviewTasks: "Review Tasks",
  },
  priorities: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    optional: "Optional",
  },
  statuses: {
    pending: "Pending",
    inProgress: "In Progress",
    blocked: "Blocked",
    completed: "Completed",
    archived: "Archived",
    postponed: "Postponed",
  },
  sources: {
    tasks: "Tasks",
    calendar: "Calendar",
    approvals: "Approvals",
    projects: "Projects",
    recommendations: "Recommendations",
    proactiveInsights: "Proactive Insights",
    notifications: "Notifications",
    businessPacks: "Business Packs",
    organizationalGoals: "Organizational Goals",
    executivePriorities: "Executive Priorities",
  },
  recommendedActions: {
    completeImmediately: "Complete immediately",
    reviewToday: "Review today",
    scheduleThisWeek: "Schedule this week",
    delegate: "Delegate",
    monitor: "Monitor",
    archive: "Archive",
  },
  workload: {
    current: "Current workload",
    upcoming: "Upcoming workload",
    overloadRisk: "Overload risk",
    capacity: "Capacity",
    delegationSuggestion: "Delegation suggestion",
  },
  dependencies: {
    blocked: "Blocked tasks",
    blocking: "Blocking tasks",
    dependentTeam: "Dependent teams",
    pendingApproval: "Pending approvals",
  },
  focusMode: {
    topPriority: "Top priority",
    nextPriority: "Next priority",
    suggestedSequence: "Suggested sequence",
    estimatedEffort: "Estimated effort",
  },
  faq: {
    title: "Work Prioritization FAQ",
    whatIs: "What is Work Prioritization?",
    whatIsAnswer:
      "Work Prioritization helps users focus on the activities most likely to create value, reduce risk and support organizational goals.",
    canDecide: "Can Aipify decide my priorities?",
    canDecideAnswer: "No. Aipify provides recommendations. Users remain responsible for decisions and execution.",
    howCalculated: "How are priorities calculated?",
    howCalculatedAnswer:
      "Priorities are based on approved context sources including deadlines, impact, dependencies, workload and organizational objectives.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionWorkPrioritizationEngine = "Work Prioritization";
  data.companionWorkPrioritization = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
