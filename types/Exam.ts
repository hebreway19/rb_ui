import { BaseLesson } from "./BaseLesson";

export type Exam = BaseLesson & {
  isMediaContentVisibleForStudent: boolean;
}