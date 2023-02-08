import { Card, Col, Row, Space } from "antd";
import { assign } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { ExerciseType } from "../../../../../constants";
import { ObjectUtil } from "../../../../../util";
import { HebButton, HebCard, HebForm, HebInput, HebSteps, HebSwitch, HebTooltip, HebTypography } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";

const QuestionItem = ({
  sentence,
  taskIndex,
  questions = [],
  isStart = true,
  exerciseIndex,
  questionIndex,
  ...props
}) => {
  const {t} = useTranslation();
  const {lesson, updatedField, form, formState, updateExerciseByTaskIndexAndExerciseType} = useLessonForm();

  const changeType = useCallback((value) => {
    let newQuestions = lesson.tasks[taskIndex].exercises[exerciseIndex].questions || [];
    if (!newQuestions[questionIndex]) {
      newQuestions.splice(questionIndex, 0, {});
    }
    newQuestions[questionIndex].isStart = value;
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                             ExerciseType.SupplementSentences,
                                             {questions: newQuestions});
  }, [exerciseIndex, lesson.tasks, questionIndex, taskIndex, updateExerciseByTaskIndexAndExerciseType]);
  
  const controlDescription = t(`pages.lesson.form.tasks.exercises.isStart.sentence.long.${isStart}`);
  const sentenceTypeLabel = t(`pages.lesson.form.tasks.exercises.isStart.sentence.short.${isStart}`);

  const contentFieldsPrefix = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions[${questionIndex}]`;
  const rootPathOfTranslate = "pages.lesson.form.tasks.exercises";
  const sentenceWithNikkudotFieldName = `${contentFieldsPrefix}.sentence.he_nikkudot`;
  const sentenceWithoutNikkudotFieldName = `${contentFieldsPrefix}.sentence.he`;
  
  const textWithNikkudotLabel = t(`pages.lesson.form.tasks.content.he_nikkudot.label`);
  const textWithNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he_nikkudot.placeholder`);
  const textWithoutNikkudotLabel = t(`pages.lesson.form.tasks.content.he.label`);
  const textWithoutNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he.placeholder`);
  const sentenceTitle = t(`${rootPathOfTranslate}.isStart.sentence.short.${isStart}`);
  
  const controlPanel = (
    <>
      <Row dir="rtl" gutter={[8, 8]}>
        <Col xs={24}>
          <Space dir="ltr" style={{color: "#fff"}}>
            {sentenceTypeLabel}
            <HebSwitch onChange={changeType}
                       className="exercise__supplement-sentences__change-type"
                       checked={isStart} />
          </Space>
        </Col>
        <Col xs={24}>
          <HebTypography.Text style={{color: "#fff"}}>
            {controlDescription}
          </HebTypography.Text>
        </Col>
      </Row>
    <hr style={{border: "none", marginLeft: -24, height: 2, width: "calc(100% + 48px)", background: "#75ECF9"}}/>
    </>
  );

  return (
    <>
      {controlPanel}
      <HebForm.Item label={<h3>{sentenceTitle}</h3>}
                    className="exercise__supplement-sentences__sentence"
                    labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}>
        <Row>
          <Col xs={24}
              hidden={!formState.showWithoutNikkudot}>
            <HebForm.Item name={sentenceWithoutNikkudotFieldName}
                       label={textWithoutNikkudotLabel}
                       initialValue={sentence?.he}
                          changedField={updatedField}
                          form={form}
                       labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                       required={true}
                       rules={[
                         { required: true }
                       ]}>
              <HebInput lang={"he"}
                     dir={"rtl"}
                        cssType={"primary"}
                     placeholder={textWithoutNikkudotPlaceholder}/>
            </HebForm.Item>
          </Col>
          <Col xs={24}
               hidden={formState.showWithoutNikkudot}>
            <HebForm.Item name={sentenceWithNikkudotFieldName}
                       label={textWithNikkudotLabel}
                       initialValue={sentence?.he}
                          changedField={updatedField}
                          form={form}
                       labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                       required={true}
                       rules={[
                         { required: true }
                       ]}>
              <HebInput lang={"he"}
                     dir={"rtl"}
                        cssType={"primary"}
                     placeholder={textWithNikkudotPlaceholder}/>
            </HebForm.Item>
          </Col>
        </Row>
      </HebForm.Item>
    </>
  );
} 

export const TeacherForm = ({
                              taskIndex,
                              _id = "",
                              __t = ExerciseType.SupplementSentences,
                              questions = [{questions: [{}]}],
                              exerciseIndex,
                              ...props
                            }) => {
  const {
    lesson,
    form,
    removeExercise,
    addExercise,
    updateExerciseByTaskIndexAndExerciseType
  } = useLessonForm();
  const {t} = useTranslation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const addQuestion = useCallback(() => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex, 
                                             __t, 
                                             {
                                               questions: [...questions, {}]
                                             });
    setCurrentQuestion(questions.length || 0);
  }, [__t, questions, taskIndex, updateExerciseByTaskIndexAndExerciseType]);
  const removeCurrentQuestion = useCallback(() => {
    const newQuestions = questions.filter((_,
                                          index) => index !== currentQuestion)
    updateExerciseByTaskIndexAndExerciseType(taskIndex, 
                                             __t, 
                                             {questions: newQuestions});
    form.resetFields(ObjectUtil.getLeaves(lesson));
    setCurrentQuestion(currentQuestion >= newQuestions.length ? newQuestions.length - 1 : currentQuestion);
  }, [__t, currentQuestion, form, lesson, questions, taskIndex, updateExerciseByTaskIndexAndExerciseType]);
  const updateQuestion = useCallback((updatedQuestionIndex) => (updatedQuestion) => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                             __t,
                                             {
                                               questions: questions.map((question,
                                                                         questionIndex) => questionIndex === updatedQuestionIndex
                                                                                           ? assign({}, question, updatedQuestion)
                                                                                           : question
                                                                       )
                                             });
  }, [__t, questions, taskIndex, updateExerciseByTaskIndexAndExerciseType]);


  useEffect(() => {
    setCurrentQuestion(oldState => questions?.length === 0 ? 0 : oldState);
    questions?.length === 0 && (removeExercise(taskIndex, exerciseIndex));
  }, [exerciseIndex, questions, removeExercise, taskIndex]);

  const questionType = t(`entities.sentence`);

  const addQuestionButtonTitle = t("actions.add_new.entity.neuter", { entity: questionType.toLowerCase() });
  const addQuestionButtonTooltip = t("tooltips.press_to_action", { action: addQuestionButtonTitle.toLowerCase() });

  const removeQuestionButtonLabel = t("actions.remove.entity", { entity: questionType.toLowerCase() });
  const removeQuestionButtonTooltip = t("tooltips.press_to_action", { action: removeQuestionButtonLabel.toLowerCase() });

  

  const list = questions.map((question, questionIndex) => (
    <QuestionItem key={questionIndex}
                  onChange={updateQuestion(questionIndex)}
                  exerciseIndex={exerciseIndex}
                  questionIndex={questionIndex}
                  taskIndex={taskIndex}
                  {...question} />));

  return (
    <div style={{width: "100%"}}>
      <Row hidden={exerciseIndex < 0}>
        <Col xs={!list.length ? 24 : 21}>
          <HebCard>
            <Card.Grid style={{width: "100%"}}>
              <Row>
                { !(exerciseIndex < 0) &&
                list.map((questionForm, questionIndex) => (
                  <Col xs={24}
                       hidden={questionIndex !== currentQuestion}
                       key={questionIndex}>
                    {questionForm}
                  </Col>
                ))
                }
              </Row>
            </Card.Grid>
            <Card.Grid style={{width: "100%"}}>
              <Row gutter={[8, 8]}
                   hidden={exerciseIndex === -1}>
                <Col xs={24}
                     hidden={!list.length}>
                  <HebTooltip placement="top"
                              title={nl2br(removeQuestionButtonTooltip)}>
                    <HebButton block
                               indicatorLine={false}
                               buttonSize="small"
                               className="exercise__supplement-sentences__remove-sentence"
                               onClick={removeCurrentQuestion}>
                      {nl2br(removeQuestionButtonLabel)}
                    </HebButton>
                  </HebTooltip>
                </Col>
                <Col xs={24}>
                  <HebTooltip placement="top"
                              title={addQuestionButtonTooltip}>
                    <HebButton block
                               indicatorLine={false}
                               className="exercise__supplement-sentences__add-sentence"
                               buttonSize="small"
                               onClick={addQuestion}>
                      {nl2br(addQuestionButtonTitle)}
                    </HebButton>
                  </HebTooltip>
                </Col>
              </Row>
            </Card.Grid>
          </HebCard>
        </Col>
        <Col xs={3} className="exercise__supplement-sentences__stepper"
             hidden={!list.length}>
          <HebSteps direction="vertical"
                    type="navigation"
                    current={currentQuestion}
                    onChange={setCurrentQuestion}>
            { list.map((_, questionIndex) => <HebSteps.Step key={questionIndex} />)}
          </HebSteps>
        </Col>
      </Row>
    </div>
  );
}