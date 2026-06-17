#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Intelligence Command Center",
  subtitle: "Unified executive intelligence — consolidated strategic health, readiness, opportunities and future outlook.",
  loading: "Aipify is preparing your executive intelligence briefing...",
  principle: "One place for leadership visibility — high signal, low noise. Aipify advises; leadership decides.",
  advisoryNote: "The Intelligence Command Center aggregates insights from all intelligence modules — final decisions remain with leadership.",
  emptyTitle: "No intelligence insights are available yet.",
  emptyBody: "The Intelligence Command Center becomes more valuable as organizational intelligence modules are used.",
  emptyCta: "Open Intelligence Modules",
  accessDenied: "Intelligence Command Center access requires owner authorization or explicit grant.",
  filters: {
    search: "Search priorities, actions, observations...",
    category: "Intelligence category",
    priority: "Priority",
    timeHorizon: "Time horizon",
    department: "Department",
    executiveOwner: "Executive owner",
    reviewStatus: "Review status",
    all: "All",
  },
  dashboard: {
    intelligenceScore: "Enterprise Intelligence Score",
    executiveHealthScore: "Executive Health Score",
    readinessScore: "Organizational Readiness",
    opportunityScore: "Strategic Opportunity",
    forecastScore: "Forecast Confidence",
    collaborationScore: "Collaboration Health",
    futurePreparednessScore: "Future Preparedness",
    executiveSummary: "Executive Summary",
    keyObservations: "Key Observations",
    executiveSnapshot: "Executive Snapshot",
    topPriorities: "Top Intelligence Priorities",
    opportunitiesRisks: "Opportunities & Risks",
    futureOutlook: "Future Outlook",
    crossFunctionalHealth: "Cross-Functional Health",
    executiveActions: "Executive Actions",
    intelligenceSources: "Intelligence Sources",
    briefingMode: "Executive Briefing",
    priorities: "Priorities",
    timeline: "Intelligence Timeline",
    viewModule: "Open module",
    refreshIntelligence: "Refresh intelligence",
    markReviewed: "Mark reviewed",
  },
  briefing: {
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
    summary: "Briefing summary",
    keyObservations: "Key observations",
    suggestedActions: "Suggested actions",
    reviewItems: "Review items",
    generate: "Generate briefing",
  },
  priority: {
    sourceModule: "Source",
    priorityLevel: "Priority",
    category: "Category",
    timeHorizon: "Time horizon",
    recommendedAction: "Recommended action",
    reviewStatus: "Status",
  },
  outlook: {
    "30Days": "30 Days",
    "90Days": "90 Days",
    "6Months": "6 Months",
    "12Months": "12 Months",
    "24Months": "24 Months",
  },
  priorityLevels: { critical: "Critical", high: "High", medium: "Medium", low: "Low" },
  reviewStatuses: { pending: "Pending", inReview: "In review", reviewed: "Reviewed", actioned: "Actioned" },
  sourceModules: {
    enterpriseBenchmarking: "Enterprise Benchmarking",
    predictiveIntelligence: "Predictive Intelligence",
    scenarioPlanning: "Scenario Planning",
    executiveForesight: "Executive Foresight",
    strategicOpportunities: "Strategic Opportunities",
    organizationalForecasting: "Organizational Forecasting",
    enterpriseReadiness: "Enterprise Readiness",
    crossFunctionalIntelligence: "Cross-Functional Intelligence",
    command_center: "Command Center",
  },
  timelineEvents: {
    eiccInitialized: "Intelligence Command Center initialized",
    intelligenceRefreshed: "Intelligence refreshed",
    priorityReviewed: "Priority reviewed",
    strategicDecision: "Strategic decision recorded",
    leadershipMilestone: "Leadership milestone",
  },
  refresh: { success: "Intelligence refreshed from all modules." },
  faq: {
    title: "Intelligence Command Center FAQ",
    whatIs: "What is the Intelligence Command Center?",
    whatIsAnswer: "The Intelligence Command Center provides a consolidated executive overview of all intelligence insights across the organization.",
    replacesModules: "Does it replace other intelligence modules?",
    replacesModulesAnswer: "No. It aggregates information from intelligence modules while preserving each module's detailed capabilities.",
    whoShouldUse: "Who should use this module?",
    whoShouldUseAnswer: "Owners, executives and authorized leaders responsible for organizational planning and decision-making.",
  },
};

for (const locale of ["en","no","sv","da","es","pl","uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.intelligenceCommandCenter = "Intelligence Command Center";
  data.portalStructure.intelligenceCommandCenter = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
