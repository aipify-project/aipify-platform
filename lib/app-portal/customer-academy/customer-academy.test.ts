import assert from "node:assert/strict";
import { parseAcademyOverview, isCourseDisplayState } from "./parse";
import {
  computeOverviewMetrics,
  continueLearningCourses,
  coursesForSection,
  dedupeCourses,
  mergeCourseCatalog,
  recommendedCoursesWithContext,
  resolveCourseState,
  sortCourses,
  certificationProgress,
  teamHasAssignments,
  isValidSortOption,
  mapCertificationWorkflowState,
  knowledgeResources,
} from "./presentation";
import { CUSTOMER_ACADEMY_SUPPORT_HREF, resolveCourseHref, CERTIFICATION_REQUIRED_COURSES } from "./config";

const courseA = {
  slug: "welcome_to_aipify",
  title: "Welcome",
  section: "getting_started",
  category: "getting_started",
  difficulty: "beginner",
  duration_minutes: 10,
  content_type: "course",
  description: "Intro",
};

const courseB = {
  slug: "dashboard_essentials",
  title: "Dashboard",
  section: "product_training",
  category: "product_training",
  difficulty: "beginner",
  duration_minutes: 15,
  content_type: "course",
  description: "Dash",
  completed: true,
};

// 1. Parser handles null.
assert.equal(parseAcademyOverview(null).found, false);

// 2. dedupeCourses keeps one per slug.
assert.equal(dedupeCourses([courseA, { ...courseA, title: "Dup" }]).length, 1);

// 3. resolveCourseState not_started default.
assert.equal(resolveCourseState(courseA), "not_started");

// 4. resolveCourseState completed.
assert.equal(resolveCourseState({ ...courseA, completed: true }), "completed");

// 5. resolveCourseState in_progress from assignment.
assert.equal(
  resolveCourseState(courseA, {
    id: "1",
    course_slug: "welcome_to_aipify",
    course_title: "Welcome",
    section: "getting_started",
    required: true,
    status: "in_progress",
  }),
  "in_progress"
);

// 6. resolveCourseState overdue.
assert.equal(
  resolveCourseState(courseA, {
    id: "1",
    course_slug: "welcome_to_aipify",
    course_title: "Welcome",
    section: "getting_started",
    required: true,
    status: "overdue",
  }),
  "overdue"
);

// 7. mergeCourseCatalog dedupes recommended into catalog.
const merged = mergeCourseCatalog([courseA], [courseA], []);
assert.equal(merged.length, 1);
assert.ok(merged[0].href);

// 8. computeOverviewMetrics counts available/completed.
const metrics = computeOverviewMetrics(
  { courses_total: 2, courses_completed: 1, courses_started: 1, completion_percent: 50, outstanding_assignments: 0 },
  [courseA, courseB],
  []
);
assert.equal(metrics.available, 2);
assert.equal(metrics.completed, 1);

// 9. continueLearningCourses filters in_progress only.
const continueList = continueLearningCourses(
  [courseA, courseB],
  [{ id: "1", course_slug: "welcome_to_aipify", course_title: "W", section: "getting_started", required: true, status: "in_progress" }]
);
assert.equal(continueList.length, 1);
assert.equal(continueList[0].slug, "welcome_to_aipify");

// 10. coursesForSection excludes slugs in exclude set.
const section = coursesForSection([courseA, courseB], "getting_started", new Set(["welcome_to_aipify"]));
assert.equal(section.length, 0);

// 11. recommendedCoursesWithContext adds reason.
const rec = recommendedCoursesWithContext([courseA], [courseA]);
assert.equal(rec[0].presentation_context, "recommended");
assert.ok(rec[0].reason_key);

// 12. sortCourses by title.
const sorted = sortCourses([courseB, courseA], "title");
assert.equal(sorted[0].slug, "dashboard_essentials");

// 13. sortCourses by duration.
assert.equal(sortCourses([courseB, courseA], "duration")[0].slug, "welcome_to_aipify");

// 14. certificationProgress earned is 100%.
assert.equal(certificationProgress({ status: "earned", title: "T", certification_type: "x" }, 3, 1), 100);

// 15. certificationProgress partial.
assert.equal(certificationProgress({ status: "in_progress", title: "T", certification_type: "x" }, 4, 2), 50);

// 16. teamHasAssignments false when no assignments.
assert.equal(teamHasAssignments({ available: 5, assigned: 0, started: 0, in_progress: 0, completed: 0, overdue: 0, completion_percent: 0, outstanding_assignments: 0 }, 0), false);

// 17. teamHasAssignments true when assigned > 0.
assert.equal(teamHasAssignments({ available: 5, assigned: 2, started: 2, in_progress: 1, completed: 0, overdue: 0, completion_percent: 0, outstanding_assignments: 2 }, 0), true);

// 18. isValidSortOption guards sort values.
assert.equal(isValidSortOption("title"), true);
assert.equal(isValidSortOption("invalid"), false);

// 19. mapCertificationWorkflowState maps earned to completed semantic.
assert.equal(mapCertificationWorkflowState("earned"), "completed");

// 20. knowledgeResources filters knowledge_center section.
const kc = { ...courseA, section: "knowledge_center", content_type: "faq" };
assert.equal(knowledgeResources([kc]).length, 1);

// 21. resolveCourseHref builds academy query.
assert.match(resolveCourseHref("welcome_to_aipify"), /course=welcome_to_aipify/);

// 22. Support href canonical.
assert.equal(CUSTOMER_ACADEMY_SUPPORT_HREF, "/app/support/history");

// 23. CERTIFICATION_REQUIRED_COURSES has all types.
assert.ok(CERTIFICATION_REQUIRED_COURSES.aipify_certified_user.length >= 3);

// 24. isCourseDisplayState type guard.
assert.equal(isCourseDisplayState("in_progress"), true);
assert.equal(isCourseDisplayState("raw_enum"), false);

console.log("customer-academy.test.ts: 24 scenarios passed");
