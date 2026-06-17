#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Companion Recommendation Engine",
  subtitle: "Intelligent, contextual and actionable recommendations — Aipify suggests, humans decide.",
  loading: "Aipify is preparing recommendations...",
  principle: "Explain every recommendation. Humans remain in control. Transparency before automation.",
  privacyNote: "Recommendations are suggestions only. Final decisions always remain with users and leadership.",
  emptyTitle: "No recommendations are available at the moment.",
  emptyBody: "As Aipify learns more about your workflows and priorities, recommendations will become increasingly personalized.",
  emptyCta: "Review Context Sources",
  accessDenied: "Recommendation access requires an active organization membership.",
  filters: {
    search: "Search recommendations...",
    category: "Category",
    priority: "Priority",
    confidence: "Confidence",
    department: "Department",
    status: "Status",
    dateFrom: "From date",
    all: "All",
  },
  dashboard: {
    healthScore: "Recommendation Health Score",
    activeRecommendations: "Active Recommendations",
    highPriority: "High-Priority Recommendations",
    accepted: "Accepted Recommendations",
    dismissed: "Dismissed Recommendations",
    accuracyScore: "Recommendation Accuracy Score",
    timeline: "Recommendation Timeline",
    usageExamples: "Companion Recommendation Examples",
    whySeeing: "Why am I seeing this?",
  },
  card: {
    reason: "Reason",
    priority: "Priority",
    confidence: "Confidence",
    suggestedAction: "Suggested Action",
    createdDate: "Created Date",
    status: "Status",
    source: "Source",
  },
  actions: {
    accept: "Accept",
    dismiss: "Dismiss",
    saveForLater: "Save For Later",
    review: "Review History",
  },
  feedback: {
    title: "Was this helpful?",
    helpful: "Helpful",
    notHelpful: "Not Helpful",
    alreadyCompleted: "Already Completed",
    notRelevant: "Not Relevant",
  },
  categories: {
    productivity: "Productivity",
    operations: "Operations",
    support: "Support",
    customerSuccess: "Customer Success",
    teamManagement: "Team Management",
    training: "Training",
    security: "Security",
    compliance: "Compliance",
    businessGrowth: "Business Growth",
    communication: "Communication",
    workflowOptimization: "Workflow Optimization",
    strategicPlanning: "Strategic Planning",
  },
  sources: {
    contextEngine: "Context Engine",
    memoryEngine: "Memory Engine",
    calendar: "Calendar",
    tasks: "Tasks",
    notifications: "Notifications",
    companionActivity: "Companion Activity",
    businessPacks: "Business Packs",
    organizationalActivity: "Organizational Activity",
    intelligenceLayer: "Intelligence Layer",
    connectedSystems: "Connected Systems",
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
  statuses: {
    active: "Active",
    accepted: "Accepted",
    dismissed: "Dismissed",
    saved: "Saved",
    completed: "Completed",
    archived: "Archived",
  },
  faq: {
    title: "Recommendation Engine FAQ",
    whatIs: "What is the Recommendation Engine?",
    whatIsAnswer: "The Recommendation Engine helps Aipify identify opportunities, priorities and actions that may improve productivity, operations and organizational performance.",
    decisions: "Can Aipify make decisions for me?",
    decisionsAnswer: "No. Recommendations are suggestions only. Final decisions always remain with users and leadership.",
    explanations: "Why do recommendations include explanations?",
    explanationsAnswer: "Transparency builds trust and helps users understand why recommendations are being made.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionRecommendationEngine = "Companion Recommendations";
  data.companionRecommendationEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
