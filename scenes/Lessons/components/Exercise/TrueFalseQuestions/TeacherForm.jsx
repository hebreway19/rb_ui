import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { ExerciseType } from "../../../../../constants";
import nl2br from "react-nl2br";
import { assign } from "lodash";
import { ObjectUtil } from "../../../../../util";
import { HebButton, HebCard, HebForm, HebRadio, HebSteps, HebTextArea, HebTooltip } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";

const QuestionItem = ({questionIndex, onChange, exerciseIndex, taskIndex, question, language, isTrue = false, ...props}) => {
  const {t} = useTranslation();
  const {formState, updatedField, form, lesson, updateExerciseByTaskIndexAndExerciseType} = useLessonForm();

  const setIsTrue = useCallback((value) => {
    let newQuestions = lesson.tasks[taskIndex].exercises[exerciseIndex].questions || [];
    if (!newQuestions) {
      newQuestions.splice(questionIndex, 0, {isTrue: false});
    }
    newQuestions[questionIndex].isTrue = value;
    console.log(newQuestions, value)
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                             ExerciseType.TrueFalseQuestions,
                                             {questions: newQuestions});
  }, [lesson, updateExerciseByTaskIndexAndExerciseType, questionIndex, exerciseIndex, taskIndex]);

  const contentFieldsPrefix = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions[${questionIndex}]`;

  const rootPathOfTranslate = "pages.lesson.form.tasks.exercises";

  const textWithNikkudotLabel = t(`pages.lesson.form.tasks.content.he_nikkudot.label`);
  const textWithNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he_nikkudot.placeholder`);

  const textWithoutNikkudotLabel = t(`pages.lesson.form.tasks.content.he.label`);
  const textWithoutNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he.placeholder`);

  const questionWithoutNikkudotContent = `${contentFieldsPrefix}.question.he`;
  const questionWithNikkudotContent = `${contentFieldsPrefix}.question.he_nikkudot`;
  const questionWithoutNikkudotIsTrue = `${contentFieldsPrefix}.isTrue`;

  const questionLabel = t(`${rootPathOfTranslate}.question.label`);
  const questionTooltip = t(`${rootPathOfTranslate}.question.tooltip`);

  const isItTrueLabel = t(`${rootPathOfTranslate}.isTrue.label`);
  const isItTrueTooltip = t(`${rootPathOfTranslate}.isTrue.tooltip`);
  const options = [
    {label: t("tooltips.yes"), value: true},
    {label: t("tooltips.no"), value: false},
  ];

  return (
    <div style={{width: "100%"}}>
      <Row>
        <Col xs={24}>
          <HebForm.Item label={<h3>{questionLabel}</h3>}
                        className="exercise__true-false-questions__question"
                        tooltip={questionTooltip}
                        labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}>
            <hr style={{border: "none", marginLeft: -24, height: 2, width: "calc(100% + 48px)", background: "#75ECF9"}}/>
            <Row>
              <Col xs={24}
                   hidden={!formState.showWithoutNikkudot}>
                <HebForm.Item label={textWithoutNikkudotLabel}
                              name={questionWithoutNikkudotContent}
                              required={true}
                              changedField={updatedField}
                              form={form}
                              initialValue={question?.he}
                              labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                              rules={[
                                {required: true}
                              ]}>
                  <HebTextArea lang={"he"}
                               dir={"rtl"}
                               size={"large"}
                               value={question?.he}
                               placeholder={textWithoutNikkudotPlaceholder}/>
                </HebForm.Item>
              </Col>
              <Col xs={24}
                   hidden={formState.showWithoutNikkudot}>
                <HebForm.Item label={textWithNikkudotLabel}
                              name={questionWithNikkudotContent}
                              initialValue={question?.he_nikkudot}
                              required={true}
                              changedField={updatedField}
                              form={form}
                              labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                              rules={[
                                {required: true}
                              ]}>
                  <HebTextArea lang={"he"}
                               dir={"rtl"}
                               value={question?.he_nikkudot}
                               size={"large"}
                               placeholder={textWithNikkudotPlaceholder}/>
                </HebForm.Item>
              </Col>
            </Row>
          </HebForm.Item>
          <hr style={{border: "none", marginLeft: -24, height: 2, width: "calc(100% + 48px)", background: "#75ECF9"}}/>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <HebForm.Item label={<h3>{isItTrueLabel}</h3>}
                        className="exercise__true-false-questions__answer"
                        tooltip={isItTrueTooltip}
                        required={true}
                        changedField={updatedField}
                        form={form}
                        name={questionWithoutNikkudotIsTrue}
                        initialValue={isTrue}
                        labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}>
            <Row justify="end">
              <Col>
                <HebRadio.Group
                  options={options}
                  value={isTrue === 'true' || isTrue === true}
                  onChange={event => setIsTrue(event.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Col>
            </Row>
          </HebForm.Item>
          <hr style={{border: "none", marginLeft: -24, height: 2, width: "calc(100% + 48px)", background: "#75ECF9"}}/>
        </Col>
      </Row>
    </div>
  );
};

export const TeacherForm = ({
                              taskIndex,
                              _id,
                              __t = ExerciseType.TrueFalseQuestions,
                              questions = [
                                {
                                  question: {},
                                }
                              ],
                              exerciseIndex,
                              ...props
                            }) => {
  const { 
    updateExerciseByTaskIndexAndExerciseType,
    removeExercise,
    form,
    lesson
  } = useLessonForm();
  const { t } = useTranslation();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const addQuestion = useCallback(() => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
      questions: [...questions, { question: { he: "", he_nikkudot: "" } }]
    });
    setCurrentQuestion(questions.length);
  }, [questions, __t, updateExerciseByTaskIndexAndExerciseType, taskIndex]);
  const removeCurrentQuestion = useCallback(() => {
                                              const newQuestions = questions.filter((_,
                                                                                     index) => index !== currentQuestion);
                                              updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
                                                questions: newQuestions
                                              });
                                              form.resetFields(ObjectUtil.getLeaves(lesson));
                                              setCurrentQuestion(currentQuestion >= newQuestions.length ? newQuestions.length - 1 : currentQuestion);
                                            },
                                            [questions, updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, form, lesson, currentQuestion])

  const updateQuestion = useCallback((updatedQuestionIndex) => (updatedQuestion) => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
      questions: questions.map((question,
                                questionIndex) => questionIndex === updatedQuestionIndex
        ? assign({}, question, updatedQuestion)
        : question)
    });
  }, [updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, questions]);

  useEffect(() => {
    setCurrentQuestion(oldState => questions?.length === 0 ? 0 : oldState);
    questions?.length === 0 && (removeExercise(taskIndex, exerciseIndex));
  }, [exerciseIndex, questions?.length, removeExercise, taskIndex]);

  const selectedQuestion = questions.find((question,
                                           questionIndex) => questionIndex === currentQuestion);

  const questionType = t(`entities.true_false_question`);

  const addQuestionButtonTitle = t("actions.add_new.entity.male",
                                   { entity: questionType.toLowerCase() });
  const addQuestionButtonTooltip = t("tooltips.press_to_action",
                                     { action: addQuestionButtonTitle.toLowerCase() });

  const removeQuestionButtonTitle = t("actions.remove.entity",
                                      {entity: questionType.toLowerCase()});
  const removeQuestionButtonTooltip = t("tooltips.press_to_action",
                                        {action: removeQuestionButtonTitle.toLowerCase()});

  return (
    <>
      <Row hidden={exerciseIndex === -1}
           gutter={16}>
        <Col xs={21}>
          <HebCard>
            {selectedQuestion && (
              <Row>
                <Col xs={24}>
                  <QuestionItem onChange={updateQuestion(currentQuestion)}
                                exerciseIndex={exerciseIndex}
                                questionIndex={currentQuestion}
                                taskIndex={taskIndex}
                                {...selectedQuestion}
                  />
                </Col>
              </Row>
            )}
            <Row gutter={[8, 8]}>
              <Col xs={24}
                   hidden={!questions.length}>
                <HebTooltip placement="top"
                            title={nl2br(removeQuestionButtonTooltip)}>
                  <HebButton block buttonSize="small" onClick={removeCurrentQuestion}
                             className="exercise__true-false-questions__remove-question">
                    {nl2br(removeQuestionButtonTitle)}
                  </HebButton>
                </HebTooltip>
              </Col>
              <Col xs={24}>
                <HebTooltip placement="top"
                            title={addQuestionButtonTooltip}>
                  <HebButton block buttonSize="small" onClick={addQuestion}
                             className="exercise__true-false-questions__add-question">
                    {nl2br(addQuestionButtonTitle)}
                  </HebButton>
                </HebTooltip>
              </Col>
            </Row>
          </HebCard>

        </Col>
        <Col xs={3} className="exercise__true-false-questions__stepper">
          <HebSteps direction="vertical"
                    type="navigation"
                    current={currentQuestion}
                    onChange={setCurrentQuestion}>
            {questions.map((question, questionIndex) => (
              <HebSteps.Step key={questionIndex}/>
            ))
            }
          </HebSteps>
        </Col>
      </Row>
    </>
  );
};