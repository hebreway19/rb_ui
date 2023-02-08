import { Form, message } from "antd";
import { assign, get, merge, set } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import {
    AccessType,
    ExerciseType,
    GameTaskExerciseTypes,
    HebrewProficiency,
    LanguageCode,
    LessonState,
    LessonType,
    RoutePath,
    TaskContentType,
    TaskType,
    TimeOfDay
} from "../constants";
import { useLessonsService } from "../services";
import { BaseLesson, Content, Exercise, Lesson, LessonForm, LessonFormState, Task, TextContent } from "../types";
import { ObjectUtil, RouteUtil, StringUtil } from "../util";
import { useNavigator } from "./NavigatorContext";

const logUrl = async (url) => console.log(`impossible to share ${url}`);
const shareUrl = (t) => async (navigatorObject: Navigator, url) => {
    try {
        if (navigatorObject?.share) {
            const shareData = {
                url
            };
            await navigatorObject?.share(shareData);
            message.success(t("messages.lesson_link_shared"));
        } else {
            await navigatorObject.clipboard.writeText(url);
            message.success(t("messages.lesson_link_for_students_copied"));
        }
    } catch (error) {
        console.error(error);
        message.warning(error.message);
    }
};
const createOnShare = (t) => process.browser ? shareUrl(t) : logUrl;

const {
    TEACHER,
    LESSONS_PATH,
    TYPE_PATH,
    STUDENT,
    LESSON_ID,
    LESSON_ID_PATH,
    TYPE,
    SOURCE_ID_PATH,
    SOURCE_ID
} = RoutePath;

export const lessonFormContext = createContext<LessonForm>({} as LessonForm);
export const useLessonForm = () => {
    return useContext(lessonFormContext);
};

type LessonFormProviderProps = {
    isAutomaticallyDownloaded?: boolean;
    children: React.ReactNode | React.ReactNode [];
    type?: LessonType;
    lessonId: string;
    sourceId?: string;
};

