#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Organizational Forecasting",
  subtitle: "Understand potential future developments across operations, workforce, customers, revenue, support and organizational capacity.",
  loading: "Aipify is preparing organizational forecasts...",
  principle: "Forecasts support planning and preparedness — final decisions remain with organizational leadership.",
  advisoryNote: "Forecasts are projections, not guarantees. Aipify never claims certainty about future outcomes.",
  emptyTitle: "No forecasting data is available yet.",
  emptyBody: "Aipify helps organizations prepare for future demands and opportunities.",
  emptyCta: "Begin Forecast Review",
  accessDenied: "Organizational Forecasting access requires owner authorization or explicit grant.",
  filters: {
    search: "Search forecasts, descriptions...",
    category: "Forecast category",
    department: "Department",
    timeHorizon: "Time horizon",
    confidenceLevel: "Confidence level",
    executiveOwner: "Executive owner",
    reviewStatus: "Review status",
    all: "All",
  },
  dashboard: {
    forecastScore: "Organizational Forecast Score",
    executiveSummary: "Executive Summary",
    growthForecast: "Growth Forecast",
    capacityForecast: "Capacity Forecast",
    workforceForecast: "Workforce Forecast",
    customerForecast: "Customer Forecast",
    revenueForecast: "Revenue Forecast",
    supportForecast: "Support Forecast",
    improvingTrends: "Improving",
    stableTrends: "Stable",
    decliningTrends: "Declining",
    emergingTrends: "Emerging",
    capacityView: "Organizational Capacity View",
    forecasts: "All Forecasts",
    timeline: "Forecast Timeline",
    reviewQuestions: "Recommended Questions",
    viewForecast: "View forecast details",
    beginReview: "Begin forecast review",
  },
  forecastCard: {
    currentState: "Current state",
    conservative: "Conservative",
    expected: "Expected",
    optimistic: "Optimistic",
    confidence: "Confidence",
    timeHorizon: "Time horizon",
    trend: "Trend",
    owner: "Executive owner",
    recommendedAction: "Recommended action",
  },
  capacityCard: {
    currentCapacity: "Current capacity",
    estimatedFuture: "Estimated future",
    bottlenecks: "Potential bottlenecks",
    constraints: "Constraints",
    requiresAttention: "Requires attention",
  },
  detail: {
    back: "Back to Organizational Forecasting",
    models: "Forecast models",
    reviewHistory: "Review history",
    reviewNotes: "Review notes (optional)",
    submitReview: "Record forecast review",
    reviewSuccess: "Forecast review recorded successfully.",
    advisoryNote: "This forecast is a projection to support planning — not a certainty about future events.",
  },
  beginReview: {
    success: "Forecast review initiated — projections remain advisory only.",
    governanceNote: "Recommendations remain advisory — leadership defines strategic objectives.",
  },
  categories: {
    workforceGrowth: "Workforce Growth",
    customerGrowth: "Customer Growth",
    revenueDevelopment: "Revenue Development",
    supportDemand: "Support Demand",
    operationalCapacity: "Operational Capacity",
    knowledgeGrowth: "Knowledge Growth",
    departmentExpansion: "Department Expansion",
    resourceRequirements: "Resource Requirements",
    trainingRequirements: "Training Requirements",
    organizationalComplexity: "Organizational Complexity",
  },
  confidenceLevels: { low: "Low", moderate: "Moderate", high: "High" },
  trendDirections: {
    improving: "Improving",
    stable: "Stable",
    declining: "Declining",
    emerging: "Emerging",
  },
  reviewStatuses: {
    pending: "Pending",
    inReview: "In review",
    reviewed: "Reviewed",
    needsFollowUp: "Needs follow-up",
  },
  timeHorizons: {
    "30Days": "30 Days", "90Days": "90 Days", "6Months": "6 Months",
    "12Months": "12 Months", "24Months": "24 Months", "36Months": "36 Months",
  },
  timelineEvents: {
    forecastingInitialized: "Forecasting workspace initialized",
    forecastReviewBegun: "Forecast review begun",
    forecastReviewCompleted: "Forecast review completed",
    capacityMilestone: "Capacity milestone reached",
    organizationalEvent: "Organizational event",
    growthMilestone: "Growth milestone",
    strategicPlanningSession: "Strategic planning session",
  },
  reviewQuestions: {
    resourcesSufficient: "Are current resources sufficient?",
    capacityConstraints: "What capacity constraints may emerge?",
    teamsNeedSupport: "Which teams may require support?",
    hiringPlansAligned: "Are hiring plans aligned with growth expectations?",
    systemsRequireScaling: "Which systems require scaling?",
    preparationsToday: "What preparations should begin today?",
  },
  faq: {
    title: "Organizational Forecasting FAQ",
    whatIs: "What is Organizational Forecasting?",
    whatIsAnswer: "Organizational Forecasting helps leadership understand potential future developments based on current trends and observations.",
    guaranteed: "Are forecasts guaranteed?",
    guaranteedAnswer: "No. Forecasts are projections designed to support planning and preparedness, not guarantees of future outcomes.",
    whoShouldUse: "Who should use this module?",
    whoShouldUseAnswer: "Owners, executives and authorized leaders responsible for planning and organizational growth.",
  },
};

for (const locale of ["en","no","sv","da","es","pl","uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.organizationalForecasting = "Organizational Forecasting";
  data.portalStructure.organizationalForecasting = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
