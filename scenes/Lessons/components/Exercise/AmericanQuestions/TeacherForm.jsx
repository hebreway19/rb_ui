import { Col, Row, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { WrongAnswersList } from "./WrongAnswersList";
import { ExerciseType } from "../../../../../constants";
import nl2br from "react-nl2br";
import { assign } from "lodash";
import { ObjectUtil } from "../../../../../util";
import { HebButton, HebCard, HebForm, HebInput, HebSteps, HebTextArea, HebTooltip } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";

const QuestionItem = ({
                        questionIndex,
                        exerciseIndex,
                        taskIndex,
                        question,
                        correctAnswer,
                        wrongAnswers = [{}, {}, {}, {}]
                      }) => {
  const {formState, form, updatedField} = useLessonForm();
  const { t } = useTranslation();

  const contentFieldsPrefix = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions[${questionIndex}]`;

  const rootPathOfTranslate = "pages.lesson.form.tasks.exercises";

  const textWithNikkudotLabel = t(`pages.lesson.form.tasks.content.he_nikkudot.label`);
  const textWithNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he_nikkudot.placeholder`);

  const textWithoutNikkudotLabel = t(`pages.lesson.form.tasks.content.he.label`);
  const textWithoutNikkudotPlaceholder = t(`pages.lesson.form.tasks.content.he.placeholder`);

  const questionWithoutNikkudotContent = `${contentFieldsPrefix}.question.he`;
  const questionWithNikkudotContent = `${contentFieldsPrefix}.question.he_nikkudot`;

  const correctAnswerWithoutNikkudotContent = `${contentFieldsPrefix}.correctAnswer.he`;
  const correctAnswerWithNikkudotContent = `${contentFieldsPrefix}.correctAnswer.he_nikkudot`;

  const questionLabel = t(`${rootPathOfTranslate}.question.label`);
  const questionTooltip = t(`${rootPathOfTranslate}.question.tooltip`);

  const correctAnswerLabel = t(`${rootPathOfTranslate}.correct_answer.label`);
  const correctAnswerTooltip = t(`${rootPathOfTranslate}.correct_answer.tooltip`);

  const wrongAnswersLabel = t(`${rootPathOfTranslate}.wrong_answers.label`);
  const wrongAnswersTooltip = t(`${rootPathOfTranslate}.wrong_answers.tooltip`);

  return (
    <div style={{ width: "100%" }}>
      <Row>
        <Col xs={24}>
          <HebForm.Item label={<h3>{questionLabel}</h3>}
                     tooltip={questionTooltip}
                     labelCol={{ span: 24 }}>
            <hr style={{border: "none", marginLeft: "-1.5rem", height: ".125rem", width: "calc(100% + 3rem)", background: "#75ECF9"}}/>
            <Row className="exercise__american-question__question">
              <Col xs={24}
                   hidden={!formState.showWithoutNikkudot}>
                <HebForm.Item label={textWithoutNikkudotLabel}
                           name={questionWithoutNikkudotContent}
                           initialValue={question?.he}
                           required={true}
                           form={form}
                           changedField={updatedField}
                           labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                           rules={[
                             { required: true }
                           ]}>
                  <HebTextArea lang={"he"}
                                dir={"rtl"}
                                size={"large"}
                                placeholder={textWithoutNikkudotPlaceholder}/>
                </HebForm.Item>
              </Col>
              <Col xs={24}
                   hidden={formState.showWithoutNikkudot}>
                <HebForm.Item label={textWithNikkudotLabel}
                           name={questionWithNikkudotContent}
                           initialValue={question?.he_nikkudot}
                           form={form}
                           changedField={updatedField}
                           required={true}
                           labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}}
                           rules={[
                             { required: true }
                           ]}>
                  <HebTextArea lang={"he"}
                               dir={"rtl"}
                               size={"large"}
                               placeholder={textWithNikkudotPlaceholder}/>
                </HebForm.Item>
              </Col>
            </Row>
          </HebForm.Item>
        </Col>
      </Row>
      <hr style={{border: "none", marginLeft: "-1.5rem", height: ".125rem", width: "calc(100% + 3rem)", background: "#75ECF9"}}/>
      <Row gutter={ 8 } >
        <Col span={ 24 } 
             className="exercise__american-question__correct-answer">
          <HebForm.Item label={ <h3>{ correctAnswerLabel }</h3> }
                     tooltip={ correctAnswerTooltip }
                     labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}} >
            <hr style={{border: "none", marginLeft: "-1.5rem", height: ".125rem", width: "calc(100% + 3rem)", background: "#75ECF9"}}/>
            <HebForm.Item label={ formState.showWithoutNikkudot
                               ? textWithoutNikkudotLabel 
                               : textWithNikkudotLabel }
                       required={ true }
                       labelCol={{span: 24}} >
              <Row>
                <Col hidden={formState.showWithoutNikkudot}
                     span={24}
                     xs={24}>
                  <HebForm.Item name={correctAnswerWithNikkudotContent}
                                initialValue={correctAnswer?.he_nikkudot}
                                required={true}
                                form={form}
                                changedField={updatedField}
                                rules={[
                                  { required: true }
                                ]}>
                    <HebInput lang={"he"}
                              dir={"rtl"}
                              cssType={"circled"}
                              placeholder={textWithNikkudotPlaceholder}/>
                  </HebForm.Item>
                </Col>
                <Col hidden={!formState.showWithoutNikkudot}
                     span={24}
                     xs={24}>
                  <HebForm.Item name={correctAnswerWithoutNikkudotContent}
                                initialValue={correctAnswer?.he}
                                required={true}
                                form={form}
                                changedField={updatedField}
                                rules={[
                                  { required: true }
                                ]}>
                    <HebInput lang={"he"}
                              dir={"rtl"}
                              cssType={"circled"}
                              placeholder={textWithoutNikkudotPlaceholder}/>
                  </HebForm.Item>
                </Col>
              </Row>
            </HebForm.Item>
          </HebForm.Item>

          <hr style={{border: "none", marginLeft: "-1.5rem", height: ".125rem", width: "calc(100% + 3rem)", background: "#75ECF9"}}/>
        </Col>
        <Col span={ 24 } 
             className="exercise__american-question__wrong-answers">
          <HebForm.Item label={ <h3>{ wrongAnswersLabel }</h3> }
                     tooltip={ wrongAnswersTooltip }
                     labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}} >
            <hr style={{border: "none", marginLeft: "-1.5rem", height: ".125rem", width: "calc(100% + 3rem)", background: "#75ECF9"}}/>
            <HebForm.Item label={ formState.showWithoutNikkudot
                               ? textWithoutNikkudotLabel 
                               : textWithNikkudotLabel }
                       required={ true }
                       labelCol={{span: 24, style: {marginLeft: "auto", textAlign: "right"}}} >
              <Row gutter={[8, 8]}>
                <WrongAnswersList content={wrongAnswers || [{}, {}, {}, {}]}
                                  taskIndex={taskIndex}
                                  quesitonIndex={questionIndex}
                                  exerciseIndex={exerciseIndex}/>
              </Row>
            </HebForm.Item>
          </HebForm.Item>
        </Col>
      </Row>
    </div>
  );
};