export const LessonFormProvider = ({
                                       isAutomaticallyDownloaded = true,
                                       children,
                                       lessonId,
                                       type,
                                       sourceId
                                   }: LessonFormProviderProps) => {

    const lessonsService = useLessonsService();
    const {t} = useTranslation();
    const {share} = useNavigator();
    const [form] = Form.useForm();
    const router = useRouter();
    const query = router.query;

    const isValid = form.getFieldsError().filter(({errors}) => errors.length);

    const [lesson, setLesson] = useState<Lesson>({
        _id: lessonId === "new" ? "" : lessonId,
        studentsNativeLanguage: LanguageCode.EN,
        title: {
            he: "שיעור חדש",
            he_nikkudot: "שיעור חדש"
        },
        author: "",
        studentsHebrewProficiency: HebrewProficiency.ALEF,
        tasks: [],
        openFrom: moment().add(1, "hour").valueOf(),
        openTo: moment().add(2, "hour").valueOf(),
        accessType: AccessType.LINK,
        timeOfDay: TimeOfDay.MORNING,
        type
    });
    const [savedLesson, setSavedLesson] = useState({
        _id: lessonId === "new" ? "" : lessonId,
        studentsNativeLanguage: LanguageCode.EN,
        title: {
            he: "שיעור חדש",
            he_nikkudot: "שיעור חדש"
        },
        author: "",
        studentsHebrewProficiency: HebrewProficiency.ALEF,
        tasks: [],
        openFrom: moment().add(1, "hour").valueOf(),
        openTo: moment().add(2, "hour").valueOf(),
        accessType: AccessType.LINK,
        timeOfDay: TimeOfDay.MORNING,
        type
    });
    const [formState, setFormState] = useState<LessonFormState>({
        didLoaded: false,
        didPdfLoaded: false,
        isExpertMode: false,
        isVisibleTranslate: false,
        exercisesIsVisible: false,
        isVisibleUploadAnswerComponent: false,
        isNewLesson: lessonId === "new" || !!sourceId,
        state: "",
        showWithoutNikkudot: false
    });
    const [updatedField, setUpdatedField] = useState({});
    const updateFormStateField = useCallback((fieldName, fieldValue) => setFormState(previousFormState => ({
        ...previousFormState,
        [fieldName]: fieldValue
    })), []);

    const changePageState = useCallback((state) => () => updateFormStateField("state", state), []);
    const isPageStateEqualToTarget = useCallback((targetState) => formState.state === targetState, [formState.state]);

    const saveLesson = useCallback(async () => {
        setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
        try {
            const result = formState.isNewLesson ? await lessonsService.createLesson(lesson)
                : await lessonsService.updateLesson(lesson);
            if (formState.isNewLesson) {
                const newPath = RouteUtil.getTeacherLessonFormPathByIdAndType({id: result._id, type: result.type});
                await router.push(newPath);
            }
            setLesson(result);
            setSavedLesson(result);
            form.resetFields(ObjectUtil.getLeaves(result));
        } catch (error) {
            console.error(error);
            message.warning(error.message);
        }
        setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
    }, [form, formState, lesson, lessonsService]);

    const handleLessonChange = useCallback((changedFields) => {
        setLesson((previousLesson: BaseLesson) => {
            const newLesson = merge({}, previousLesson);
            changedFields.forEach(({name, value}) => {
                const fieldName = Array.isArray(name) ? name[0] : name;
                if (value === undefined) {
                    value = fieldName === "accessPeriod"
                        ? [newLesson.openFrom, newLesson.openTo]
                        : get(newLesson, fieldName);
                }
                if (fieldName.endsWith("_nikkudot")) {
                    const fieldWithoutNikkudot = fieldName.replace("_nikkudot", "");
                    const tempNode = document.createElement("p");
                    tempNode.innerHTML = StringUtil.removeNikkudots(value);
                    const text = tempNode.textContent;
                    form.setFields([{name: fieldWithoutNikkudot, value: text}]);
                }
                if (value && fieldName === "accessPeriod") {
                    if (Array.isArray(value)) {
                        set(newLesson, "openFrom", value[0].valueOf());
                        set(newLesson, "openTo", value[1].valueOf());
                    } else {
                        set(newLesson, "openFrom", value.valueOf());
                    }
                } else {
                    set(newLesson, fieldName, value);
                }
            });
            return newLesson;
        });
    }, [form]);

    const createCopyFromLesson = useCallback((lessonType) => async () => {
        const newPath = SOURCE_ID_PATH(LESSON_ID_PATH(TYPE_PATH(LESSONS_PATH(TEACHER()))));
        const baseLessonId: string = lesson._id;
        delete lesson._id;
        setLesson(lesson);
        await router.push({
            pathname: newPath,
            query: {
                [SOURCE_ID]: baseLessonId,
                [TYPE]: lessonType,
                [LESSON_ID]: "new"
            }
        });
    }, [lesson, router]);

    const downloadLessonPdf = useCallback(async () => {
        setFormState(oldState => ({...oldState, didPdfLoaded: true}));
        try {
            const resultUrl = URL.createObjectURL(new Blob([await lessonsService.downloadPdf(lesson._id)], {type: "application/pdf"}));
            var link = document.createElement("a");
            link.href = resultUrl;
            link.download = `${(lesson.title.he_nikkudot || lesson.title.he).replace(/ /g, "_")}___${moment(lesson.openFrom).format(t("date_format"))}.pdf`;
            link.click();
            URL.revokeObjectURL(resultUrl);
        } catch (error) {
            console.error(error);
            message.warn(error.message);
        } finally {
            setFormState(oldState => ({...oldState, didPdfLoaded: false}));
        }
    }, [lesson._id, lesson.openFrom, lesson.title?.he, lesson.title?.he_nikkudot, t, lessonsService]);
    
    const addTask = useCallback((taskType = TaskType.TextTask) => async (content: any[] = [
        {
            __t: TaskContentType.TextContent,
            isVisibleForStudents: true,
            he: "",
            he_nikkudot: "",
            ru: "",
            fr: "",
            en: ""
        } as TextContent
    ]) => {
        const updateLesson = async (updatedLesson) => {
            setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
            const newLesson = formState.isNewLesson ? await lessonsService.createLesson(updatedLesson)
                                                    : await lessonsService.updateLesson(updatedLesson)
            setLesson(newLesson);
            setSavedLesson(newLesson);
            setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
            if (formState.isNewLesson) {
                const newPath = RouteUtil.getTeacherLessonFormPathByIdAndType({id: newLesson._id, type: newLesson.type});
                await router.push(newPath);
            }
        }
        const newTask: Task = {
            __t: taskType,
            content,
            exercises: []
        };
        const newLesson: BaseLesson = taskType === TaskType.TextTask ? ({...lesson, tasks: [newTask].concat([...lesson.tasks])})
                                                                     : ({...lesson, tasks: [...lesson.tasks, newTask]});
        await updateLesson(newLesson);
        changePageState(LessonState.NONE)();
    }, [lesson, changePageState, formState, lessonsService]);
    
    const addTextTask = useCallback((taskType) => () => {
        setLesson((previousLesson: BaseLesson) => {
            const newTask: Task = {
                __t: taskType,
                content: [
                    {
                        __t: TaskContentType.TextContent,
                        isVisibleForStudents: false,
                        [LanguageCode.HE]: "",
                        [LanguageCode.HE_NIKKUDOT]: ""
                    }
                ],
                exercises: []
            };
            const newLesson: BaseLesson = {...previousLesson, tasks: [...previousLesson.tasks, newTask]};
            return newLesson;
        });
        changePageState(LessonState.NONE)();
    }, [changePageState]);

    const removeContentFromTask = useCallback((taskIndex, contentIndex) => () => setLesson(previousLesson => {
        const task = previousLesson.tasks[taskIndex];
        task.content = task.content.filter((taskContent, index) => index !== contentIndex);
        previousLesson.tasks = [...previousLesson.tasks];
        return {...previousLesson};
    }), []);

    const removeTask = useCallback((index) => () => setLesson(previousLesson => ({
        ...previousLesson,
        tasks: previousLesson.tasks.filter((task, taskIndex) => taskIndex !== index)
    })), []);

    const shareLessonWithTeachers = useCallback(async () => {
        const {protocol, port, hostname} = window.location;
        const linkForTeachers = `${protocol}//${hostname}:${port}` + LESSON_ID_PATH(TYPE_PATH(LESSONS_PATH(TEACHER()))).replace(`[${LESSON_ID}]`, lesson._id)
            .replace(`[${TYPE}]`, type);
        const url = new URL(linkForTeachers);
        await share(url.toString());
    }, [lesson, share]);

    const shareLessonWithStudents = useCallback(async () => {
        const {protocol, port, hostname} = window.location;
        const linkForStudents = `${protocol}//${hostname}:${port}` + LESSON_ID_PATH(LESSONS_PATH(STUDENT())).replace(`[${LESSON_ID}]`, lesson._id);
        const url = new URL(linkForStudents);
        await share(url.toString());
    }, [lesson._id, share]);

    useEffect(() => {
        if (isAutomaticallyDownloaded) {
            const isNewLessonBasedOnOther = lessonId === "new" || !!sourceId;
            const loadLesson = async () => {
                try {
                    const queryDate = Number(query.date);
                    const loadedLesson = await lessonsService.loadLessonById(lessonId === "new" ? sourceId : lessonId);
                    if (isNewLessonBasedOnOther) {
                        if (queryDate) {
                            const fromMilliseconds: number = 1000 * 60 * 60 * 1;
                            const toMilliseconds: number = 1000 * 60 * 60 * 2;
                            loadedLesson.openFrom = moment.unix(queryDate).add(fromMilliseconds, "milliseconds");
                            loadedLesson.openTo = moment.unix(queryDate).add(toMilliseconds, "milliseconds");
                        }
                        delete loadedLesson._id;
                        delete loadedLesson.author;
                        delete loadedLesson.updatedAt;
                        delete loadedLesson.createdAt;
                        loadedLesson.tasks.forEach(task => {
                            delete task._id;
                            task.exercises.forEach(exercise => {
                                delete exercise._id;
                                delete exercise.id;
                                delete exercise.studentAnswers;
                            });
                        });
                        loadedLesson.type = type;
                        loadedLesson.timeOfDay = TimeOfDay.MORNING;
                        if (type === LessonType.LESSON) {
                            delete loadedLesson.openedTo;
                        }
                    }
                    setFormState(previousFormState => ({
                        ...previousFormState,
                        didLoaded: true,
                        isNewLesson: isNewLessonBasedOnOther
                    }));
                    setSavedLesson(loadedLesson);
                    setLesson(loadedLesson);
                    form.resetFields();
                } catch (error) {
                    setFormState(previousFormState => ({...previousFormState, didLoaded: true, isNewLesson: false}));
                    const errorValue = await error;
                    message.warning(errorValue.message);
                    console.error(errorValue);
                }
            };
            if (!isNewLessonBasedOnOther && !!lessonId) {
                loadLesson();
            } else if (sourceId) {
                loadLesson();
            } else {
                setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
            }
        }
    }, [lessonId, sourceId, isAutomaticallyDownloaded, type, form, lessonsService, query.date]);

    const addParagraph = useCallback((paragraphIndex, taskIndex) => {
        setLesson(previousLesson => {
            const updatedTask = previousLesson.tasks.find((task, index) => index === taskIndex);
            if (updatedTask) {
                const defaultContent: TextContent = {
                    __t: TaskContentType.TextContent,
                    isVisibleForStudents: true,
                    he: "",
                    he_nikkudot: "",
                    ru: "",
                    fr: "",
                    en: ""
                }
                updatedTask.content.splice(paragraphIndex + 1, 0, defaultContent);
            }
            return merge({}, previousLesson);
        });
        form.resetFields();
    }, [form]);

    const moveParagraphUp = useCallback((paragraphIndex, taskIndex) => () => setLesson(previousLesson => {
        const updatedTask = previousLesson.tasks.find((task, index) => index === taskIndex);
        if (paragraphIndex > 0) {
            const sourceParagraph = updatedTask.content[paragraphIndex];
            const replacedParagraph = updatedTask.content[paragraphIndex - 1];
            updatedTask.content[paragraphIndex - 1] = sourceParagraph;
            updatedTask.content[paragraphIndex] = replacedParagraph;
        }
        return merge({}, previousLesson);
    }), []);

    const moveParagraphDown = useCallback((paragraphIndex, taskIndex) => setLesson(previousLesson => {
        const updatedTask = previousLesson.tasks.find((task, index) => index === taskIndex);
        if (paragraphIndex < updatedTask.content.length - 1) {
            const sourceParagraph = updatedTask.content[paragraphIndex];
            const replacedParagraph = updatedTask.content[paragraphIndex + 1];
            updatedTask.content[paragraphIndex + 1] = sourceParagraph;
            updatedTask.content[paragraphIndex] = replacedParagraph;
        }
        return merge({}, previousLesson);
    }), []);

    const removeParagraph = useCallback((paragraphIndex, taskIndex) => {
        setLesson(previousLesson => {
            const updatedTask = previousLesson.tasks.find((task, index) => index === taskIndex);
            updatedTask.content.splice(paragraphIndex, 1);
            if (!updatedTask.content.length) {
                updatedTask.content.push({} as Content);
            }
            const result = merge({}, previousLesson);
            const paths = ObjectUtil.getLeaves(result);
            form.setFields(paths.map(path => ({name: path, value: get(result, path)})));
            return result;
        })
    }, [form]);

    const addExercise = useCallback((exerciseType, taskIndex, exerciseIndex) => setLesson(previousLesson => {
        const updatedTask = previousLesson.tasks.find((task, index) => index === taskIndex);
        if (updatedTask) {
            if (!updatedTask.exercises) {
                updatedTask.exercises.push({} as Exercise);
            }
            updatedTask.exercises.splice(exerciseIndex, 0, {
                __t: exerciseType,
                task: updatedTask._id,
                lessonId: lesson._id,
                isEnabled: true
            } as Exercise);
        }
        return merge({}, previousLesson);
    }), [lesson._id]);

    const addExerciseContent = useCallback((taskIndex: number,
                                            exerciseIndex: number,
                                            itemIndex: number,
                                            customModalName: any,
                                            defaultValues: any = {}) => setLesson((previousLesson) => {
        const updatedTask: Task = previousLesson.tasks.find((task: Task, index: number) => index === taskIndex);
        if (updatedTask) {
            const updatedExercise: Exercise = updatedTask.exercises.find((exercise: Exercise, index: number) => index === exerciseIndex);
            if (updatedExercise) {
                if (!updatedExercise[customModalName]) {
                    updatedExercise[customModalName] = [];
                }
                updatedExercise[customModalName].splice(itemIndex, 0, defaultValues);
            }
        }
        return merge({}, previousLesson);
    }), []);

    const removeExercise = useCallback((taskIndex: number, exerciseIndex: number): void => setLesson((previousLesson) => {
        const updatedTask: Task = previousLesson.tasks.find((task: Task, index: number) => index === taskIndex);
        updatedTask.exercises.splice(exerciseIndex, 1);
        if (!updatedTask.exercises.length) {
            updatedTask.exercises = [];
        }
        return merge({}, previousLesson);
    }), []);
    const switchTurnExercise = useCallback((taskIndex, exerciseIndex): void => setLesson(previousLesson => {
        const updatedTask = previousLesson.tasks.find((task, index) => index === taskIndex);
        updatedTask.exercises[exerciseIndex] = {
            ...updatedTask.exercises[exerciseIndex],
            isEnabled: !updatedTask.exercises[exerciseIndex]?.isEnabled
        };
        return merge({}, previousLesson);
    }), []);

    const removeLesson = useCallback(async (): Promise<void> => {
        try {
            setFormState((previousFormState) => ({...previousFormState, didLoaded: true}));
            await lessonsService.deleteLessonById(lesson._id);
            router.push(`${LESSONS_PATH(TEACHER())}/${lesson.type}`);
        } catch (error) {
            console.error(error);
            message.warn(error.message);
        } finally {
            setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
        }
    }, [lesson._id, lesson.type, lessonsService])

    const getUnselectedTasksTypes = useCallback((): string[] => {
        const taskTypes: string[] = Object.values(TaskType);
        const selectedTaskTypes: string[] = lesson?.tasks?.map(task => task.__t);
        return taskTypes.filter(taskType => !selectedTaskTypes.includes(taskType));
    }, [lesson]);

    const getExerciseIndexByTaskIndexAndExerciseType = useCallback((taskIndex: number, exerciseType: string) => {
        return lesson.tasks[taskIndex]?.exercises.findIndex(exercise => exercise.__t === exerciseType);
    }, [lesson.tasks]);
    const getExerciseIndexByTaskIndexAndExerciseTypeFromSavedLesson = useCallback((taskIndex: number, exerciseType: string) => {
        return savedLesson.tasks[taskIndex]?.exercises.findIndex(exercise => exercise.__t === exerciseType);
    }, [savedLesson.tasks]);

    const updateExerciseByTaskIndexAndExerciseType = useCallback((updatedTaskIndex: number,
                                                                  updatedExerciseType: ExerciseType | GameTaskExerciseTypes,
                                                                  updatedExercise?: Exercise) => setLesson(
        (previousLesson) => {
            const newLesson = merge({}, previousLesson, {tasks: {[updatedTaskIndex]: {exercises: []}}});
            const updatedExerciseIndex: number = newLesson.tasks[updatedTaskIndex].exercises.findIndex(exercise => exercise.__t === updatedExerciseType);
            if (updatedExerciseIndex > -1) {
                const affectedExercise: Exercise = newLesson.tasks[updatedTaskIndex].exercises[updatedExerciseIndex];
                newLesson.tasks[updatedTaskIndex].exercises[updatedExerciseIndex] = assign({},
                    affectedExercise,
                    updatedExercise);
            } else {
                newLesson.tasks[updatedTaskIndex].exercises.push(assign({}, {__t: updatedExerciseType}, updatedExercise));
            }
            return newLesson;
        }), []);

    const getExerciseByTaskIndexAndExerciseType = useCallback((taskIndex: number, exerciseType: string) => {
        const task: Task = lesson.tasks[taskIndex];
        let exercise: Exercise = task?.exercises?.find(taskExercise => taskExercise.__t === exerciseType);
        if (!exercise) {
            exercise = {__t: exerciseType} as Exercise;
        }
        return exercise;
    }, [lesson.tasks]);

    const getLessonFormFieldLabel = useCallback((fieldName: string) => t(`pages.lesson.form.${fieldName}.label`), [t]);
    const getLessonFormFieldTooltip = useCallback((fieldName: string) => t(`pages.lesson.form.${fieldName}.tooltip`), [t]);
    const getLessonFormFieldPlaceholder = useCallback((fieldName: string) => t(`pages.lesson.form.${fieldName}.placeholder`),
        [t]);

    const createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType = useCallback((taskIndex: number,
                                                                                          exerciseIndex: number,
                                                                                          exerciseType) => {
        return exerciseIndex > -1 ? removeExercise(taskIndex, exerciseIndex)
            : updateExerciseByTaskIndexAndExerciseType(taskIndex, exerciseType);
    }, [removeExercise, updateExerciseByTaskIndexAndExerciseType]);

    useEffect(() => {
        if (!form.isFieldsTouched(false)) {
            const paths = ObjectUtil.getLeaves(lesson);
            form.setFields(paths.map(path => ({name: path, value: get(lesson, path)})));
        }
    }, [lesson, form]);

    const providerValue = {
        downloadLessonPdf,
        updatedField,
        setUpdatedField,
        lesson,
        savedLesson,
        setLesson,
        formState,
        setFormState,
        saveLesson,
        removeLesson,
        switchTurnExercise,
        handleLessonChange,
        changePageState,
        isPageStateEqualToTarget,
        addTextTask,
        removeTask,
        removeContentFromTask,
        updateFormStateField,
        shareLessonWithTeachers,
        shareLessonWithStudents,
        createCopyFromLesson,
        form,
        isValid,
        addParagraph,
        addExercise,
        addExerciseContent,
        moveParagraphDown,
        moveParagraphUp,
        removeParagraph,
        removeExercise,
        getUnselectedTasksTypes,
        getLessonFormFieldLabel,
        getLessonFormFieldTooltip,
        getLessonFormFieldPlaceholder,
        getExerciseByTaskIndexAndExerciseType,
        getExerciseIndexByTaskIndexAndExerciseType,
        getExerciseIndexByTaskIndexAndExerciseTypeFromSavedLesson,
        updateExerciseByTaskIndexAndExerciseType,
        createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType,
        addTask
    };

    return (
        <lessonFormContext.Provider value={providerValue}>
            {children}
        </lessonFormContext.Provider>
    );
}