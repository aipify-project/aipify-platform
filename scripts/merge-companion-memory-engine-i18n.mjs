#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Companion Memory Expansion Engine",
  subtitle: "Long-term memory for Aipify Companion — approved information that makes assistance increasingly valuable over time.",
  loading: "Aipify is reviewing available memory context...",
  principle: "Memory must be transparent. Users remain in control. Trust before automation.",
  privacyNote: "Aipify never treats low-confidence memories as facts. Memory remains transparent and manageable.",
  emptyTitle: "No memories have been created yet.",
  emptyBody: "As you work with Aipify, approved memories help the Companion provide increasingly personalized assistance.",
  emptyCta: "Explore Memory Center",
  accessDenied: "Companion memory access requires an active organization membership.",
  filters: {
    search: "Search memories...",
    memoryType: "Memory type",
    source: "Source",
    department: "Department",
    status: "Status",
    confidence: "Confidence",
    dateFrom: "From date",
    all: "All",
  },
  dashboard: {
    memoryHealthScore: "Memory Health Score",
    activeMemories: "Active Memories",
    approvedMemories: "User Approved Memories",
    recentlyLearned: "Recently Learned Items",
    memorySources: "Memory Sources",
    memoryConfidence: "Memory Confidence",
    userApproved: "Approved Count",
    reviewCenter: "Memory Review Center",
    timeline: "Memory Timeline",
    usageExamples: "Companion Memory Examples",
    temporaryMemory: "Temporary Memory",
    longTermMemory: "Long-Term Memory",
    organizationalMemory: "Organizational Memory",
    userMemory: "User Memory",
  },
  review: {
    suggestedMemory: "Suggested Memory",
    source: "Source",
    reason: "Reason",
    confidence: "Confidence",
    approvalStatus: "Approval Status",
    dateLearned: "Date Learned",
    approve: "Approve",
    reject: "Reject",
    edit: "Edit",
    archive: "Archive",
    delete: "Delete",
  },
  memoryTypes: {
    temporary: "Temporary",
    longTerm: "Long-Term",
  },
  memoryScopes: {
    personal: "Personal Memory",
    team: "Team Memory",
    department: "Department Memory",
    organization: "Organization Memory",
    global: "Global System Memory",
  },
  categories: {
    userPreferences: "User Preferences",
    teamPreferences: "Team Preferences",
    organizationalPreferences: "Organizational Preferences",
    companionPreferences: "Companion Preferences",
    communicationStyle: "Communication Style",
    operationalWorkflows: "Operational Workflows",
    approvedProcesses: "Approved Processes",
    recurringTasks: "Recurring Tasks",
    importantDates: "Important Dates",
    businessContext: "Business Context",
    relationshipContext: "Relationship Context",
    knowledgeReferences: "Knowledge References",
  },
  sources: {
    userInteraction: "User Interactions",
    workflowObservation: "Workflow Observation",
    organizationProfile: "Organization Profile",
    companionLearning: "Companion Learning",
  },
  statuses: {
    suggested: "Suggested",
    approved: "Approved",
    rejected: "Rejected",
    archived: "Archived",
  },
  confidenceLevels: {
    high: "High",
    medium: "Medium",
    low: "Low",
    unverified: "Unverified",
  },
  faq: {
    title: "Companion Memory FAQ",
    whatIs: "What is Companion Memory?",
    whatIsAnswer: "Companion Memory allows Aipify to remember approved information so assistance becomes more personalized and useful over time.",
    control: "Can I control what Aipify remembers?",
    controlAnswer: "Yes. Memory remains transparent and manageable through the Memory Review Center.",
    delete: "Can memories be deleted?",
    deleteAnswer: "Yes. Authorized users may review, edit, archive or delete memories.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionMemoryExpansionEngine = "Companion Memory Engine";
  data.companionMemoryEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
