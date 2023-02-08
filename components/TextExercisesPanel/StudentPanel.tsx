import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Space, Spin } from "antd";
import { useTranslation } from "next-i18next";
import { SaveOutlined } from "@ant-design/icons";

import { HebButton } from "../HebElements";
import { ExerciseType, LessonState, UserRole } from "../../constants";
import { StudentAnswerService } from "../../services";
import {
  AmericanQuestionsForm, ChooseWordsByCategoriesForm, CollectSentencesFromWordsForm, ExplainIdeaForm, GiveTitleForm, InsertMissingWordsForm, OrderParagraphsInTextForm, SelectMissingWordsForm,
  SupplementSentencesForm, SupplementTextForm, TrueFalseQuestionsForm
} from "../../scenes/Lessons/components/Exercise";
import { EssayForm, TextQuestionsForm, TextTaskContentListPreview } from "../../scenes/Lessons/components";
import { useLessonForm } from "../../providers";
import { TextTaskExerciseList } from "../TextTaskExerciseList";

const StudentExercise = {
  [ExerciseType.AmericanQuestions]: (props) => <AmericanQuestionsForm {...props}/>,
  [ExerciseType.GiveTitleText]: (props) => <GiveTitleForm {...props}/>,
  [ExerciseType.TrueFalseQuestions]: (props) => <TrueFalseQuestionsForm {...props}/>,
  [ExerciseType.OrderParagraphsInText]: (props) => <OrderParagraphsInTextForm {...props}/>,
  [ExerciseType.InsertMissingWords]: (props) => <InsertMissingWordsForm {...props}/>,
  [ExerciseType.SelectMissingWords]: (props) => <SelectMissingWordsForm {...props}/>,
  [ExerciseType.CollectSentencesFromWords]: (props) => <CollectSentencesFromWordsForm {...props}/>,
  [ExerciseType.SupplementSentences]: (props) => <SupplementSentencesForm {...props} />,
  [ExerciseType.SupplementText]: (props) => <SupplementTextForm {...props} />,
  [ExerciseType.ExplainIdea]: (props) => <ExplainIdeaForm {...props}/>,
  [ExerciseType.ChooseWordsByCategories]: (props) => <ChooseWordsByCategoriesForm {...props}/>,
  [ExerciseType.TextQuestions]: (props) => <TextQuestionsForm {...props} />,
  [ExerciseType.Essay]: (props) => <EssayForm {...props} />
};

export const StudentPanel = ({exercises = [], task, taskIndex, ...props}) => {
  const {t} = useTranslation();
  const {getExerciseIndexByTaskIndexAndExerciseType, formState} = useLessonForm();
  
  const [answer, setAnswer] = useState<any>({});
  const [didLoaded, setDidLoaded] = useState<boolean>(true);
  const [currentExercise, setCurrentExercise] = useState<any>({});
  const [isSending, setIsSending] = useState<boolean>(false);
  const loadAnswerForCurrentUser = useCallback(async (id) => {
    try {
      setDidLoaded(false);
      const loadedAnswer = await StudentAnswerService.getAnswerByExerciseId(id);
      setAnswer(loadedAnswer);
    } catch (error) {
      console.error(error);
    } finally {
      setDidLoaded(true);
    }
  }, []);
  
  const commitAnswer = useCallback(async (exerciseId, committedAnswer) => {
    try {
      setIsSending(true);
      let updatedAnswer = {
        _id: answer?._id || undefined,
        exercise: currentExercise._id,
        points: 0,
        ...committedAnswer
      };
      if (props?.mode !== "preview") {
        updatedAnswer = await StudentAnswerService.commitAnswer(exerciseId, updatedAnswer)
      }
      setAnswer(updatedAnswer);
    } catch (error) {
      console.error(error);
      setAnswer(committedAnswer);
    } finally {
      setIsSending(false)
    }
  }, [currentExercise._id, answer, props]);
  
  const handleExerciseSelect = useCallback((exercise) => {
    setAnswer(undefined);
    setCurrentExercise(exercise);
  }, []);
  
  useEffect(() => {
    setAnswer({});
    if (currentExercise._id && formState.state !== LessonState.PREVIEW) {
      loadAnswerForCurrentUser(currentExercise._id);
    }
  }, [currentExercise]);
  
  const exerciseIndex = getExerciseIndexByTaskIndexAndExerciseType(taskIndex, currentExercise?.__t);
  
  const ExerciseComponent = StudentExercise[currentExercise?.__t];
  const exerciseComponentProps = {
    ...currentExercise,
    task,
    exerciseIndex,
    commitAnswer,
    setAnswer,
    ...props
  };
  
  if (answer) {
    exerciseComponentProps.answer = answer;
  }
  
  const sendAnswerButtonLabel = !isSending
    ? t("pages.lesson.form.tasks.exercises.actions.send_answer.label")
    : t("pages.lesson.form.tasks.exercises.actions.send_answer.sending");
  
  return (
    <Spin spinning={!didLoaded}>
      <Space direction="vertical"
             style={{width: "100%"}}>
        <TextTaskExerciseList role={UserRole.STUDENT}
                       exercises={exercises}
                       mode={props?.mode}
                       onExerciseSelected={handleExerciseSelect}/>
        <Row gutter={16}
             justify="center">
          <Col xs={24} lg={props?.mode === "preview" ? 24 : 12}
               hidden={!currentExercise?.isTextVisibleForUser}>
            {
              currentExercise?.isTextVisibleForUser && (
                <div className="site-page-header-wrapper without-scroll" style={{ marginBottom: 8}}>
                  <TextTaskContentListPreview mode="preview"
                                              task={task}/>
                </div>
              )
            }
          </Col>
          <Col xs={24} lg={props?.mode === "preview" ? 24 : 12}>
            <Row gutter={[0, 16]}>
              <Col xs={24}>
                <Row>
                  <Col xs={24} className={ExerciseComponent && "exercise-component"}>
                    {ExerciseComponent && currentExercise.isEnabled && <ExerciseComponent {...exerciseComponentProps} />}
                  </Col>
                </Row>
              </Col>
              <Col xs={24}>
                <Row justify="end"
                     gutter={[8, 8]}
                     hidden={formState.state === LessonState.PREVIEW || !currentExercise._id}>
                  <Col xs={14}>
                    <HebButton onClick={() => commitAnswer(currentExercise._id, answer)}
                               block
                               loading={isSending}
                               icon={<SaveOutlined />} >
                      {sendAnswerButtonLabel}
                    </HebButton>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col flex="auto">
            <Button block={true} title={"1"}/>
          </Col>
          <Col flex="auto">
            <Button block={true} title={"2"}/>
          </Col>
        </Row>
      </Space>
    </Spin>
  );
};