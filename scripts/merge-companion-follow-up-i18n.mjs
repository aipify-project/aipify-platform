#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Follow-Ups",
  subtitle: "Consistently follow through on commitments, conversations, meetings and responsibilities — transparent and configurable.",
  loading: "Aipify is reviewing follow-up activity...",
  principle: "Help users keep commitments. Improve accountability. Support trust and reliability.",
  privacyNote: "Aipify assists with follow-up recommendations. Users remain responsible for decisions and communication.",
  emptyTitle: "No follow-ups require attention.",
  emptyBody: "Aipify will help ensure important commitments do not fall through the cracks.",
  emptyCta: "Review Activities",
  accessDenied: "Follow-up access requires an active organization membership.",
  filters: {
    search: "Search follow-ups...",
    status: "Status",
    priority: "Priority",
    owner: "Owner",
    department: "Department",
    category: "Category",
    all: "All",
  },
  sections: {
    openFollowUps: "Open Follow-Ups",
    overdueFollowUps: "Overdue Follow-Ups",
    upcomingFollowUps: "Upcoming Follow-Ups",
    completedFollowUps: "Completed Follow-Ups",
    waitingOnOthers: "Waiting on Others",
    waitingForMe: "Who Is Waiting for Me",
    timeline: "Follow-Up Timeline",
    usageExamples: "Companion Follow-Up Examples",
    allFollowUps: "All Follow-Ups",
  },
  dashboard: {
    healthScore: "Follow-Up Health Score",
    openFollowUps: "Open Follow-Ups",
    overdueFollowUps: "Overdue Follow-Ups",
    upcomingFollowUps: "Upcoming Follow-Ups",
    completedFollowUps: "Completed Follow-Ups",
    successRate: "Follow-Up Success Rate",
  },
  card: {
    explanation: "Why this matters",
    assignedTo: "Assigned to",
    recommendedAction: "Recommended action",
    dueDate: "Due date",
    priority: "Priority",
    status: "Status",
    category: "Category",
    source: "Source",
  },
  actions: {
    complete: "Complete",
    postpone: "Postpone",
    archive: "Archive",
    createReminder: "Create Reminder",
    reviewActivities: "Review Activities",
  },
  priorities: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  },
  statuses: {
    open: "Open",
    pending: "Pending",
    waiting: "Waiting",
    overdue: "Overdue",
    completed: "Completed",
    archived: "Archived",
  },
  categories: {
    personalTasks: "Personal Tasks",
    teamCommitments: "Team Commitments",
    customerFollowUps: "Customer Follow-Ups",
    partnerFollowUps: "Partner Follow-Ups",
    executiveReviews: "Executive Reviews",
    trainingActivities: "Training Activities",
    meetingActions: "Meeting Actions",
    opportunityReviews: "Opportunity Reviews",
    supportEscalations: "Support Escalations",
    approvalRequests: "Approval Requests",
  },
  sources: {
    tasks: "Tasks",
    meetings: "Meetings",
    calendarEvents: "Calendar Events",
    emailActivity: "Email Activity",
    notes: "Notes",
    companionRecommendations: "Companion Recommendations",
    opportunities: "Opportunities",
    projects: "Projects",
    supportCases: "Support Cases",
    businessPacks: "Business Packs",
  },
  recommendedActions: {
    completeImmediately: "Complete immediately",
    reviewToday: "Review today",
    scheduleThisWeek: "Schedule this week",
    delegate: "Delegate",
    monitor: "Monitor",
    archive: "Archive",
  },
  waiting: {
    awaitingResponses: "Awaiting responses",
    pendingApprovals: "Pending approvals",
    externalDependencies: "External dependencies",
    teamDependencies: "Team dependencies",
    assignedRequests: "Assigned requests",
    customerResponses: "Customer responses",
    teamCommitments: "Team commitments",
    leadershipRequests: "Leadership requests",
  },
  faq: {
    title: "Follow-Up Engine FAQ",
    whatIs: "What is the Follow-Up Engine?",
    whatIsAnswer:
      "The Follow-Up Engine helps users track commitments, conversations and responsibilities that require future action.",
    reminders: "Can Aipify send reminders?",
    remindersAnswer: "Yes. Aipify can generate reminders based on user preferences and permissions.",
    whyImportant: "Why is follow-up important?",
    whyImportantAnswer:
      "Consistent follow-up improves accountability, customer experience and organizational execution.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionFollowUpEngine = "Follow-Ups";
  data.companionFollowUp = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
