#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const scenarioPlanningBlock = {
  title: "Scenario Planning",
  subtitle: "Explore best, expected, and challenging futures — rehearse strategic decisions before committing resources.",
  loading: "Aipify is preparing your scenario planning workspace...",
  principle: "Scenario planning supports thinking ahead — simulations never execute actions or change production systems.",
  isolationNote: "All simulations are isolated planning exercises. Aipify informs; leadership decides.",
  simulationLabLink: "Simulation & Decision Lab",
  emptyTitle: "No scenarios are available yet.",
  emptyBody: "Aipify helps executives explore futures with structured scenario modeling and comparison.",
  emptyCta: "Initialize Scenario Portfolio",
  accessDenied: "Scenario Planning access requires owner authorization or an explicit grant.",
  filters: {
    search: "Search scenarios, assumptions, outcomes...",
    category: "Scenario category",
    scenarioType: "Scenario type",
    planningStatus: "Planning status",
    timeHorizon: "Time horizon",
    organizationalArea: "Organizational area",
    timePeriod: "Time period",
    all: "All",
  },
  dashboard: {
    planningSummary: "Scenario Planning Summary",
    executiveSummary: "Executive Summary",
    strategicPriorities: "Strategic Scenario Priorities",
    riskScenarios: "Risk & Resilience Scenarios",
    scenarios: "Scenarios",
    comparisons: "Scenario Comparisons",
    recommendations: "Aipify Recommendations",
    timeline: "Planning Timeline",
    viewScenario: "View scenario details",
    runSimulation: "Run simulation",
    compareScenarios: "Compare best / expected / challenging",
    markReviewed: "Mark scenario reviewed",
  },
  card: {
    category: "Category",
    scenarioType: "Type",
    planningStatus: "Status",
    timeHorizon: "Time horizon",
    lastSimulated: "Last simulated",
    assumptions: "Key assumptions",
    variables: "Variables considered",
    projectedOutcomes: "Projected outcomes",
  },
  detail: {
    back: "Back to Scenario Planning",
    simulations: "Simulation results",
    outcomeSummary: "Outcome summary",
    riskNotes: "Risk considerations",
    opportunityNotes: "Opportunity considerations",
    reviewNotes: "Leadership review notes (optional)",
    submitReview: "Record scenario review",
    reviewSuccess: "Scenario review recorded successfully.",
    simulateSuccess: "Simulation completed — results are illustrative only.",
    isolationNote: "Simulation results are illustrative — humans decide whether and how to act.",
  },
  initialize: {
    success: "Scenario portfolio initialized successfully.",
    governanceNote: "Recommendations remain advisory — leadership defines strategic objectives.",
  },
  categories: {
    strategic: "Strategic",
    operational: "Operational",
    capacity: "Capacity",
    market: "Market",
    governance: "Governance",
    risk: "Risk",
  },
  scenarioTypes: {
    bestCase: "Best case",
    expected: "Expected",
    challenging: "Challenging",
    custom: "Custom",
  },
  planningStatuses: {
    draft: "Draft",
    active: "Active",
    simulated: "Simulated",
    reviewed: "Reviewed",
    archived: "Archived",
  },
  timeHorizons: {
    next30Days: "Next 30 days",
    nextQuarter: "Next quarter",
    next6Months: "Next 6 months",
    next12Months: "Next 12 months",
  },
  recommendations: {
    rehearseChallengingScenarios: "Rehearse challenging scenarios with leadership",
    reviewCapacityScenarios: "Review capacity scenarios before peak demand",
    scheduleExecutiveScenarioReview: "Schedule executive scenario review session",
    compareBestExpectedChallenging: "Compare best, expected, and challenging futures",
    crossLinkSimulationLab: "Use Simulation Lab for deeper isolated modeling",
  },
  timelineEvents: {
    scenariosInitialized: "Scenario portfolio initialized",
    scenariosRefreshed: "Scenario catalog refreshed",
    simulationCompleted: "Scenario simulation completed",
    scenariosCompared: "Leadership scenario comparison recorded",
    scenarioReviewed: "Scenario reviewed by leadership",
  },
  faq: {
    title: "Scenario Planning FAQ",
    whatIs: "What is Scenario Planning?",
    whatIsAnswer: "Scenario Planning helps executives explore how different futures may unfold — supporting preparedness without claiming certainty.",
    executesActions: "Do simulations execute actions?",
    executesActionsAnswer: "No. Simulations are isolated planning exercises. They never change production systems or execute operational actions.",
    whoCanAccess: "Who can access Scenario Planning?",
    whoCanAccessAnswer: "Owners and executives have full access. Managers and administrators require explicit grants from the organization owner. Employees do not have access.",
  },
};

const navLabels = {
  en: "Scenario Planning",
  no: "Scenarioplanlegging",
  sv: "Scenarieplanering",
  da: "Scenarieplanlægning",
  es: "Scenario Planning",
  pl: "Scenario Planning",
  uk: "Scenario Planning",
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.scenarioPlanning = navLabels[locale];
  data.portalStructure.scenarioPlanning = scenarioPlanningBlock;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
