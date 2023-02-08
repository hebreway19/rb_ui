import React from "react";
import { PrivateRoute } from "../../shared/components";
import { RoutePath, UserRole, UserState } from "../../constants";
import { LessonFormProvider } from "../Lessons/providers";
import { AnswersPage, StudentTasksAnswersPage } from "./components";
import { AnswerListProvider, TaskAnswerFormProvider } from "./providers";

const {TEACHER, ID, STUDENT,  STUDENT_TASKS_ANSWERS_PATH} = RoutePath;

export const Router = ({...props}) => {
  const answerListForTeacher = STUDENT_TASKS_ANSWERS_PATH(TEACHER());
  const answerListForStudent = STUDENT_TASKS_ANSWERS_PATH(STUDENT());
  const answerFormForTeacher = `${ID(answerListForTeacher)}/:taskAnswerId`;
  const answerFormForStudent = `${ID(answerListForStudent)}/:taskAnswerId`;
  return (
    <Switch>
      <PrivateRoute exact
                    roles={[UserRole.TEACHER]}
                    states={[UserState.ACTIVE]}
                    path={answerListForTeacher} >
        <AnswerListProvider role={UserRole.TEACHER} >
          <AnswersPage role={UserRole.TEACHER} />
        </AnswerListProvider>
      </PrivateRoute>
      <PrivateRoute exact
                    roles={[UserRole.STUDENT, UserRole.TEACHER]}
                    states={[UserState.ACTIVE]}
                    path={answerListForStudent} >
        <AnswerListProvider role={UserRole.STUDENT}>
          <AnswersPage role={UserRole.STUDENT} />
        </AnswerListProvider>
      </PrivateRoute>
      <PrivateRoute exact
                    roles={[UserRole.TEACHER]}
                    states={[UserState.ACTIVE]}
                    path={answerFormForTeacher}>
        <LessonFormProvider>
          <TaskAnswerFormProvider>
            <StudentTasksAnswersPage role={UserRole.TEACHER} />
          </TaskAnswerFormProvider>
        </LessonFormProvider>
      </PrivateRoute>
      <PrivateRoute exact
                    roles={[UserRole.STUDENT, UserRole.TEACHER]}
                    states={[UserState.ACTIVE]}
                    path={answerFormForStudent}>
        <LessonFormProvider>
          <TaskAnswerFormProvider>
            <StudentTasksAnswersPage role={UserRole.STUDENT}
                                     states={[UserState.ACTIVE]} />
          </TaskAnswerFormProvider>
        </LessonFormProvider>
      </PrivateRoute>
    </Switch>
  );
}

 Router;