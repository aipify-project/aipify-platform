#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const block = {
  title: "Companion Personalization Engine",
  subtitle: "Adapt communication, briefings and assistance to your preferred way of working — with organizational governance preserved.",
  loading: "Aipify is adapting to your preferred working style...",
  principle: "Adapt to the user. Preserve trust. Aipify identity remains consistent — personalization adjusts style, not core values.",
  privacyNote: "Personalization changes presentation and interaction style, not permissions or security controls.",
  emptyTitle: "No personalization preferences have been configured yet.",
  emptyBody: "Aipify can adapt to your preferred way of working while maintaining organizational standards.",
  emptyCta: "Configure Preferences",
  accessDenied: "Personalization access requires an active organization membership.",
  filters: {
    search: "Search preferences...",
    category: "Preference type",
    source: "Source",
    confidence: "Confidence",
    status: "Status",
    all: "All",
  },
  dashboard: {
    personalizationScore: "Personalization Score",
    activePreferences: "Active Preferences",
    communicationProfile: "Communication Profile",
    briefingStyle: "Briefing Style",
    notificationStyle: "Notification Style",
    adaptationLevel: "Companion Adaptation Level",
    reviewCenter: "Personalization Review Center",
    insights: "Personalization Insights",
    timeline: "Personalization Timeline",
    usageExamples: "Companion Personalization Examples",
    reset: "Reset to Defaults",
    save: "Save Preferences",
  },
  review: {
    preference: "Preference",
    source: "Source",
    confidence: "Confidence",
    lastUpdated: "Last Updated",
    status: "Status",
    approve: "Approve",
    reject: "Reject",
    edit: "Edit",
    reset: "Reset",
  },
  profile: {
    communicationStyles: "Communication Styles",
    briefingStyle: "Briefing Style",
    notificationStyle: "Notification Style",
    companionPersonality: "Companion Personality",
    adaptationLevel: "Adaptation Level",
    preferredLanguage: "Preferred Language",
    learningPreference: "Learning Preference",
    notifyChannels: "Notification Channels",
  },
  communicationStyles: {
    executive: "Executive",
    professional: "Professional",
    detailed: "Detailed",
    concise: "Concise",
    friendly: "Friendly",
    analytical: "Analytical",
    balanced: "Balanced",
  },
  briefingStyles: {
    ultraShort: "Ultra Short",
    summary: "Summary",
    standard: "Standard",
    detailed: "Detailed",
    executiveReport: "Executive Report",
  },
  notificationStyles: {
    minimal: "Minimal",
    balanced: "Balanced",
    active: "Active",
    highAwareness: "High Awareness",
  },
  personalities: {
    professional: "Professional",
    supportive: "Supportive",
    executive: "Executive",
    analytical: "Analytical",
    coach: "Coach",
    balanced: "Balanced",
  },
  adaptationLevels: {
    low: "Low",
    moderate: "Moderate",
    high: "High",
  },
  learningPreferences: {
    guided: "Guided",
    selfService: "Self-Service",
    interactive: "Interactive",
    documentationFirst: "Documentation First",
    videoFirst: "Video First",
  },
  categories: {
    communicationStyle: "Communication Style",
    briefingPreferences: "Briefing Preferences",
    notificationPreferences: "Notification Preferences",
    reportingPreferences: "Reporting Preferences",
    companionPersonality: "Companion Personality",
    workflowPreferences: "Workflow Preferences",
    languagePreferences: "Language Preferences",
    meetingPreferences: "Meeting Preferences",
    learningPreferences: "Learning Preferences",
    productivityPreferences: "Productivity Preferences",
  },
  statuses: {
    suggested: "Suggested",
    approved: "Approved",
    rejected: "Rejected",
    active: "Active",
  },
  confidenceLevels: {
    high: "High",
    medium: "Medium",
    low: "Low",
    unverified: "Unverified",
  },
  faq: {
    title: "Companion Personalization FAQ",
    whatIs: "What is Companion Personalization?",
    whatIsAnswer: "Companion Personalization allows Aipify to adapt communication, briefings and assistance to individual user preferences.",
    control: "Can I control personalization?",
    controlAnswer: "Yes. Users may review, edit or reset personalization settings at any time.",
    security: "Does personalization affect security?",
    securityAnswer: "No. Personalization changes presentation and interaction style, not permissions or security controls.",
  },
};

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.nav = data.nav ?? {};
  data.nav.companionPersonalizationEngine = "Personalization";
  data.companionPersonalizationEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
