import React from "react";
import { UserRole } from "../constants";
import { RouteUrl } from "./RouteUrl";
import { StudentTasksAnswers } from "./StudentTasksAnswers";
import { StudentTasksAnswersListState } from "./StudentTasksAnswersListState";
import { Page } from "./Page";

export type StudentTasksAnswersListPage = {
  studentTasksAnswersPage: Page<StudentTasksAnswers>;
  answerListState: StudentTasksAnswersListState;
  filteredInfo: any;
  setFilteredInfo: React.Dispatch<React.SetStateAction<any>>;
  setAnswerListState: React.Dispatch<React.SetStateAction<StudentTasksAnswersListState>>;
  createStudentTasksAnswersPath(userRole: string,
                                lessonId: string,
                                studentTasksAnswersId: string,
                                isFinished: boolean): RouteUrl;
  updateAnswerList(pagination?: any): Promise<void>;
  updateListState(fieldName: any, value: any): void;
  loadStudentTaskAnswersByQueryAndPagination(queryParams?: any, pagination?: any): any;
  filteredByLessonTitleAndPagination(searchString: string, pagination?: any): any;
  redirectToTaskAnswerPageByIdTaskAnswerAndUserRole(userRole: UserRole,
                                                    lessonId: string,
                                                    studentTasksAnswersId: string,
                                                    isFinished: boolean): Promise<void>;
}