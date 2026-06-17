#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Cross-Functional Intelligence",
  subtitle: "Understand how departments, teams and business functions influence one another across your organization.",
  loading: "Aipify is analyzing organizational relationships...",
  principle: "Cross-functional insights are advisory — Aipify identifies patterns; leadership decides how to act.",
  advisoryNote: "All cross-functional insights are advisory. Final decisions remain with leadership.",
  emptyTitle: "No cross-functional intelligence insights are available yet.",
  emptyBody: "Aipify helps organizations understand how teams work together and where improvements may create value.",
  emptyCta: "Begin Collaboration Review",
  accessDenied: "Cross-Functional Intelligence access requires owner authorization or explicit grant.",
  filters: {
    search: "Search departments, teams, dependencies...",
    department: "Department",
    team: "Team",
    dependencyType: "Dependency type",
    riskLevel: "Risk level",
    priority: "Priority",
    reviewStatus: "Review status",
    all: "All",
  },
  dashboard: {
    healthScore: "Cross-Functional Health Score",
    collaborationScore: "Department Collaboration Score",
    dependencyScore: "Dependency Score",
    processAlignmentScore: "Process Alignment Score",
    executiveSummary: "Executive Summary",
    areasRequiringAttention: "Areas Requiring Attention",
    improvementOpportunities: "Improvement Opportunities",
    dependencyMap: "Dependency Map",
    collaborationInsights: "Collaboration Insights",
    frictionView: "Organizational Friction",
    heatmap: "Collaboration Heatmap",
    recommendations: "Recommended Actions",
    timeline: "Timeline",
    reviewQuestions: "Cross-Functional Questions",
    beginReview: "Begin collaboration review",
  },
  dependency: {
    from: "From",
    to: "To",
    type: "Dependency type",
    strength: "Strength",
    riskLevel: "Risk level",
    owner: "Owner",
    recommendedReview: "Recommended review",
  },
  collaboration: {
    departments: "Departments",
    category: "Category",
    type: "Collaboration type",
    healthStatus: "Health",
    opportunity: "Improvement opportunity",
    priority: "Priority",
  },
  friction: {
    type: "Friction type",
    severity: "Severity",
    affectedDepartments: "Affected departments",
    recommendedAction: "Recommended action",
    status: "Status",
  },
  heatmapLegend: {
    healthy: "Healthy",
    stable: "Stable",
    needsAttention: "Needs attention",
    highPriority: "High priority",
  },
  detail: {
    reviewNotes: "Review notes (optional)",
    submitReview: "Record review",
    reviewSuccess: "Review recorded successfully.",
    advisoryNote: "Cross-functional insights are advisory — leadership decides how to act.",
  },
  beginReview: { success: "Collaboration review initiated — insights remain advisory." },
  categories: {
    leadershipCollaboration: "Leadership Collaboration",
    operationsAlignment: "Operations Alignment",
    customerJourneyAlignment: "Customer Journey Alignment",
    salesSupportAlignment: "Sales & Support Alignment",
    productCustomerAlignment: "Product & Customer Alignment",
    workforceCollaboration: "Workforce Collaboration",
    knowledgeSharing: "Knowledge Sharing",
    processCoordination: "Process Coordination",
    communicationEfficiency: "Communication Efficiency",
    organizationalDependencies: "Organizational Dependencies",
  },
  dependencyTypes: {
    operational: "Operational", informational: "Informational", approval: "Approval",
    resource: "Resource", knowledge: "Knowledge", process: "Process", communication: "Communication",
  },
  dependencyStrengths: { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  riskLevels: { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  collaborationTypes: { strong: "Strong", emerging: "Emerging", weak: "Weak", gap: "Gap" },
  healthStatuses: { healthy: "Healthy", stable: "Stable", needsAttention: "Needs attention", highPriority: "High priority" },
  frictionTypes: {
    bottleneck: "Bottleneck", delayedWorkflow: "Delayed workflow",
    repeatedEscalation: "Repeated escalation", duplicateEffort: "Duplicate effort",
    knowledgeSilo: "Knowledge silo", coordinationChallenge: "Coordination challenge",
  },
  frictionSeverities: { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  priorities: { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  reviewStatuses: { pending: "Pending", inReview: "In review", reviewed: "Reviewed", needsFollowUp: "Needs follow-up" },
  recommendations: {
    improveInformationSharing: "Improve information sharing across teams",
    clarifyOwnershipResponsibilities: "Clarify ownership responsibilities",
    establishCrossFunctionalReviews: "Establish cross-functional reviews",
    reduceProcessDuplication: "Reduce process duplication",
    improveCommunicationChannels: "Improve communication channels",
    strengthenCollaborationRoutines: "Strengthen collaboration routines",
  },
  timelineEvents: {
    cfiInitialized: "Cross-functional intelligence workspace initialized",
    collaborationReviewBegun: "Collaboration review begun",
    reviewCompleted: "Review completed",
    dependencyChange: "Dependency change recorded",
    improvementLaunched: "Improvement initiative launched",
    lessonLearned: "Lesson learned captured",
  },
  reviewQuestions: {
    teamsDependOn: "Which teams depend on one another?",
    whereDelaysOriginate: "Where do delays originate?",
    crossDeptProcesses: "Which processes cross multiple departments?",
    communicationGaps: "What communication gaps exist?",
    shouldCollaborateMore: "Which departments should collaborate more closely?",
    dependenciesCreateRisk: "What organizational dependencies create risk?",
  },
  faq: {
    title: "Cross-Functional Intelligence FAQ",
    whatIs: "What is Cross-Functional Intelligence?",
    whatIsAnswer: "Cross-Functional Intelligence helps organizations understand relationships, dependencies and collaboration patterns between teams and departments.",
    whyImportant: "Why is this important?",
    whyImportantAnswer: "Many business outcomes depend on effective collaboration across departments rather than the performance of a single team.",
    whoShouldUse: "Who should use this module?",
    whoShouldUseAnswer: "Owners, executives and authorized leaders responsible for organizational effectiveness and performance.",
  },
};

for (const locale of ["en","no","sv","da","es","pl","uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.crossFunctionalIntelligence = "Cross-Functional Intelligence";
  data.portalStructure.crossFunctionalIntelligence = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
