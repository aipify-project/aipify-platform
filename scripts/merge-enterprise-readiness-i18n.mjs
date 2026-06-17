#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Enterprise Readiness",
  subtitle: "Evaluate, monitor and improve your readiness for growth, scaling, compliance and enterprise-level operations.",
  loading: "Aipify is evaluating organizational readiness...",
  principle: "Readiness scores are guidance tools — final decisions and preparation strategies remain with leadership.",
  advisoryNote: "Readiness assessments are advisory and do not constitute formal certification.",
  emptyTitle: "No readiness assessments have been completed yet.",
  emptyBody: "Aipify helps organizations prepare for sustainable growth and enterprise-level operations.",
  emptyCta: "Start Readiness Assessment",
  accessDenied: "Enterprise Readiness access requires owner authorization or explicit grant.",
  filters: {
    search: "Search assessments, categories...",
    category: "Category",
    readinessLevel: "Readiness level",
    priority: "Priority",
    department: "Department",
    owner: "Executive owner",
    reviewStatus: "Review status",
    all: "All",
  },
  dashboard: {
    readinessScore: "Enterprise Readiness Score",
    overallLevel: "Overall Readiness Level",
    executiveSummary: "Executive Summary",
    operationalReadiness: "Operational Readiness",
    leadershipReadiness: "Leadership Readiness",
    workforceReadiness: "Workforce Readiness",
    technologyReadiness: "Technology Readiness",
    securityReadiness: "Security Readiness",
    complianceReadiness: "Compliance Readiness",
    growthReadiness: "Growth Readiness",
    identifiedGaps: "Identified Gaps",
    allAssessments: "All Readiness Assessments",
    recommendations: "Recommended Actions",
    timeline: "Readiness Timeline",
    reviewQuestions: "Readiness Review Questions",
    viewAssessment: "View assessment details",
    startAssessment: "Start readiness assessment",
  },
  scorecard: {
    currentScore: "Current score",
    targetScore: "Target score",
    trend: "Trend",
    priority: "Priority",
    owner: "Executive owner",
    reviewDate: "Review date",
    department: "Department",
    recommendedAction: "Recommended action",
  },
  gap: {
    impactLevel: "Impact level",
    recommendedAction: "Recommended action",
    suggestedOwner: "Suggested owner",
    reviewTimeline: "Review timeline",
    status: "Status",
  },
  detail: {
    back: "Back to Enterprise Readiness",
    scorecard: "Readiness Scorecard",
    reviewHistory: "Review history",
    reviewNotes: "Review notes (optional)",
    newScore: "Updated score (0–100, optional)",
    submitReview: "Record assessment review",
    reviewSuccess: "Readiness review recorded successfully.",
    advisoryNote: "Readiness scores are guidance tools, not formal certifications.",
  },
  startAssessment: {
    success: "Readiness assessment initiated — scores are guidance tools, not certifications.",
    governanceNote: "Recommendations remain advisory — leadership defines improvement priorities.",
  },
  categories: {
    leadership: "Leadership",
    governance: "Governance",
    operations: "Operations",
    security: "Security",
    compliance: "Compliance",
    workforce: "Workforce",
    technology: "Technology",
    customerSuccess: "Customer Success",
    knowledgeManagement: "Knowledge Management",
    businessContinuity: "Business Continuity",
    vendorManagement: "Vendor Management",
    riskManagement: "Risk Management",
  },
  readinessLevels: {
    emerging: "Emerging",
    developing: "Developing",
    established: "Established",
    advanced: "Advanced",
    enterpriseReady: "Enterprise Ready",
  },
  trends: { improving: "Improving", stable: "Stable", declining: "Declining" },
  priorities: { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  reviewStatuses: {
    pending: "Pending",
    inReview: "In review",
    reviewed: "Reviewed",
    needsFollowUp: "Needs follow-up",
  },
  gapStatuses: { identified: "Identified", inProgress: "In progress", resolved: "Resolved", accepted: "Accepted" },
  impactLevels: { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  recommendations: {
    reviewSecurityControls: "Review security controls before scaling",
    strengthenGovernanceProcesses: "Strengthen governance processes",
    improveDocumentation: "Improve operational documentation",
    expandLeadershipPlanning: "Expand leadership planning",
    increaseWorkforceReadiness: "Increase workforce readiness",
    improveOperationalConsistency: "Improve operational consistency",
  },
  timelineEvents: {
    readinessInitialized: "Readiness workspace initialized",
    assessmentStarted: "Readiness assessment started",
    reviewCompleted: "Readiness review completed",
    gapIdentified: "Gap identified",
    improvementPlanCreated: "Improvement plan created",
    readinessMilestone: "Readiness milestone reached",
    actionCompleted: "Action completed",
  },
  reviewQuestions: {
    systemsScalable: "Are current systems scalable?",
    leadershipSupport: "Can leadership support growth?",
    processesDocumented: "Are operational processes documented?",
    complianceUnderstood: "Are compliance obligations understood?",
    workforceSufficient: "Is workforce capacity sufficient?",
    risksManaged: "Are risks actively managed?",
    knowledgeRetained: "Is knowledge retained effectively?",
  },
  faq: {
    title: "Enterprise Readiness FAQ",
    whatIs: "What is Enterprise Readiness?",
    whatIsAnswer: "Enterprise Readiness helps organizations understand how prepared they are for growth, complexity and long-term operational success.",
    certifies: "Does Enterprise Readiness certify my company?",
    certifiesAnswer: "No. It provides structured assessments and recommendations but does not serve as a formal certification.",
    whoShouldUse: "Who should use this module?",
    whoShouldUseAnswer: "Owners, executives and authorized leaders responsible for organizational development and growth planning.",
  },
};

for (const locale of ["en","no","sv","da","es","pl","uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure = data.portalStructure ?? {};
  data.portalStructure.nav = data.portalStructure.nav ?? {};
  data.portalStructure.nav.enterpriseReadiness = "Enterprise Readiness";
  data.portalStructure.enterpriseReadiness = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
