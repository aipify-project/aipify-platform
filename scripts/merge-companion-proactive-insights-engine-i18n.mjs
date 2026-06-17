#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Companion Proactive Insights Engine",
  subtitle: "Meaningful observations and patterns surfaced before you ask — Aipify observes, humans decide.",
  loading: "Aipify is analyzing activity patterns...",
  principle: "Surface meaningful observations. Explain reasoning. High signal, low noise.",
  privacyNote: "Insights are informational and advisory. Users remain responsible for decisions and actions.",
  emptyTitle: "No proactive insights are available yet.",
  emptyBody: "As Aipify learns more about organizational activity, proactive insights will become increasingly valuable.",
  emptyCta: "Review Context Sources",
  accessDenied: "Proactive insights access requires an active organization membership.",
  filters: {
    search: "Search insights...",
    category: "Category",
    priority: "Priority",
    confidence: "Confidence",
    impact: "Impact",
    department: "Department",
    status: "Status",
    dateFrom: "From date",
    all: "All",
  },
  dashboard: {
    healthScore: "Insight Health Score",
    activeInsights: "Active Insights",
    highPriority: "High-Priority Insights",
    newInsights: "New Insights",
    reviewed: "Reviewed Insights",
    impactScore: "Insight Impact Score",
    timeline: "Insight Timeline",
    usageExamples: "Proactive Companion Examples",
    whyGenerated: "Why was this generated?",
    whyMatters: "Why it matters",
    dataSources: "Data sources",
    patternDetection: "Pattern detected",
  },
  card: {
    observation: "Observation",
    confidence: "Confidence",
    impact: "Impact",
    suggestedReview: "Suggested Review",
    createdDate: "Created Date",
    status: "Status",
    source: "Source",
    priority: "Priority",
  },
  actions: {
    review: "Review",
    dismiss: "Dismiss",
    archive: "Archive",
    escalate: "Escalate",
  },
  feedback: {
    title: "Was this insight useful?",
    helpful: "Helpful",
    notHelpful: "Not Helpful",
    interesting: "Interesting",
    alreadyKnown: "Already Known",
    notRelevant: "Not Relevant",
  },
  categories: {
    productivity: "Productivity",
    operations: "Operations",
    support: "Support",
    customers: "Customers",
    workforce: "Workforce",
    training: "Training",
    growth: "Growth",
    security: "Security",
    compliance: "Compliance",
    leadership: "Leadership",
    communication: "Communication",
    strategicPlanning: "Strategic Planning",
  },
  sources: {
    contextEngine: "Context Engine",
    memoryEngine: "Memory Engine",
    recommendationEngine: "Recommendation Engine",
    calendar: "Calendar",
    tasks: "Tasks",
    notifications: "Notifications",
    businessPacks: "Business Packs",
    intelligenceLayer: "Intelligence Layer",
    supportActivity: "Support Activity",
    organizationalActivity: "Organizational Activity",
    connectedSystems: "Connected Systems",
    companionActivity: "Companion Activity",
  },
  priorities: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    informational: "Informational",
  },
  confidenceLevels: {
    veryHigh: "Very High",
    high: "High",
    medium: "Medium",
    low: "Low",
    experimental: "Experimental",
  },
  impactLevels: {
    major: "Major",
    moderate: "Moderate",
    minor: "Minor",
    informational: "Informational",
  },
  statuses: {
    new: "New",
    reviewed: "Reviewed",
    dismissed: "Dismissed",
    escalated: "Escalated",
    archived: "Archived",
  },
  patterns: {
    repeatedIssues: "Repeated issues",
    repeatedDelays: "Repeated delays",
    repeatedRequests: "Repeated requests",
    workflowBottlenecks: "Workflow bottlenecks",
    performanceTrends: "Performance trends",
    behavioralPatterns: "Behavioral patterns",
    communicationPatterns: "Communication patterns",
  },
  faq: {
    title: "Proactive Insights FAQ",
    whatAre: "What are Proactive Insights?",
    whatAreAnswer: "Proactive Insights help Aipify identify important observations and patterns before users explicitly ask.",
    autoAction: "Does Aipify take action automatically?",
    autoActionAnswer: "No. Insights are informational and advisory. Users remain responsible for decisions and actions.",
    howGenerated: "How are insights generated?",
    howGeneratedAnswer: "Insights are generated from approved context sources, activity patterns and organizational signals.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionProactiveInsightsEngine = "Proactive Insights";
  data.companionProactiveInsightsEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
