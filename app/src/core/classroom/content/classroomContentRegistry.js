import OG_1_1_18_CLASSROOM_CONTENT from "./OG_1_1_18.js";

import { curriculumContentRegistry } from "./curriculumContent.js";

export const classroomContentRegistry = {
  ...curriculumContentRegistry,
  [OG_1_1_18_CLASSROOM_CONTENT.standardId]: OG_1_1_18_CLASSROOM_CONTENT,
};

export function getClassroomContentByStandardId(standardId) {
  return classroomContentRegistry[standardId] || null;
}

export const DEFAULT_CLASSROOM_STANDARD_ID = "OG.1.1.18";
