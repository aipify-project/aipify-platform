#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Executive Companion",
  subtitle: "Unified executive experience — strategic clarity, actionable guidance, Companion Golden Rule enforced.",
  loading: "Aipify is preparing your executive companion briefing...",
  principle: "One place for executive visibility. High signal, low noise. Human decisions remain required.",
  privacyNote: "Aipify provides context and recommendations. Leadership remains responsible for decisions.",
  goldenRule: "Observation → Explanation → Impact → Recommendation → Effort → Value",
  emptyTitle: "Your Executive Companion is ready.",
  emptyBody: "As organizational activity grows, Aipify will provide increasingly valuable executive guidance.",
  emptyCta: "Generate Executive Briefing",
  accessDenied: "Executive Companion access requires owner, executive or authorized leadership role.",
  filters: {
    search: "Search executive companion...",
    workspace: "Workspace view",
    all: "All",
  },
  sections: {
    home: "Executive Home",
    dailyOpening: "Good Morning",
    todaysPriorities: "Today's Priorities",
    sinceLastLogin: "Since Last Login",
    recommendedActions: "Recommended Executive Actions",
    upcomingMeetings: "Upcoming Meetings",
    executiveBriefing: "Executive Briefing",
    strategicFocus: "Strategic Focus Areas",
    actionCenter: "Executive Action Center",
    focusEngine: "Executive Focus",
    relationships: "Relationship Executive View",
    intelligence: "Executive Intelligence",
    decisionSupport: "Executive Decision Support",
    timeline: "Executive Timeline",
    usageExamples: "Executive Companion Examples",
  },
  dashboard: {
    executiveHealthScore: "Executive Health Score",
    organizationalHealthScore: "Organizational Health Score",
    executiveReadinessScore: "Executive Readiness Score",
    todaysPriorities: "Today's Priorities",
    strategicOpportunities: "Strategic Opportunities",
    emergingRisks: "Emerging Risks",
    relationshipInsights: "Relationship Insights",
    executiveSummary: "Executive Summary",
  },
  card: {
    observation: "Observation",
    explanation: "Explanation",
    impact: "Impact",
    recommendation: "Recommendation",
    effort: "Effort",
    potentialValue: "Potential value",
    dueDate: "Due date",
    priority: "Priority",
  },
  actions: {
    generateBriefing: "Generate Executive Briefing",
    viewDetails: "View Details",
  },
  workspaces: {
    personal: "Personal View",
    organization: "Organization View",
    strategic: "Strategic View",
    growth: "Growth View",
    future: "Future View",
  },
  focusAreas: {
    strategic: "Strategic Focus",
    operational: "Operational Focus",
    growth: "Growth Focus",
    workforce: "Workforce Focus",
    customer: "Customer Focus",
  },
  briefingPeriods: {
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
  },
  faq: {
    title: "Executive Companion FAQ",
    whatIs: "What is the Executive Companion?",
    whatIsAnswer: "The Executive Companion helps leaders understand priorities, opportunities, risks and organizational activity from a single workspace.",
    makesDecisions: "Can Aipify make executive decisions?",
    makesDecisionsAnswer: "No. Aipify provides context, recommendations and intelligence. Leadership remains responsible for decisions.",
    whyUse: "Why use Executive Companion?",
    whyUseAnswer: "Executive Companion reduces information overload and helps leaders focus on what matters most.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionExecutiveLayer = "Executive Companion";
  data.companionExecutiveLayer = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
