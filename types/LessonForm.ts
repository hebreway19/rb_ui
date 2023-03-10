import {LessonFormState} from "./LessonFormState";
import {Lesson} from "./Lesson";

export type LessonForm = {
  downloadLessonPdf;
  updatedField;
  setUpdatedField;
  lesson: Lesson;
  savedLesson;
  setLesson;
  formState: LessonFormState;
  setFormState,
  saveLesson;
  removeLesson;
  switchTurnExercise;
  handleLessonChange;
  changePageState;
  isPageStateEqualToTarget;
  addTextTask;
  removeTask;
  removeContentFromTask;
  updateFormStateField;
  shareLessonWithTeachers;
  shareLessonWithStudents;
  createCopyFromLesson;
  form;
  isValid;
  addTask;
  addParagraph;
  addExercise;
  addExerciseContent;
  moveParagraphDown;
  moveParagraphUp;
  removeParagraph;
  removeExercise;
  getUnselectedTasksTypes;
  getLessonFormFieldLabel;
  getLessonFormFieldTooltip;
  getLessonFormFieldPlaceholder;
  getExerciseByTaskIndexAndExerciseType;
  getExerciseIndexByTaskIndexAndExerciseType;
  getExerciseIndexByTaskIndexAndExerciseTypeFromSavedLesson;
  updateExerciseByTaskIndexAndExerciseType;
  createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType;
};