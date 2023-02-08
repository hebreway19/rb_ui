import React, {useCallback, useEffect, useState} from "react";
import {Col, PageHeader, Row, Spin, Typography} from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileAddOutlined
} from "@ant-design/icons";
import {useTranslation} from "next-i18next";
import {useMediaQuery} from "react-responsive";
import nl2br from "react-nl2br";
import {useLessonForm, useStudentTasksAnswersForm} from "../../providers";
import {HebButton, HebPopconfirm, HebTooltip} from "../HebElements";
import {LessonPreviewForm} from "../../scenes/Lessons/components";
import {ToggleExercisesButton} from "./ToggleExercisesButton";
import {StudentTasksAnswersState, TaskType, ViewModes} from "../../constants";


type LessonPageProps = {
  mode?: "default" | "preview";
  isTouchedLessonForm?: boolean;
  onBackCallback?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  backIcon?: React.ReactNode;
};
const LessonPage = ({
                             mode = "default",
                             isTouchedLessonForm = false,
                             onBackCallback,
                             backIcon = null
                           }: LessonPageProps) => {
  const {
    lesson,
    getLessonFormFieldTooltip,
    form,
    downloadLessonPdf,
  } = useLessonForm();
  const {
    formState,
    setFormState,
    studentTasksAnswers,
    startStudentTaskAnswer,
    finishStudentTaskAnswer,
    updateFormStateField,
    redirectToAnswersPage,
    downloadStudentTasksAnswersPdf
  } = useStudentTasksAnswersForm();

  const {t} = useTranslation();
  const title = lesson.title.he_nikkudot;

  const [lessonHasExercises, setLessonHasExercises] = useState<boolean>(false);

  const processCondition = useCallback((condition, correctResult, incorrectResult = undefined) => {
    return condition ? correctResult : incorrectResult;
  }, []);

  const showUploadComponent = useCallback(() => setFormState(oldState => ({
    ...oldState,
    isVisibleUploadAnswerComponent: !oldState.isVisibleUploadAnswerComponent
  })), [setFormState]);

  const showWithoutNikkudotTooltip = getLessonFormFieldTooltip("showWithoutNikkudot");
  const downloadPdfButtonLabel = t("actions.download.type_file", {typeFile: t(`entities.type_file.pdf`).toUpperCase()});
  const downloadPdfButtonPopconfirm = t("actions.download.download_last_save");
  const downloadPdfButtonTooltip = t("tooltips.press_to_action", {action: downloadPdfButtonLabel.toLowerCase()});
  const showOrHideTranslationLabel = processCondition(!formState.isVisibleTranslate,
                                                      t("actions.show.entity", {
                                                        entity: t("entities.translation.translation").toLowerCase()
                                                      }),
                                                      t("actions.hide.entity", {
                                                        entity: t("entities.translation.translation").toLowerCase()
                                                      }));
  const finishExercisesLabel = t("pages.lesson.form.tasks.exercises.actions.finish.label");
  const popconfirmText = t("tooltips.are_you_sure");
  const popconfirmYes = t("tooltips.yes");
  const popconfirmNo = t("tooltips.no");
  const uploadAnswerButtonLabel = t("actions.upload.entity", {entity: t("entities.answer.answers").toLowerCase()});

  const isMediumScreen = useMediaQuery({query: "(min-width: 768px)"});
  const isRetina = useMediaQuery({query: "(max-width: 1366px)"});
  const isMiddleMediumScreen = useMediaQuery({query: "(max-width: 880px)"});
  const isRetinaPropsDisplayed = (isMediumScreen && isRetina);

  useEffect(() => {
    processCondition(mode === "default", redirectToAnswersPage());
  }, [lesson, processCondition, mode, redirectToAnswersPage]);


  useEffect(() => {
    let result = (lesson?.tasks || []).some(task => (task.exercises && task.exercises.find(exercise => exercise.isEnabled) !== undefined));
    setLessonHasExercises(result);
  }, [lesson?.tasks]);

  useEffect(() => {
    const isSingleGameTask: boolean = lesson.tasks.length === 1 && lesson.tasks[0].__t === TaskType.GameTask;
    if (isSingleGameTask) {
      setFormState(oldState => ({...oldState, exercisesIsVisible: true, isSingleGameTask: true}))
      if (studentTasksAnswers.state === StudentTasksAnswersState.CREATED) {
        startStudentTaskAnswer()
      }
    }
  }, [lesson.tasks, startStudentTaskAnswer, setFormState, studentTasksAnswers.state]);

  const headerStyle: React.CSSProperties = {
    fontFamily: "Georgia, sans-serif",
    margin: 0,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "33px",
    lineHeight: "37px",
    letterSpacing: "3px",
    textAlign: "right",
    textTransform: "uppercase",
    color: "#FFFFFF",
    direction: "rtl",
    ...(mode === "preview" && isRetinaPropsDisplayed && ({
                               textAlign: "center",
                               width: "100%"
                             }))
  };
  return (
    <div className="lesson-page-container">
      <Spin spinning={!formState.didLoaded}>
        {mode === "preview" &&
         <PageHeader ghost={!formState.didLoaded}
                     onBack={onBackCallback}
                     title={" "}
                     backIcon={processCondition(false, <ArrowLeftOutlined/>, backIcon)
                     }
         />
        }
        <Row justify="center">
          <Col xs={mode === "preview" ? 24 : 22}>
            <Row gutter={[8, 8]} justify="end"
                 style={{marginBottom: 83, marginTop: mode === "preview" ? 0 : 12}}>
              <Col xs={24} lg={formState.exercisesIsVisible ? 19
                                                            : isRetinaPropsDisplayed ? 24 : 6}>
                <Typography.Paragraph style={headerStyle} ellipsis>
                  {title}
                </Typography.Paragraph>
              </Col>
              <Col {...isRetinaPropsDisplayed ? {xs: 3} : {xs: 24, lg: 2}} hidden={formState.exercisesIsVisible || !lessonHasExercises}>
                <HebTooltip title={showWithoutNikkudotTooltip}>
                  <HebButton viewType={processCondition(formState.showWithoutNikkudot, "default", "primary")}
                             buttonSize="over-small"
                             block={true}
                             overText={false}
                             indicatorLine={false}
                             onClick={() => updateFormStateField("showWithoutNikkudot", !formState.showWithoutNikkudot)}>
                    {processCondition(formState.showWithoutNikkudot, "א", "אָ")}
                  </HebButton>
                </HebTooltip>
              </Col>
              <Col {...isRetinaPropsDisplayed ? { xs: 9 } : {xs: 24, lg: 5}} hidden={formState.exercisesIsVisible}>
                <HebButton onClick={() => updateFormStateField("isVisibleTranslate", !formState.isVisibleTranslate)}
                           buttonSize="over-small"
                           viewType="secondary"
                           block
                           overText={false}
                           icon={processCondition(formState.isVisibleTranslate,
                             <EyeInvisibleOutlined/>,
                             <EyeOutlined/>)}>
                  {showOrHideTranslationLabel}
                </HebButton>
              </Col>
              <Col {...isRetinaPropsDisplayed ? {xs: 12} : {xs: 24, lg: 5}} hidden={formState.isSingleGameTask}>
                <ToggleExercisesButton lessonType={lesson.type} startExercises={startStudentTaskAnswer} isExercisesVisible={formState.exercisesIsVisible} lessonHasExercises={lessonHasExercises}/>
              </Col>
              <Col {...isRetinaPropsDisplayed ? {...isMiddleMediumScreen && ({xs: 24})} : {xs: 24, lg: 6}}  hidden={mode === ViewModes.PREVIEW || !formState.exercisesIsVisible || formState.isSingleGameTask}>
                <HebButton icon={<FileAddOutlined/>} buttonSize="over-small" block onClick={showUploadComponent}>{nl2br(uploadAnswerButtonLabel)}</HebButton>
              </Col>
              <Col {...isRetinaPropsDisplayed ? {...isMiddleMediumScreen && ({xs: 24})} : {xs: 24, lg: 8}} hidden={!formState.exercisesIsVisible || mode === "preview"}>
                <HebPopconfirm placement="top" title={popconfirmText} onConfirm={finishStudentTaskAnswer}
                               okText={popconfirmYes} cancelText={popconfirmNo}>
                  <HebButton viewType="primary" buttonSize="over-small" block overText={false}>
                    {finishExercisesLabel}
                  </HebButton>
                </HebPopconfirm>
              </Col>
              <Col {...isRetinaPropsDisplayed ? {} : {xs: 24, lg: 6}} hidden={formState.exercisesIsVisible || isTouchedLessonForm}>
                <HebTooltip placement="top" title={nl2br(downloadPdfButtonTooltip)}>
                  <HebButton viewType="primary" buttonSize="over-small" overText={false} block onClick={studentTasksAnswers._id ? downloadStudentTasksAnswersPdf : downloadLessonPdf} loading={formState.didPdfLoaded} icon={<DownloadOutlined/>}>
                    {nl2br(downloadPdfButtonLabel)}
                  </HebButton>
                </HebTooltip>
              </Col>
              <Col {...isRetinaPropsDisplayed ? {} : {xs: 24, lg: 6}} hidden={formState.exercisesIsVisible || !isTouchedLessonForm}>
                <HebPopconfirm placement="bottomRight" title={downloadPdfButtonPopconfirm} okText={popconfirmYes} cancelText={popconfirmNo}
                               onConfirm={async () => {
                                 await form.validateFields()
                                   .then(() => true)
                                   .catch(error => {
                                     if (error.errorFields.length > 0) {
                                       return false
                                     }
                                   });
                                 studentTasksAnswers._id ? downloadStudentTasksAnswersPdf() : downloadLessonPdf();
                               }}>
                  <HebButton viewType="primary" buttonSize="over-small" overText={false} block loading={formState.didPdfLoaded} icon={<DownloadOutlined/>}>
                    {nl2br(downloadPdfButtonLabel)}
                  </HebButton>
                </HebPopconfirm>
              </Col>
            </Row>
          </Col>
        </Row>
        <LessonPreviewForm mode={mode}/>
      </Spin>
    </div>);
};

export default LessonPage;