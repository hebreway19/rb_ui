import React from "react";
import { FormInstance } from "antd";
import { Options } from "nodemailer/lib/mailer";

import { StudentTasksAnswers } from "./StudentTasksAnswers";
import { StudentTasksAnswersFormState } from "./StudentTasksAnswersFormState";

export type StudentTasksAnswersForm = {
  studentTasksAnswers: StudentTasksAnswers;
  setStudentTasksAnswers: React.Dispatch<React.SetStateAction<StudentTasksAnswers>>,
  formState: StudentTasksAnswersFormState;
  form: FormInstance;
  changedField;
  setChangedField;
  setFormState;
  saveStudentTasksAnswers;
  handleTaskAnswerChange;
  startStudentTaskAnswer;
  finishStudentTaskAnswer;
  loadStudentTasksAnswersById;
  loadStudentTasksAnswersByLessonAndStudent;
  downloadStudentTasksAnswersPdf;
  getStudentTaskAnswerFormFieldLabel;
  getStudentTaskAnswerFormFieldTooltip;
  getStudentTaskAnswerFormFieldPlaceholder;
  updateFormStateField;
  redirectToAnswersPage;
  restartStudentTaskAnswer;
  getExerciseIndexByTaskIndexAndExerciseType;
  sendStudentTasksAnswersByEmail: (emailOptions: Options) => Promise<void>,
  sortAnswer(): void;
};