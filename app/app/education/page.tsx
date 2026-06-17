import { EducationTrainingLearningOperationsPackDashboardPanel } from "@/components/app/education-training-learning-operations-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EducationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.educationTrainingLearningOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    studentsTitle: t(`${p}.studentsTitle`),
    coursesTitle: t(`${p}.coursesTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricStudents: t(`${p}.metricStudents`),
    metricCourses: t(`${p}.metricCourses`),
    metricPrograms: t(`${p}.metricPrograms`),
    metricInstructors: t(`${p}.metricInstructors`),
    metricCompletion: t(`${p}.metricCompletion`),
    metricCertification: t(`${p}.metricCertification`),
    metricOutcomes: t(`${p}.metricOutcomes`),
    metricHealth: t(`${p}.metricHealth`),
    noStudents: t(`${p}.noStudents`),
    noCourses: t(`${p}.noCourses`),
    recommendation: t(`${p}.recommendation`),
    studentNamePlaceholder: t(`${p}.studentNamePlaceholder`),
    statusProspective: t(`${p}.statusProspective`),
    statusEnrolled: t(`${p}.statusEnrolled`),
    statusActive: t(`${p}.statusActive`),
    addStudent: t(`${p}.addStudent`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openStudents: t(`${p}.openStudents`),
    openCourses: t(`${p}.openCourses`),
    openPrograms: t(`${p}.openPrograms`),
    openInstructors: t(`${p}.openInstructors`),
    openAssessments: t(`${p}.openAssessments`),
    openCertifications: t(`${p}.openCertifications`),
    openAcademy: t(`${p}.openAcademy`),
    openExecutive: t(`${p}.openExecutive`),
    academyCrossLink: t(`${p}.academyCrossLink`),
    academyLink: t(`${p}.academyLink`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EducationTrainingLearningOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
