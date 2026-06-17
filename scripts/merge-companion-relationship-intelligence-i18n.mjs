#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Relationship Intelligence",
  subtitle: "Strengthen and maintain important business relationships — advisory insights, human connection first.",
  loading: "Aipify is reviewing relationship activity...",
  principle: "People first. Relationships matter. Aipify assists — never replaces human connection.",
  privacyNote: "Relationship intelligence is advisory only. Humans remain responsible for relationship management.",
  emptyTitle: "No relationship insights are available yet.",
  emptyBody: "Aipify helps organizations build stronger and more consistent professional relationships.",
  emptyCta: "Add Relationships",
  accessDenied: "Relationship intelligence access requires an active organization membership.",
  filters: {
    search: "Search relationships...",
    relationshipType: "Relationship type",
    healthLevel: "Health level",
    engagementLevel: "Engagement level",
    owner: "Owner",
    department: "Department",
    all: "All",
  },
  sections: {
    strategicRelationships: "Strategic Relationships",
    needsAttention: "Relationships Requiring Attention",
    recentInteractions: "Recent Interactions",
    upcomingActivities: "Upcoming Relationship Activities",
    engagementTrends: "Engagement Trends",
    opportunities: "Relationship Opportunities",
    reminders: "Relationship Reminders",
    recognitionCenter: "Recognition Center",
    timeline: "Relationship Timeline",
    usageExamples: "Companion Relationship Examples",
    allRelationships: "All Relationships",
  },
  dashboard: {
    healthScore: "Relationship Health Score",
    strategicRelationships: "Strategic Relationships",
    needsAttention: "Requires Attention",
    recentInteractions: "Recent Interactions",
    upcomingActivities: "Upcoming Activities",
    engagementTrends: "High Engagement",
  },
  card: {
    organization: "Organization",
    role: "Role",
    lastInteraction: "Last interaction",
    health: "Relationship health",
    engagement: "Engagement level",
    recommendedAction: "Recommended action",
    insight: "Insight",
    owner: "Owner",
  },
  actions: {
    addRelationships: "Add Relationships",
    addNote: "Add Note",
    viewProfile: "View Profile",
  },
  relationshipTypes: {
    customers: "Customers",
    prospects: "Prospects",
    partners: "Partners",
    vendors: "Vendors",
    employees: "Employees",
    executives: "Executives",
    advisors: "Advisors",
    investors: "Investors",
    growthPartners: "Growth Partners",
    strategicContacts: "Strategic Contacts",
  },
  healthLevels: {
    excellent: "Excellent",
    healthy: "Healthy",
    stable: "Stable",
    needsAttention: "Needs Attention",
    atRisk: "At Risk",
  },
  engagementLevels: {
    high: "High",
    moderate: "Moderate",
    low: "Low",
    inactive: "Inactive",
  },
  opportunityTypes: {
    reconnect: "Reconnect",
    partnership: "Partnership",
    customerExpansion: "Customer Expansion",
    retention: "Retention",
    recognition: "Recognition",
  },
  reminderTypes: {
    birthday: "Birthday",
    workAnniversary: "Work Anniversary",
    customerAnniversary: "Customer Anniversary",
    contractRenewal: "Contract Renewal",
    quarterlyReview: "Quarterly Review",
    relationshipCheckIn: "Relationship Check-In",
    partnershipReview: "Partnership Review",
    milestone: "Milestone",
  },
  recognitionTypes: {
    employee: "Employee Recognition",
    partner: "Partner Recognition",
    customer: "Customer Appreciation",
  },
  recommendedActions: {
    scheduleCheckIn: "Schedule check-in",
    reconnect: "Reconnect",
    recognize: "Recognize",
    followUp: "Follow up",
    partnershipReview: "Partnership review",
  },
  faq: {
    title: "Relationship Intelligence FAQ",
    whatIs: "What is Relationship Intelligence?",
    whatIsAnswer: "Relationship Intelligence helps organizations maintain and strengthen important professional relationships.",
    autoManage: "Can Aipify manage relationships automatically?",
    autoManageAnswer: "No. Aipify provides insights, reminders and recommendations while humans remain responsible for relationship management.",
    whyImportant: "Why is relationship health important?",
    whyImportantAnswer: "Strong relationships improve customer retention, partnerships, employee engagement and long-term business success.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionRelationshipIntelligenceEngine = "Relationship Intelligence";
  data.companionRelationshipIntelligence = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
