export type ReadinessStatus =
  | "ready"
  | "mostly_ready"
  | "partially_ready"
  | "not_ready"
  | "critical_concerns";

export type TransformationCategoryKey =
  | "digital_transformation"
  | "organizational_restructuring"
  | "process_transformation"
  | "technology_adoption"
  | "cultural_transformation"
  | "compliance_transformation"
  | "customer_experience_transformation"
  | "strategic_pivot_initiatives"
  | "growth_transformation"
  | "operational_excellence_programs";

export type TransformationChangeMode =
  | "dashboard"
  | "categories"
  | "readiness"
  | "adoption"
  | "resistance"
  | "briefing"
  | "stakeholders"
  | "communication"
  | "training"
  | "milestones"
  | "learning"
  | "reflection";

export type ReadinessDimension = { score: number; status: ReadinessStatus };

export type TransformationProgram = {
  id: string;
  title: string;
  category: string;
  status: string;
  health: string;
  adoption_progress: number;
  sponsorship_status: string;
  milestones_achieved: number;
  created_at?: string;
};

export type ResistanceSignal = {
  signal: string;
  severity: string;
  supportive_note: string;
};

export type EnterpriseTransformationChangeCenter = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  transformation_dashboard?: {
    active_programs: number;
    health_status: string;
    health_score: number;
    adoption_progress: number;
    change_readiness_score: number;
    change_readiness_status: ReadinessStatus;
    resistance_signals_count: number;
    milestones_achieved: number;
    executive_sponsorship_status: string;
    active_programs_list: TransformationProgram[];
  };
  transformation_categories?: Array<{ key: TransformationCategoryKey; count: number }>;
  change_readiness?: {
    overall_score: number;
    overall_status: ReadinessStatus;
    leadership_alignment: ReadinessDimension;
    employee_understanding: ReadinessDimension;
    communication_effectiveness: ReadinessDimension;
    resource_availability: ReadinessDimension;
    training_readiness: ReadinessDimension;
    governance_readiness: ReadinessDimension;
  };
  adoption_intelligence?: {
    training_participation: number;
    process_adoption_rate: number;
    usage_pattern: string;
    support_requests: number;
    feedback_trend: string;
    department_adoption_notes: string;
    department_differences: Array<{ area: string; adoption: number }>;
  };
  resistance_monitoring?: ResistanceSignal[];
  executive_briefing?: {
    current_status: string;
    achievements: string[];
    emerging_risks: string[];
    adoption_trends: string;
    recommended_interventions: string[];
    priority_focus: string[];
    confidence_score: number;
    confidence_level: string;
    disclaimer: string;
  };
  stakeholder_mapping?: {
    executive_sponsors: string[];
    transformation_leaders: string[];
    department_champions: string[];
    subject_matter_experts: string[];
    impacted_teams: string[];
    communication_owners: string[];
  };
  communication_intelligence?: {
    frequency: string;
    reach_indicator: number;
    acknowledgement_rate: number;
    understanding_indicator: number;
    missed_audiences: string[];
    recommended_actions: string[];
  };
  training_enablement?: {
    completion_rate: number;
    knowledge_gaps: string[];
    department_readiness: ReadinessStatus;
    follow_up_recommendations: string[];
    learning_pathways: string[];
  };
  milestones?: {
    planned: Array<{ title: string; status: string; due?: string }>;
    completed: Array<{ title: string; completed_at?: string }>;
    delayed: Array<{ title: string; reason: string }>;
    blocked: Array<{ title: string; reason: string }>;
    executive_review: Array<{ title: string; risk_level: string }>;
  };
  learning_insights?: Record<string, string>;
  reflection_prompts?: Array<{ prompt: string; guidance: string }>;
  principle?: string;
};

export type EnterpriseTransformationChangeLabels = {
  title: string;
  subtitle: string;
  loading: string;
  humanOversight: string;
  principle: string;
  executiveLink: string;
  cockpitLink: string;
  earlyWarningLink: string;
  portfolioLink: string;
  generateBriefing: string;
  recorded: string;
  tabs: Record<TransformationChangeMode, string>;
  dashboard: {
    title: string;
    activePrograms: string;
    healthStatus: string;
    adoptionProgress: string;
    readiness: string;
    resistanceSignals: string;
    milestonesAchieved: string;
    sponsorship: string;
    programs: string;
  };
  categories: { title: string };
  categoryLabels: Record<TransformationCategoryKey, string>;
  readiness: {
    title: string;
    overall: string;
    leadershipAlignment: string;
    employeeUnderstanding: string;
    communicationEffectiveness: string;
    resourceAvailability: string;
    trainingReadiness: string;
    governanceReadiness: string;
    statuses: Record<ReadinessStatus, string>;
  };
  adoption: {
    title: string;
    trainingParticipation: string;
    processAdoption: string;
    usagePattern: string;
    supportRequests: string;
    feedbackTrend: string;
    departmentNotes: string;
    departmentDifferences: string;
  };
  resistance: {
    title: string;
    supportiveNote: string;
    severity: string;
    empty: string;
  };
  resistanceSignals: Record<string, string>;
  briefing: {
    title: string;
    status: string;
    achievements: string;
    risks: string;
    adoptionTrends: string;
    interventions: string;
    priorityFocus: string;
    confidence: string;
    disclaimer: string;
  };
  stakeholders: {
    title: string;
    executiveSponsors: string;
    transformationLeaders: string;
    departmentChampions: string;
    subjectMatterExperts: string;
    impactedTeams: string;
    communicationOwners: string;
  };
  communication: {
    title: string;
    frequency: string;
    reach: string;
    acknowledgement: string;
    understanding: string;
    missedAudiences: string;
    recommendedActions: string;
  };
  training: {
    title: string;
    completionRate: string;
    knowledgeGaps: string;
    departmentReadiness: string;
    followUp: string;
    learningPathways: string;
  };
  milestones: {
    title: string;
    planned: string;
    completed: string;
    delayed: string;
    blocked: string;
    executiveReview: string;
  };
  learning: { title: string };
  reflection: { title: string; guidance: string };
  faq: {
    title: string;
    whatIsTransformation: string;
    whatIsTransformationAnswer: string;
    whyFail: string;
    whyFailAnswer: string;
    howSupport: string;
    howSupportAnswer: string;
    autoManage: string;
    autoManageAnswer: string;
    respondResistance: string;
    respondResistanceAnswer: string;
    readinessAssessments: string;
    readinessAssessmentsAnswer: string;
  };
  upgradeTitle: string;
  upgradeBody: string;
  upgradeCta: string;
};
