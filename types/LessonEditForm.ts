import {Lesson} from "./Lesson";
import {Exam} from "./Exam";
import {BaseLesson} from "./BaseLesson";
import React from "react";
import {LessonEditFormState} from "./LessonEditFormState";

export type LessonEditForm = {
  lesson: Lesson | Exam | BaseLesson;
  formState: LessonEditFormState;
  setLesson: React.Dispatch<React.SetStateAction<Lesson | Exam | BaseLesson>>;
  setFormState: React.Dispatch<React.SetStateAction<LessonEditFormState>>;
  updatedField: any;
  setUpdatedField: any;
  savedLesson: any;
  saveLesson: any;
  removeLesson: any;
  handleLessonChange: any;
  changePageState: any,
  isPageStateEqualToTarget: any;
  addTextTask: any;
  removeTask: any;
  removeContentFromTask: any;
  updateFormStateField: any;
  createCopyFromLesson: any;
  form: any;
  addParagraph: any;
  addExercise: any;
  addExerciseContent: any;
  moveParagraphDown: any;
  moveParagraphUp: any;
  removeParagraph: any;
  removeExercise: any;
  getUnselectedTasksTypes: any;
  getLessonFormFieldLabel: any;
  getLessonFormFieldTooltip: any;
  getLessonFormFieldPlaceholder: any;
  getExerciseByTaskIndexAndExerciseType: any;
  getExerciseIndexByTaskIndexAndExerciseType: any;
  getExerciseIndexByTaskIndexAndExerciseTypeFromSavedLesson: any;
  updateExerciseByTaskIndexAndExerciseType: any;
  createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType: any;
}