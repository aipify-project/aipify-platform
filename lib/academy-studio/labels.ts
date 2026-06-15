import type { Translator } from "@/lib/i18n/translate";
import {
  AUDIENCES,
  CERTIFICATION_STATUSES,
  COURSE_STATUSES,
  DIFFICULTY_LEVELS,
  LANGUAGES,
  MODULE_TYPES,
  QUESTION_TYPES,
  WORKFLOW_STEPS,
} from "./constants";
import type { AcademyStudioLabels } from "./types";

export function buildAcademyStudioLabels(t: Translator, namespace: string): AcademyStudioLabels {
  const mapKeys = <K extends string>(keys: readonly K[], suffix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${namespace}.${suffix}.${k}`)])) as Record<K, string>;

  return {
    title: t(`${namespace}.title`),
    subtitle: t(`${namespace}.subtitle`),
    loading: t(`${namespace}.loading`),
    back: t(`${namespace}.back`),
    principle: t(`${namespace}.principle`),
    emptyState: t(`${namespace}.emptyState`),
    overview: {
      activeCourses: t(`${namespace}.overview.activeCourses`),
      certifiedUsers: t(`${namespace}.overview.certifiedUsers`),
      expiringCertifications: t(`${namespace}.overview.expiringCertifications`),
      completionRate: t(`${namespace}.overview.completionRate`),
      coursesRequiringReview: t(`${namespace}.overview.coursesRequiringReview`),
      recommendedImprovements: t(`${namespace}.overview.recommendedImprovements`),
    },
    sections: {
      overview: t(`${namespace}.sections.overview`),
      courses: t(`${namespace}.sections.courses`),
      builder: t(`${namespace}.sections.builder`),
      modules: t(`${namespace}.sections.modules`),
      assessments: t(`${namespace}.sections.assessments`),
      analytics: t(`${namespace}.sections.analytics`),
      recommendations: t(`${namespace}.sections.recommendations`),
      audit: t(`${namespace}.sections.audit`),
      workflow: t(`${namespace}.sections.workflow`),
      production: t(`${namespace}.sections.production`),
      exports: t(`${namespace}.sections.exports`),
    },
    table: {
      title: t(`${namespace}.table.title`),
      audience: t(`${namespace}.table.audience`),
      difficulty: t(`${namespace}.table.difficulty`),
      language: t(`${namespace}.table.language`),
      duration: t(`${namespace}.table.duration`),
      status: t(`${namespace}.table.status`),
      threshold: t(`${namespace}.table.threshold`),
      modules: t(`${namespace}.table.modules`),
      actions: t(`${namespace}.table.actions`),
    },
    audiences: mapKeys(AUDIENCES, "audiences"),
    difficulties: mapKeys(DIFFICULTY_LEVELS, "difficulties"),
    moduleTypes: mapKeys(MODULE_TYPES, "moduleTypes"),
    questionTypes: mapKeys(QUESTION_TYPES, "questionTypes"),
    certStatuses: mapKeys(CERTIFICATION_STATUSES, "certStatuses"),
    courseStatuses: mapKeys(COURSE_STATUSES, "courseStatuses"),
    workflowSteps: mapKeys(WORKFLOW_STEPS, "workflowSteps"),
    languages: mapKeys(LANGUAGES, "languages"),
    recommendations: {
      update_outdated: t(`${namespace}.recommendations.updateOutdated`),
      clarify_topics: t(`${namespace}.recommendations.clarifyTopics`),
      new_course: t(`${namespace}.recommendations.newCourse`),
      refresher_training: t(`${namespace}.recommendations.refresherTraining`),
    },
    analytics: {
      completionRate: t(`${namespace}.analytics.completionRate`),
      passRate: t(`${namespace}.analytics.passRate`),
      averageScore: t(`${namespace}.analytics.averageScore`),
      dropOffRate: t(`${namespace}.analytics.dropOffRate`),
      difficultQuestions: t(`${namespace}.analytics.difficultQuestions`),
      retraining: t(`${namespace}.analytics.retraining`),
    },
    quickActions: {
      createCourse: t(`${namespace}.quickActions.createCourse`),
      generateOutline: t(`${namespace}.quickActions.generateOutline`),
      generateMaterials: t(`${namespace}.quickActions.generateMaterials`),
      generateQuiz: t(`${namespace}.quickActions.generateQuiz`),
      publishCourse: t(`${namespace}.quickActions.publishCourse`),
      exportFiverr: t(`${namespace}.quickActions.exportFiverr`),
      startCourse: t(`${namespace}.quickActions.startCourse`),
    },
    workflow: {
      title: t(`${namespace}.workflow.title`),
      step1: t(`${namespace}.workflow.step1`),
      step2: t(`${namespace}.workflow.step2`),
      step3: t(`${namespace}.workflow.step3`),
      step4: t(`${namespace}.workflow.step4`),
      step5: t(`${namespace}.workflow.step5`),
    },
    export: {
      fiverrTitle: t(`${namespace}.export.fiverrTitle`),
      fiverrHint: t(`${namespace}.export.fiverrHint`),
    },
    youDecide: t(`${namespace}.youDecide`),
  };
}
