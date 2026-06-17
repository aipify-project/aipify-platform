#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Daily Briefing Center",
  subtitle: "Start your day with clarity — a personalized overview of priorities, events, insights and actions that matter most.",
  loading: "Aipify is preparing your daily briefing...",
  principle: "Start the day with clarity. Surface what matters most. Signal over noise.",
  privacyNote: "Briefings use approved context only. Personalization controls detail level via the Personalization Engine.",
  emptyTitle: "No daily briefing is available yet.",
  emptyBody: "Aipify will begin generating daily briefings as activity and context become available.",
  emptyCta: "Generate Briefing",
  accessDenied: "Daily briefing access requires an active organization membership.",
  filters: {
    search: "Search briefing items...",
    priority: "Priority",
    department: "Department",
    category: "Category",
    status: "Status",
    all: "All",
  },
  header: {
    goodMorning: "Good morning.",
    welcomeBack: "Welcome back.",
    dailyBriefing: "Here is your daily briefing.",
    date: "Date",
    role: "Role",
    organization: "Organization",
  },
  sections: {
    sinceLastLogin: "Since Last Login",
    priorities: "Today's Priorities",
    calendar: "Calendar Overview",
    insightsRecommendations: "Insights & Recommendations",
    executiveSummary: "Executive Summary",
    focusAreas: "Priority Focus Areas",
    timeline: "Briefing Timeline",
    usageExamples: "Companion Daily Briefing Examples",
  },
  dashboard: {
    readinessScore: "Daily Readiness Score",
    focusAreas: "Priority Focus Areas",
    upcomingEvents: "Upcoming Events",
    outstandingTasks: "Outstanding Tasks",
    newInsights: "New Insights",
    newRecommendations: "New Recommendations",
    sinceLastLoginSummary: "Since Last Login Summary",
    todaysFocus: "Today's Focus",
    briefingMode: "Briefing Mode",
  },
  card: {
    recommendedAction: "Recommended action",
    owner: "Owner",
    dueDate: "Due date",
    priority: "Priority",
    status: "Status",
  },
  actions: {
    generate: "Generate Briefing",
    viewDetails: "View Details",
    dismiss: "Dismiss",
  },
  priorities: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    informational: "Informational",
  },
  statuses: {
    critical: "Critical",
    attentionRequired: "Attention Required",
    upcoming: "Upcoming",
    onTrack: "On Track",
    completed: "Completed",
  },
  briefingModes: {
    ultraShort: "Ultra Short",
    summary: "Summary",
    standard: "Standard",
    detailed: "Detailed",
    executive: "Executive",
  },
  focusAreas: {
    customerSuccess: "Customer Success",
    growth: "Growth",
    operations: "Operations",
    teamManagement: "Team Management",
    strategicPlanning: "Strategic Planning",
    support: "Support",
  },
  sinceLastLogin: {
    completedTasks: "Completed tasks",
    newNotifications: "New notifications",
    newSupportRequests: "New support requests",
    newApprovals: "New approvals",
    importantActivity: "Important activity",
  },
  faq: {
    title: "Daily Briefing Center FAQ",
    whatIs: "What is the Daily Briefing Center?",
    whatIsAnswer:
      "The Daily Briefing Center provides a personalized summary of priorities, events, insights and actions relevant to your workday.",
    howGenerated: "How is my briefing generated?",
    howGeneratedAnswer:
      "Briefings are generated using approved context, memory, recommendations, insights and organizational activity.",
    customize: "Can I customize my briefing?",
    customizeAnswer:
      "Yes. Briefing style and detail level are controlled through the Personalization Engine.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionDailyBriefingCenter = "Daily Briefing";
  data.companionDailyBriefing = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
