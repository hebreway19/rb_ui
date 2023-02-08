import { Form, message } from "antd";
import { merge, set } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Options } from "nodemailer/lib/mailer";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ClosedExamPage } from "../components/ClosedExamPage";
import { RoutePath, StudentTasksAnswersState, UserRole } from "../constants";

import { useStudentTasksAnswersService } from "../services";
import {
  Exercise,
  StudentAnswer,
  StudentExerciseAnswer,
  StudentTasksAnswers,
  StudentTasksAnswersForm,
  StudentTasksAnswersFormState
} from "../types";
import { RouteUtil } from "../util";
import { useAuth } from "./AuthProvider";
import { useLessonForm } from "./LessonFormProvider";

export const studentTasksAnswersFormContext = createContext<StudentTasksAnswersForm>({} as StudentTasksAnswersForm);

export const useStudentTasksAnswersForm = () => {
  return useContext(studentTasksAnswersFormContext);
};

type StudentTasksAnswersFormProviderProps = {
  children: React.ReactNode | React.ReactNode[];
  lessonId?: string;
  studentId?: string;
  studentTasksAnswersId?: string
};

export const StudentTasksAnswersFormProvider = ({children, lessonId, studentId, studentTasksAnswersId}: StudentTasksAnswersFormProviderProps) => {
  const {user} = useAuth();
  const router = useRouter();
  const {t} = useTranslation();
  const [form] = Form.useForm();
  const {setLesson} = useLessonForm();

  const [studentTasksAnswers, setStudentTasksAnswers] = useState<StudentTasksAnswers>({
                                                                                        _id: "",
                                                                                        answers: [],
                                                                                        tasks: [],
                                                                                        state: StudentTasksAnswersState.CREATED,
                                                                                        student: ""
                                                                                      });
  const [formState, setFormState] = useState<StudentTasksAnswersFormState>({
                                                                             didLoaded: false,
                                                                             didPdfLoaded: false,
                                                                             textIsVisible: false,
                                                                             isExpertMode: false,
                                                                             isVisibleTranslate: false,
                                                                             exercisesIsVisible: false,
                                                                             isVisibleUploadAnswerComponent: false,
                                                                             showWithoutNikkudot: false,
                                                                             isSingleGameTask: false
                                                                           });
  const [error, setError] = useState<any>({statusCode: 200, payload: { openFrom: undefined, openTo: undefined}});

  studentTasksAnswersId = studentTasksAnswersId || studentTasksAnswers._id;
  studentId = studentId || user?.userId;

  const [changedField, setChangedField] = useState({});
  const studentTasksAnswersService = useStudentTasksAnswersService();

  const updateFormStateField = useCallback((fieldName, fieldValue) => setFormState(previousFormState => ({
    ...previousFormState,
    [fieldName]: fieldValue
  })), []);
  
  const sortAnswer = useCallback(() => setStudentTasksAnswers(oldState => {
    const studentCompareFn = (a: StudentAnswer, b: StudentAnswer) => a.points - b.points;
    const teacherCompareFn = (a: StudentExerciseAnswer) => (a.exercise as Exercise)?.isAutomaticallyChecked ? 1 : -1;
    
    const isStudentSort: boolean = user.role === UserRole.STUDENT;
    let newAnswersArray = oldState.answers.slice()
                                          .sort(isStudentSort ? studentCompareFn : teacherCompareFn);
    return ({...oldState, answers: newAnswersArray});
  }), [user.role]);

  const loadStudentTasksAnswersByLessonAndStudent = useCallback(async (foundedStudentId: string, foundedLessonId: string) => {
    setFormState((oldState) => ({...oldState, didLoaded: false}));
    try {
      const foundStudentTasksAnswers = await studentTasksAnswersService.getStudentTasksAnswersByStudentAndLesson(foundedStudentId, foundedLessonId);
      setStudentTasksAnswers(foundStudentTasksAnswers);
      setError(error => ({...error, statusCode: 200}));
    }
    catch (error) {
      console.error(error);
      setError(error.body)
    }
    setFormState((oldState) => ({...oldState, didLoaded: true}));
  }, [studentTasksAnswersService]);

  const loadStudentTasksAnswersById = useCallback(async (foundStudentTasksAnswersId) => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      const foundStudentTasksAnswers = await studentTasksAnswersService.getStudentTasksAnswersById(foundStudentTasksAnswersId);
      setStudentTasksAnswers(foundStudentTasksAnswers);
      setError(error => ({...error, statusCode: 200}));
    }
    catch (error) {
      setError(error.body)
      if (error.body.statusCode === 403) {
        await router.push(RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.STUDENT()));
      }
      console.error(error);
      message.warn(error.message);
    }
    finally {
      setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
    }
  }, [router, studentTasksAnswersService]);

  const redirectToAnswersPage = useCallback(async () => {
    if (studentTasksAnswers?.state === StudentTasksAnswersState.FINISHED && user?.role === UserRole.STUDENT) {
      await router.push(RouteUtil.getStudentTasksAnswersForStudentByIdRoute({studentTasksAnswersId: studentTasksAnswers._id}));
    }
    setFormState(oldState => {
      if (studentTasksAnswers?.state === StudentTasksAnswersState.FINISHED && user?.role === UserRole.STUDENT) {
        return {...oldState, exercisesIsVisible: true};
      }
      return oldState;
    });
  }, [router, setFormState, studentTasksAnswers._id, studentTasksAnswers.state, user?.role]);

  const startStudentTaskAnswer = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      if (user?.role === UserRole.STUDENT && studentTasksAnswers.state === StudentTasksAnswersState.CREATED) {
        await studentTasksAnswersService.startStudentTaskAnswer(studentTasksAnswers._id);
        await loadStudentTasksAnswersById(studentTasksAnswers._id);
      }
    } catch (error) {
      console.error(error);
    }
    setFormState(previousFormState => ({...previousFormState,
                                              didLoaded: true,
                                              exercisesIsVisible: !previousFormState.exercisesIsVisible}));
  }, [studentTasksAnswersService, studentTasksAnswers, loadStudentTasksAnswersById, user?.role]);

  const finishStudentTaskAnswer = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      if (user?.role === UserRole.STUDENT) {
        await studentTasksAnswersService.finishStudentTaskAnswer(studentTasksAnswers._id);
        message.info(t("messages.saved"));
      }
    } catch (error) {
      console.error(error);
    }
    await loadStudentTasksAnswersById(studentTasksAnswers._id);
    await redirectToAnswersPage();
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [studentTasksAnswersService, redirectToAnswersPage, studentTasksAnswers, loadStudentTasksAnswersById, t, user?.role]);

  const restartStudentTaskAnswer = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      if (user?.role === UserRole.STUDENT) {
        await studentTasksAnswersService.restartStudentTaskAnswer(studentTasksAnswers._id);
        message.info(t("messages.success"));
      }
    } catch (error) {
      console.error(error);
    }
    await loadStudentTasksAnswersById(studentTasksAnswers._id);
    await router.push(RouteUtil.getStudentLessonFormRouteById({id: studentTasksAnswers.lesson._id}));
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [loadStudentTasksAnswersById, router, studentTasksAnswers, user, t, studentTasksAnswersService]);

  const saveStudentTasksAnswers = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      await studentTasksAnswersService.updateStudentTasksAnswers(studentTasksAnswers._id, studentTasksAnswers);
      message.info(t("messages.saved"));
    }
    catch (error) {
      console.error((await error));
      message.warn((await error).message);
    }
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [studentTasksAnswers, studentTasksAnswersService, t]);

  const handleTaskAnswerChange = useCallback((changedFields) => setStudentTasksAnswers(previousTaskAnswer => {
    const newTaskAnswer = merge({}, previousTaskAnswer);
    changedFields.forEach(({name, value}) => {
      const fieldName = Array.isArray(name) ? name[0] : name;
      set(newTaskAnswer, fieldName, value);
    });
    return newTaskAnswer;
  }), []);

  const downloadStudentTasksAnswersPdf = useCallback(async () => {
    try {
      setFormState(oldState => ({...oldState, didPdfLoaded: true}));
      const resultUrl = URL.createObjectURL(new Blob([await studentTasksAnswersService.downloadPdf(studentTasksAnswers._id)], {type: "application/pdf"}));
      let link = document.createElement("a");
      link.href = resultUrl;
      link.download = `${(studentTasksAnswers.lesson.title.he_nikkudot || studentTasksAnswers.lesson.title.he).replace(/ /g, "_")}___${moment(studentTasksAnswers.lesson.openFrom).format(t("date_format"))}.pdf`;
      link.click();
      URL.revokeObjectURL(resultUrl);
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    finally {
      setFormState(oldState => ({...oldState, didPdfLoaded: false}));
    }
  }, [studentTasksAnswers._id, studentTasksAnswers.lesson, t, studentTasksAnswersService]);

  const getExerciseIndexByTaskIndexAndExerciseType = useCallback((taskIndex: number, exerciseType: string) => {
    return studentTasksAnswers.lesson.tasks[taskIndex]?.exercises.findIndex(exercise => exercise.__t === exerciseType);
  }, [studentTasksAnswers.lesson?.tasks]);


  const sendStudentTasksAnswersByEmail = useCallback(async (emailOptions: Options) => {
    if (studentTasksAnswers._id) {
      try {
        await studentTasksAnswersService.sendStudentTaskAnswerByEmail(studentTasksAnswers._id, emailOptions);
      }
      catch (error) {
        message.warn(error.message);
        console.error(error);
      }
    }
  }, [studentTasksAnswers, studentTasksAnswersService]);

  useEffect(() => {
    if (user?.role === UserRole.STUDENT && studentId && lessonId) {
      loadStudentTasksAnswersByLessonAndStudent(studentId, lessonId);
    } else if (studentTasksAnswersId) {
      loadStudentTasksAnswersById(studentTasksAnswersId);
    } else {
      setFormState(oldState => ({...oldState, didLoaded: true}));
    }
  }, [user, lessonId, studentId, studentTasksAnswersId, loadStudentTasksAnswersByLessonAndStudent, loadStudentTasksAnswersById]);

  useEffect(() => {
    if (studentTasksAnswers.lesson) {
      setLesson && setLesson(studentTasksAnswers.lesson);
    }
  }, [studentTasksAnswers, setLesson]);

  const getStudentTaskAnswerFormFieldLabel = useCallback((fieldName) => t(`pages.lesson.form.${fieldName}.label`), [t]);
  const getStudentTaskAnswerFormFieldTooltip = useCallback((fieldName) => t(`pages.lesson.form.${fieldName}.tooltip`), [t]);
  const getStudentTaskAnswerFormFieldPlaceholder = useCallback((fieldName) => t(`pages.lesson.form.${fieldName}.placeholder`), [t]);

  const providerValue = {
    studentTasksAnswers,
    setStudentTasksAnswers,
    formState,
    form,
    changedField,
    setChangedField,
    setFormState,
    startStudentTaskAnswer,
    finishStudentTaskAnswer,
    saveStudentTasksAnswers,
    handleTaskAnswerChange,
    loadStudentTasksAnswersById,
    loadStudentTasksAnswersByLessonAndStudent,
    downloadStudentTasksAnswersPdf,
    getStudentTaskAnswerFormFieldLabel,
    getStudentTaskAnswerFormFieldTooltip,
    getStudentTaskAnswerFormFieldPlaceholder,
    updateFormStateField,
    redirectToAnswersPage,
    restartStudentTaskAnswer,
    getExerciseIndexByTaskIndexAndExerciseType,
    sendStudentTasksAnswersByEmail,
    sortAnswer
  };

  return (
    <studentTasksAnswersFormContext.Provider value={providerValue}>
      {error.statusCode === 451 ? <ClosedExamPage error={error}
                                             update={() => loadStudentTasksAnswersByLessonAndStudent(studentId, lessonId) } />
                                : children}
    </studentTasksAnswersFormContext.Provider>
  );
};