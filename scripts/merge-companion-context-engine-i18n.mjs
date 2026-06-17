#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Companion Context Engine",
  subtitle: "Understand what is happening across your work environment so Aipify assistance becomes more relevant and valuable.",
  loading: "Aipify is building contextual awareness...",
  principle: "Context before recommendations. Permission-first access. Privacy by design.",
  privacyNote: "Aipify only uses metadata from approved, authorized context sources — never information outside granted permissions.",
  emptyTitle: "No context sources are currently connected.",
  emptyBody: "Connect systems and workflows to help Aipify provide more relevant assistance.",
  emptyCta: "Connect Context Sources",
  accessDenied: "Companion context access requires an active organization membership.",
  filters: {
    search: "Search context sources and signals...",
    source: "Context source",
    department: "Department",
    priority: "Priority",
    dateFrom: "From date",
    all: "All",
  },
  dashboard: {
    contextHealthScore: "Context Health Score",
    companionReadinessScore: "Companion Readiness Score",
    availableSignals: "Available Signals",
    contextCoverage: "Context Coverage",
    activeSources: "Active Context Sources",
    recentlyUpdated: "Recently Updated Sources",
    userContext: "User Context",
    organizationContext: "Organization Context",
    workContext: "Work Context",
    companionView: "Companion Context View",
    currentFocus: "Current Focus",
    recentActivity: "Recent Activity",
    pendingActions: "Pending Actions",
    upcomingEvents: "Upcoming Events",
    recommendedAttention: "Recommended Attention Areas",
    contextConfidence: "Context Confidence Level",
    timeline: "Context Timeline",
    recommendations: "Recommended Attention",
    usageExamples: "Companion Usage Examples",
    connectSources: "Connect Context Sources",
  },
  source: {
    status: "Status",
    signals: "Signals",
    coverage: "Coverage",
    category: "Category",
  },
  recommendation: {
    effort: "Estimated effort",
    value: "Potential value",
  },
  sources: {
    userProfile: "User Profile",
    rolePermissions: "Role & Permissions",
    organization: "Organization",
    businessPacks: "Installed Business Packs",
    connectedApplications: "Connected Applications",
    notifications: "Notifications",
    tasks: "Tasks",
    calendarEvents: "Calendar Events",
    recentActivity: "Recent Activity",
    knowledgeCenter: "Knowledge Center",
    companionHistory: "Companion History",
    supportActivity: "Support Activity",
    operationalActivity: "Operational Activity",
  },
  statuses: {
    connected: "Connected",
    disconnected: "Disconnected",
    pending: "Pending",
    restricted: "Restricted",
  },
  priorities: {
    low: "Low",
    moderate: "Moderate",
    high: "High",
    critical: "Critical",
  },
  confidenceLevels: {
    low: "Low",
    moderate: "Moderate",
    high: "High",
  },
  faq: {
    title: "Companion Context Engine FAQ",
    whatIs: "What is the Companion Context Engine?",
    whatIsAnswer: "The Companion Context Engine helps Aipify understand what is happening across your work environment so assistance becomes more relevant and useful.",
    autoAccess: "Does Aipify access everything automatically?",
    autoAccessAnswer: "No. Aipify only uses information from systems and sources that have been explicitly connected and authorized.",
    whyImportant: "Why is context important?",
    whyImportantAnswer: "Context allows Aipify to provide assistance that reflects current priorities, tasks and organizational activity rather than generic responses.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionContextEngine = "Companion Context Engine";
  data.companionContextEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
