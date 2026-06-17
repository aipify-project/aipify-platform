#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Strategic Opportunities",
  subtitle: "Identify, evaluate and prioritize opportunities that could positively impact growth, efficiency, innovation and long-term competitiveness.",
  loading: "Aipify is reviewing potential strategic opportunities...",
  principle: "Aipify suggests opportunities but never makes decisions — final decisions remain with leadership.",
  advisoryNote: "All opportunity recommendations are advisory. Aipify never implements opportunities on behalf of the organization.",
  emptyTitle: "No strategic opportunities have been identified yet.",
  emptyBody: "Aipify helps organizations uncover opportunities that support sustainable growth.",
  emptyCta: "Identify Opportunities",
  accessDenied: "Strategic Opportunities access requires owner authorization or explicit grant.",
  filters: {
    search: "Search opportunities, descriptions...",
    category: "Category",
    status: "Status",
    department: "Department",
    strategicPriority: "Strategic priority",
    executiveOwner: "Executive owner",
    timeHorizon: "Time horizon",
    all: "All",
  },
  dashboard: {
    healthScore: "Opportunity Health Score",
    executiveSummary: "Executive Summary",
    highPotential: "High-Potential",
    requiresExploration: "Requires Exploration",
    underReview: "Under Review",
    inProgress: "In Progress",
    realized: "Realized",
    opportunities: "Opportunities",
    recommendations: "Recommended Actions",
    timeline: "Opportunity Timeline",
    reviewQuestions: "Opportunity Review Questions",
    viewOpportunity: "View opportunity details",
    addOpportunity: "Identify new opportunity",
    updateStatus: "Update status",
  },
  card: {
    category: "Category",
    status: "Status",
    strategicPriority: "Strategic priority",
    estimatedImpact: "Estimated impact",
    estimatedComplexity: "Estimated complexity",
    orgReadiness: "Organizational readiness",
    reviewPriority: "Review priority",
    owner: "Executive owner",
    timeHorizon: "Time horizon",
    potentialValue: "Potential value",
    estimatedEffort: "Estimated effort",
  },
  detail: {
    back: "Back to Strategic Opportunities",
    scorecard: "Opportunity Scorecard",
    nextSteps: "Suggested next steps",
    relatedDepartments: "Related departments",
    reviewHistory: "Review history",
    reviewNotes: "Review notes (optional)",
    newStatus: "Update status",
    submitReview: "Record review",
    reviewSuccess: "Opportunity review recorded successfully.",
    advisoryNote: "Opportunity insights support decision-making — humans decide what to pursue.",
  },
  create: {
    titlePlaceholder: "Opportunity title",
    descriptionPlaceholder: "Describe the opportunity...",
    success: "Opportunity identified successfully.",
  },
  categories: {
    revenueGrowth: "Revenue Growth",
    customerExperience: "Customer Experience",
    operationalEfficiency: "Operational Efficiency",
    costOptimization: "Cost Optimization",
    employeeExperience: "Employee Experience",
    marketExpansion: "Market Expansion",
    productInnovation: "Product Innovation",
    strategicPartnerships: "Strategic Partnerships",
    automationOpportunities: "Automation Opportunities",
    knowledgeOpportunities: "Knowledge Opportunities",
    processImprovements: "Process Improvements",
    sustainabilityInitiatives: "Sustainability Initiatives",
  },
  statuses: {
    identified: "Identified",
    underReview: "Under Review",
    approved: "Approved",
    planning: "Planning",
    inProgress: "In Progress",
    completed: "Completed",
    archived: "Archived",
  },
  strategicPriorities: { low: "Low", moderate: "Moderate", high: "High", strategic: "Strategic" },
  estimatedImpacts: { low: "Low", moderate: "Moderate", high: "High", transformational: "Transformational" },
  estimatedComplexities: { low: "Low", moderate: "Moderate", high: "High", veryHigh: "Very High" },
  orgReadiness: { notReady: "Not Ready", low: "Low", moderate: "Moderate", high: "High" },
  reviewPriorities: { low: "Low", normal: "Normal", high: "High", immediate: "Immediate" },
  timeHorizons: {
    "30Days": "30 Days", "90Days": "90 Days", "6Months": "6 Months",
    "12Months": "12 Months", "24Months": "24 Months", "36Months": "36 Months",
  },
  recommendations: {
    scheduleExploratoryWorkshop: "Schedule exploratory workshop",
    assignExecutiveSponsor: "Assign executive sponsor",
    gatherSupportingData: "Gather supporting data",
    initiatePilotProject: "Initiate pilot project",
    conductStakeholderReview: "Conduct stakeholder review",
    monitorFutureDevelopments: "Monitor future developments",
  },
  timelineEvents: {
    opportunitiesInitialized: "Opportunities workspace initialized",
    opportunityIdentified: "Opportunity identified",
    statusUpdated: "Opportunity status updated",
    opportunityReviewed: "Opportunity reviewed",
    opportunityApproved: "Opportunity approved",
    opportunityCompleted: "Opportunity completed",
    lessonCaptured: "Lesson captured",
    valueRealized: "Value realized",
  },
  reviewQuestions: {
    underexplored: "What opportunities are currently underexplored?",
    alignsStrategic: "Which opportunities align with strategic objectives?",
    capabilitiesRequired: "What capabilities are required to pursue this opportunity?",
    stakeholders: "Which stakeholders should be involved?",
    barriers: "What barriers could limit success?",
    rightTime: "Is this the right time to act?",
  },
  faq: {
    title: "Strategic Opportunities FAQ",
    whatAre: "What are Strategic Opportunities?",
    whatAreAnswer: "Strategic Opportunities are areas where organizations may improve performance, create new value or strengthen their long-term position.",
    autoImplement: "Does Aipify automatically implement opportunities?",
    autoImplementAnswer: "No. Aipify provides recommendations and structure. Leadership teams remain responsible for all decisions and actions.",
    whoShouldUse: "Who should use this module?",
    whoShouldUseAnswer: "Owners, executives and authorized leaders responsible for strategic planning and organizational development.",
  },
};

for (const locale of ["en","no","sv","da","es","pl","uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.strategicOpportunities = "Strategic Opportunities";
  data.portalStructure.strategicOpportunities = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
