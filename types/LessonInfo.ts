import { BaseLesson, Exam, Lesson, LessonFormState } from ".";
import React from "react";

export type LessonInfo = {
  lesson: Lesson | Exam | BaseLesson;
  formState: LessonFormState;
  setFormState: React.Dispatch<React.SetStateAction<LessonFormState>>

  loadLessonData(): Promise<void>;
  updateFormStateField (fieldName: any, fieldValue: any): void,
  getLessonFormFieldLabel(fieldName: string): string;
  getLessonFormFieldTooltip(fieldName: string): string;
  getLessonFormFieldPlaceholder(fieldName: string): string;
  getExerciseIndexByTaskIndexAndExerciseType(taskIndex: any, exerciseType: any): number;
  downloadStudentTasksAnswersPdf(): Promise<void>;
}