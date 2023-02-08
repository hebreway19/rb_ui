import { Col, Row } from "antd";
import { assign } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { ExerciseType } from "../../../../../constants";
import { ObjectUtil } from "../../../../../util";
import { HebButton, HebCard, HebForm, HebInput, HebSteps, HebTooltip } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";

const QuestionItem = ({
  sentence,
  taskIndex,
  exerciseIndex,
  questionIndex
}) => {
  const {t} = useTranslation();
  const {formState, form, updatedField} = useLessonForm();

  const contentFieldsPrefix = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions[${questionIndex}]`;
  const rootPathOfTranslate = "pages.lesson.form.tasks.exercises";
  const sentenceWithNikkudotFieldName = `${contentFieldsPrefix}.sentence.he_nikkudot`;
  const sentenceWithoutNikkudotFieldName = `${contentFieldsPrefix}.sentence.he`;

  const textWithNikkudotLabel = t(`pages.lesson.form.tasks.content.he_nikkudot.label`);
  const textWithNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he_nikkudot.placeholder`);
  const textWithoutNikkudotLabel = t(`pages.lesson.form.tasks.content.he.label`);
  const textWithoutNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he.placeholder`);
  const sentenceTitle = t(`${rootPathOfTranslate}.sentence.title`)
  return (
    <HebForm.Item label={<h3>{sentenceTitle}</h3>}
               labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}>
      <hr style={{border: "none", marginLeft: -24, height: 2, width: "calc(100% + 48px)", background: "#75ECF9"}}/>
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
                      cssType="primary"
                      placeholder={textWithoutNikkudotPlaceholder}/>
          </HebForm.Item>
        </Col>
        <Col xs={24}
             hidden={formState.showWithoutNikkudot}>
          <HebForm.Item name={sentenceWithNikkudotFieldName}
                        label={textWithNikkudotLabel}
                        initialValue={sentence?.he_nikkudot}
                        labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                        required={true}
                        changedField={updatedField}
                        form={form}
                        rules={[
                          { required: true }
                        ]}>
            <HebInput lang={"he"}
                      dir={"rtl"}
                      cssType="primary"
                      placeholder={textWithNikkudotPlaceholder}/>
          </HebForm.Item>
        </Col>
      </Row>
      <hr style={{border: "none", marginLeft: -24, height: 2, width: "calc(100% + 48px)", background: "#75ECF9"}}/>
    </HebForm.Item>
  );
}

export const TeacherForm = ({
                              taskIndex,
                              _id = "",
                              __t = ExerciseType.CollectSentencesFromWords,
                              questions = [{questions: {}}],
                              exerciseIndex
                            }) => {
  const {
    lesson,
    form,
    removeExercise,
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

  const list = questions.map((question, questionIndex) => (
    <QuestionItem key={questionIndex}
                  onChange={updateQuestion(questionIndex)}
                  exerciseIndex={exerciseIndex}
                  questionIndex={questionIndex}
                  taskIndex={taskIndex}
                  {...question}/>
  ));

  useEffect(() => {
    setCurrentQuestion(oldState => questions?.length === 0 ? 0 : oldState);
    questions?.length === 0 && (removeExercise(taskIndex, exerciseIndex));
  }, [exerciseIndex, questions, removeExercise, taskIndex]);
  
  const questionType = t(`entities.sentence`);

  const addQuestionButtonTitle = t("actions.add_new.entity.neuter",
                                   { entity: questionType.toLowerCase() });
  const addQuestionButtonTooltip = t("tooltips.press_to_action",
                                     { action: addQuestionButtonTitle.toLowerCase() });

  const removeQuestionButtonLabel = t("actions.remove.entity",
                                      { entity: questionType.toLowerCase() });
  const removeQuestionButtonTooltip = t("tooltips.press_to_action",
                                        { action: removeQuestionButtonLabel.toLowerCase() });
  
  return (
    <div style={{width: "100%"}}>
      <Row gutter={16}
           hidden={exerciseIndex < 0}>
        <Col xs={!list.length ? 24 : 21}>
          <HebCard>
            <Row gutter={[8, 8]} className="exercise__collect-sentences-from-words__question">
              { !(exerciseIndex < 0) &&
              list.map((questionForm, questionIndex) => (
                <Col xs={24}
                     key={questionIndex}
                     hidden={questionIndex !== currentQuestion}>
                  {questionForm}
                </Col>
              ))
              }
            </Row>
            <Row gutter={8}>
              <Col xs={10}
                   hidden={!list.length}>
                <HebTooltip placement="top"
                            title={nl2br(removeQuestionButtonTooltip)}>
                  <HebButton
                    block
                    overText={false}
                    className="exercise__collect-sentences-from-words__remove-question"
                    buttonSize="small"
                    onClick={removeCurrentQuestion}>
                    {nl2br(removeQuestionButtonLabel)}
                  </HebButton>
                </HebTooltip>
              </Col>
              <Col xs={14}>
                <HebTooltip placement="top"
                            title={addQuestionButtonTooltip}>
                  <HebButton
                    block
                    className="exercise__collect-sentences-from-words__add-question"
                    buttonSize="small"
                    onClick={addQuestion}>
                    {nl2br(addQuestionButtonTitle)}
                  </HebButton>
                </HebTooltip>
              </Col>
            </Row>
          </HebCard>
        </Col>
        <Col xs={3}
             className="exercise__collect-sentences-from-words__stepper"
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
  )
}