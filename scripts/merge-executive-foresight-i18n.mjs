#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const executiveForesightBlock = {
  title: "Executive Foresight",
  subtitle: "Create space for tomorrow — identify emerging priorities, long-term opportunities and areas requiring strategic attention.",
  loading: "Aipify is preparing your executive foresight briefing...",
  principle: "Executive foresight encourages long-term thinking — final strategic decisions remain with leadership.",
  advisoryNote: "All foresight insights are advisory. Aipify never claims certainty regarding future outcomes.",
  emptyTitle: "No executive foresight insights are available yet.",
  emptyBody: "Aipify helps leadership teams create space for tomorrow while managing today.",
  emptyCta: "Begin Strategic Review",
  accessDenied: "Executive Foresight access requires owner authorization or explicit grant.",
  filters: {
    search: "Search foresight topics, insights, observations...",
    category: "Foresight category",
    timeHorizon: "Time horizon",
    strategicPriority: "Strategic priority",
    organizationalArea: "Organizational area",
    executiveOwner: "Executive owner",
    reviewStatus: "Review status",
    timePeriod: "Time period",
    all: "All",
  },
  dashboard: {
    executiveOutlookScore: "Executive Outlook Score",
    executiveSummary: "Executive Summary",
    emergingOpportunities: "Emerging Opportunities",
    emergingRisks: "Emerging Risks",
    strategicTopicsRequiringAttention: "Strategic Topics Requiring Attention",
    longTermFocusAreas: "Long-Term Focus Areas",
    areasGainingMomentum: "Areas Gaining Momentum",
    areasLosingMomentum: "Areas Losing Momentum",
    recommendedConversations: "Recommended Conversations",
    executiveQuestions: "Executive Questions",
    foresightInsights: "Foresight Insights",
    observations: "Foresight Observations",
    recommendations: "Recommended Executive Actions",
    timeline: "Foresight Timeline",
    longTermPlanning: "Long-Term Planning View",
    viewObservation: "View observation details",
  },
  card: {
    category: "Category",
    insightType: "Insight type",
    strategicPriority: "Strategic priority",
    timeHorizon: "Time horizon",
    executiveOwner: "Executive owner",
    reviewStatus: "Review status",
    momentum: "Momentum",
  },
  detail: {
    back: "Back to Executive Foresight",
    reviews: "Strategic review history",
    notes: "Executive notes",
    reviewNotes: "Review notes (optional)",
    noteText: "Executive note",
    submitReview: "Record foresight review",
    addNote: "Add executive note",
    reviewSuccess: "Foresight review recorded successfully.",
    noteSuccess: "Executive note recorded.",
    advisoryNote: "Foresight insights support preparedness — not certainty about future outcomes.",
  },
  beginReview: {
    success: "Strategic foresight review initiated successfully.",
    governanceNote: "Recommendations remain advisory — leadership defines strategic objectives.",
  },
  categories: {
    organizationalGrowth: "Organizational Growth",
    workforceDevelopment: "Workforce Development",
    customerEvolution: "Customer Evolution",
    technologyTrends: "Technology Trends",
    marketDynamics: "Market Dynamics",
    governanceEvolution: "Governance Evolution",
    competitiveAwareness: "Competitive Awareness",
    operationalResilience: "Operational Resilience",
    strategicInnovation: "Strategic Innovation",
    leadershipDevelopment: "Leadership Development",
  },
  insightTypes: {
    momentumGain: "Momentum gain",
    momentumLoss: "Momentum loss",
    dependency: "Critical dependency",
    opportunity: "Opportunity",
    blindSpot: "Potential blind spot",
    leadershipObservation: "Leadership observation",
  },
  strategicPriorities: {
    low: "Low",
    moderate: "Moderate",
    high: "High",
    strategic: "Strategic",
  },
  timeHorizons: {
    "30Days": "30 Days",
    "90Days": "90 Days",
    "6Months": "6 Months",
    "12Months": "12 Months",
    "24Months": "24 Months",
    "36Months": "36 Months",
  },
  reviewStatuses: {
    pending: "Pending",
    inReview: "In review",
    reviewed: "Reviewed",
    needsFollowUp: "Needs follow-up",
  },
  momentumDirections: {
    gaining: "Gaining momentum",
    stable: "Stable",
    losing: "Losing momentum",
  },
  recommendations: {
    scheduleStrategicReviews: "Schedule strategic reviews",
    expandLeadershipConversations: "Expand leadership conversations",
    strengthenSuccessionPlanning: "Strengthen succession planning",
    reviewEmergingOpportunities: "Review emerging opportunities",
    improveOrganizationalResilience: "Improve organizational resilience",
    monitorEvolvingTrends: "Monitor evolving trends",
  },
  timelineEvents: {
    foresightInitialized: "Foresight workspace initialized",
    strategicReviewBegun: "Strategic review begun",
    foresightReviewCompleted: "Foresight review completed",
    executiveNoteAdded: "Executive note added",
    strategicTopicIdentified: "Strategic topic identified",
    leadershipDiscussionInitiated: "Leadership discussion initiated",
    opportunityExplored: "Opportunity explored",
    preparatoryActionLaunched: "Preparatory action launched",
    lessonCaptured: "Lesson captured",
  },
  faq: {
    title: "Executive Foresight FAQ",
    whatIs: "What is Executive Foresight?",
    whatIsAnswer: "Executive Foresight helps leaders think proactively about opportunities, risks and future organizational needs.",
    predictFuture: "Can Aipify predict the future?",
    predictFutureAnswer: "No. Aipify provides structured insights and prompts to support strategic planning and preparedness.",
    whoShouldUse: "Who should use Executive Foresight?",
    whoShouldUseAnswer: "Executive Foresight is designed for owners, executives and authorized leaders responsible for long-term decision-making.",
  },
};

const navLabels = {
  en: "Executive Foresight",
  no: "Executive Foresight",
  sv: "Executive Foresight",
  da: "Executive Foresight",
  es: "Executive Foresight",
  pl: "Executive Foresight",
  uk: "Executive Foresight",
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.executiveForesight = navLabels[locale];
  data.portalStructure.executiveForesight = executiveForesightBlock;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