export const TeacherForm = ({
                              taskIndex,
                              _id = "",
                              __t = ExerciseType.AmericanQuestions,
                              questions = [
                                {
                                  question: {}
                                }
                              ],
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

  const hasQuestionFormError = useCallback((questionIndex) => {
    const fieldNameTemplate = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions[${questionIndex}]`;
    return form.getFieldsError()
               .find(fieldError => fieldError.errors.length && fieldError.name.some(fieldName => fieldName.startsWith(fieldNameTemplate)));
  }, [form, taskIndex, exerciseIndex]);


  const addQuestion = useCallback(() => {
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
        questions: [...questions, {}]
      });
      setCurrentQuestion(questions.length || 0);
    },
    [questions, __t, updateExerciseByTaskIndexAndExerciseType, taskIndex]);
  const removeCurrentQuestion = useCallback(() => {
      const newQuestions = questions.filter((_,
                                             index) => index !== currentQuestion)
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
        questions: newQuestions
      });
      form.resetFields(ObjectUtil.getLeaves(lesson));
      setCurrentQuestion(currentQuestion >= newQuestions.length ? newQuestions.length - 1 : currentQuestion);
    },
    [updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, questions, form, lesson, currentQuestion]);

  const updateQuestion = useCallback((updatedQuestionIndex) => (updatedQuestion) => {
                                       updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
                                         questions: questions.map((question,
                                                                   questionIndex) => questionIndex === updatedQuestionIndex
                                           ? assign({}, question, updatedQuestion)
                                           : question)
                                       });
                                     },
                                     [updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, questions]);

  const list = questions.map((question, questionIndex) => (
    <QuestionItem key={questionIndex}
                  onChange={updateQuestion(questionIndex)}
                  exerciseIndex={exerciseIndex}
                  questionIndex={questionIndex}
                  taskIndex={taskIndex}
                  {...question}
    />));

  useEffect(() => {
    setCurrentQuestion(oldState => questions?.length === 0 ? 0 : oldState);
    questions?.length === 0 && (removeExercise(taskIndex, exerciseIndex));
  }, [exerciseIndex, questions?.length, removeExercise, taskIndex]);

  const questionType = t(`entities.american_question`);

  const addQuestionButtonTitle = t("actions.add_new.entity.male",
                                   { entity: questionType.toLowerCase() });
  const addQuestionButtonTooltip = t("tooltips.press_to_action",
                                     { action: addQuestionButtonTitle.toLowerCase() });

  const removeQuestionButtonLabel = t("actions.remove.entity",
                                      { entity: questionType.toLowerCase() });
  const removeQuestionButtonTooltip = t("tooltips.press_to_action",
                                        { action: removeQuestionButtonLabel.toLowerCase() });
  return (
    <div style={{width: "100%"}}>
      <Row>
        <Col span={21} hidden={exerciseIndex < 0}>
          <HebCard>
            <Row>
              {!(exerciseIndex < 0) &&
              list.map((questionForm, questionIndex) => (
                <Col xs={24}
                     key={questionIndex}
                     hidden={questionIndex !== currentQuestion}>
                  {questionForm}
                </Col>
              ))
              }
              <Col span={24}>
                <Row gutter={[36, 8]}>
                  <Col xs={24} md={12} hidden={!list.length}>
                    <Tooltip placement="top"
                             title={nl2br(removeQuestionButtonTooltip)}>
                      <HebButton block buttonSize="small" indicatorLine={false} onClick={removeCurrentQuestion}>
                        {nl2br(removeQuestionButtonLabel)}
                      </HebButton>
                    </Tooltip>
                  </Col>
                  <Col xs={24} md={12}>
                    <HebTooltip placement="top"
                                title={addQuestionButtonTooltip}>
                      <HebButton block onClick={addQuestion} indicatorLine={false} buttonSize="small">
                        {nl2br(addQuestionButtonTitle)}
                      </HebButton>
                    </HebTooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </HebCard>
        </Col>
        <Col span={3} hidden={!list.length || exerciseIndex < 0} className="exercise__american-question__stepper">
          <HebSteps direction="vertical" type="navigation" current={currentQuestion} onChange={setCurrentQuestion}>
            {
              list.map((_, questionIndex) => (
                <HebSteps.Step status={
                  hasQuestionFormError(questionIndex)
                    ? "error"
                    : currentQuestion === questionIndex ? "process"
                                                        : "finish"} key={questionIndex}/>))
            }
          </HebSteps>
        </Col>
      </Row>
    </div>
  );
};

 TeacherForm;