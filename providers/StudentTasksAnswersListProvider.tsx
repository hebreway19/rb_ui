import {message} from "antd";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {LessonType, RoutePath, UserRole} from "../constants";
import {useStudentTasksAnswersService} from "../services";
import {Page, RouteUrl, StudentTasksAnswers, StudentTasksAnswersListPage, StudentTasksAnswersListState} from "../types";
import {useRouter} from "next/router";
import {useAuth} from "./AuthProvider";
import {RouteUtil, StringUtil} from "../util";

export const studentTasksAnswersListContext = createContext<StudentTasksAnswersListPage>({} as StudentTasksAnswersListPage);

export const useStudentTasksAnswersAnswerList = () => {
  return useContext(studentTasksAnswersListContext);
};

const {STUDENT_TASKS_ANSWERS_PATH, ID, LESSONS_PATH, USER_ROLE, STUDENT_TASK_ANSWERS_ID_PATH} = RoutePath;

export const StudentTasksAnswersListProvider = ({
                                                  children,
                                                  role
                                                }) => {
  const router = useRouter();
  const query = router.query;
  const {user} = useAuth();
  const {lesson} = query;

  const studentTasksAnswersService = useStudentTasksAnswersService();
  const [studentTasksAnswersPage, setStudentTasksAnswersPage] = useState<Page<StudentTasksAnswers>>({
                                                                                                      docs: [],
                                                                                                      page: 0,
                                                                                                      totalDocs: 0,
                                                                                                      totalPages: 1
                                                                                                    });
  const [answerListState, setAnswerListState] = useState<StudentTasksAnswersListState>({
                                                                                         isLoading: true,
                                                                                         filterParamsIsVisible: false,
                                                                                         error: undefined
                                                                                       } as StudentTasksAnswersListState);
  const [filteredInfo, setFilteredInfo] = useState({lesson: router.query.lesson, user: null, group: null, is_checked: null, isFinished: null});

  const updateListState = useCallback((fieldName, value) => setAnswerListState(oldState => ({
    ...oldState,
    [fieldName]: value
  })), [setAnswerListState]);
  const updatedListStates = useCallback((fieldList) => {
    fieldList.forEach(({fieldName, value}) => updateListState(fieldName, value));
  }, [updateListState]);

  const loadStudentTaskAnswersByQueryAndPagination = useCallback(async (queryParams = {},
                                                                        pagination = {}) => {
    updateListState("isLoading", true);
    const updatedFieldsList = [{fieldName: "isLoading", value: false}];
    try {
      const foundStudentTaskAnswers = await studentTasksAnswersService.getStudentTasksAnswersByQueryAndPage(queryParams,
                                                                                                            pagination)
      setStudentTasksAnswersPage(foundStudentTaskAnswers);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
      updatedFieldsList.push({fieldName: "error", value: error});
    } finally {
      updatedListStates(updatedFieldsList);
    }
  }, [updateListState, studentTasksAnswersService, updatedListStates]);

  const filteredByLessonIdAndPagination = useCallback(async (lessonId, pagination = {}) => {
    await loadStudentTaskAnswersByQueryAndPagination({
                                                       lesson: {
                                                         _id: lessonId
                                                       }
                                                     },
                                                     pagination);
  }, [loadStudentTaskAnswersByQueryAndPagination]);

  const filteredByLessonTitleAndPagination = useCallback(async (searchString: string = "", pagination = {}) => {
    await loadStudentTaskAnswersByQueryAndPagination({
      'lesson.title.he': StringUtil.removeNikkudots(searchString?.trim())
    }, pagination);
  }, [loadStudentTaskAnswersByQueryAndPagination]);

  const updateAnswerList = useCallback(async (pagination = {}) => {
    if (role === UserRole.TEACHER) {
      lesson ? await filteredByLessonIdAndPagination(lesson, pagination)
             : await loadStudentTaskAnswersByQueryAndPagination({},
                                                                pagination);
    } else if (role === UserRole.STUDENT && user) {
      await loadStudentTaskAnswersByQueryAndPagination({student: user.userId},
                                                       pagination);
    }
  }, [filteredByLessonIdAndPagination, loadStudentTaskAnswersByQueryAndPagination, user, lesson, role]);

  const generatePath = useCallback((userRole: string, isFinished: boolean): string => {
    return isFinished || userRole === UserRole.TEACHER ? STUDENT_TASK_ANSWERS_ID_PATH(STUDENT_TASKS_ANSWERS_PATH(USER_ROLE())).replace(
                                                         "[userRole]",
                                                         userRole)
                                                       : (ID(LESSONS_PATH(USER_ROLE()))).replace("[userRole]", userRole)
                                                                                        .replace("[id]", "[lessonId]");
  }, []);
  const createStudentTasksAnswersPath = useCallback((userRole: string,
                                                     lessonId: string,
                                                     taskAnswerId: string,
                                                     isFinished: boolean): RouteUrl => {
    let resultHref: RouteUrl = {
      pathname: generatePath(userRole, isFinished),
      query: {}
    };
    if (isFinished || userRole === UserRole.TEACHER) {
      resultHref.query["studentTasksAnswersId"] = taskAnswerId;
    } else {
      resultHref.query["lessonId"] = lessonId;
    }
    return resultHref;
  }, [generatePath]);

  const redirectToTaskAnswerPageByIdTaskAnswerAndUserRole = useCallback(async (userRole,
                                                                               lessonId,
                                                                               studentTasksAnswersId,
                                                                               isFinished) => {
    const studentTasksAnswersUrl: RouteUrl = RouteUtil.getLessonFormRouteByLessonIdAndTaskAnswerIdAndUserRole({
                                                                                                                studentTasksAnswersId,
                                                                                                                userRole
                                                                                                              });
    const lessonUrl: RouteUrl = userRole === UserRole.TEACHER
                                ? RouteUtil.getTeacherLessonFormPathByIdAndType({
                                                                                  id: lessonId,
                                                                                  type: LessonType.LESSON
                                                                                })
                                : RouteUtil.getStudentLessonFormRouteById({id: lessonId});
    if (isFinished || userRole === UserRole.TEACHER) {
      await router.push(studentTasksAnswersUrl);
    } else {
      await router.push(lessonUrl);
    }
  }, [router]);

  useEffect(() => {
    updateAnswerList();
  }, [lesson]);

  const listValues: StudentTasksAnswersListPage = {
    studentTasksAnswersPage,
    answerListState,
    filteredInfo,
    setFilteredInfo,
    setAnswerListState,
    createStudentTasksAnswersPath,
    updateAnswerList,
    updateListState,
    loadStudentTaskAnswersByQueryAndPagination,
    redirectToTaskAnswerPageByIdTaskAnswerAndUserRole,
    filteredByLessonTitleAndPagination
  };

  return (
    <studentTasksAnswersListContext.Provider value={listValues}>
      {children}
    </studentTasksAnswersListContext.Provider>
  );
}