import React, { useCallback, useEffect, useState } from "react";
import { Col, Row, Tooltip } from "antd";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";

import { HebButton, HebCard, HebForm, HebSteps, HebTextArea, HebTooltip } from "../../../../../components/HebElements";
import { ObjectUtil } from "../../../../../util";
import { LocalizedContent } from "../../../../../types";
import { ExerciseType } from "../../../../../constants";
import { useLessonForm } from "../../../../../providers";

class QuestionItemFormProps {
  questionContent: LocalizedContent;
  fieldName: string;
}

const QuestionItemForm = ({questionContent = {he_nikkudot: "", he: ""}, fieldName}: QuestionItemFormProps) => {
  return (
    <Row>
      <Col xs={24}>
        <HebForm.Item name={`${fieldName}.he_nikkudot`}
                      className="exercise__text-questions__question"
                      initialValue={questionContent.he_nikkudot}
                      required={true}
                      rules={[
                        { required: true }
                      ]}
        >
          <HebTextArea lang={"he"}
                       dir={"rtl"}/>
        </HebForm.Item>
      </Col>
    </Row>
  )
}

class TeacherFormProps {
  taskIndex: number;
  exerciseIndex: number;
  questions: LocalizedContent[];
  __t: string;
}

export const TeacherForm = ({
                              taskIndex,
                              exerciseIndex,
                              questions = [{he_nikkudot: "", he: ""}],
                              __t = ExerciseType.TextQuestions
}: TeacherFormProps) => {
  const {t} = useTranslation();
  const {
    lesson,
    form,
    removeExercise,
    updateExerciseByTaskIndexAndExerciseType
  } = useLessonForm();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const contentFieldsPrefix = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions`;

  const questionType = t(`entities.text_question`);
  const addQuestionButtonTitle = t("actions.add_new.entity.male",
    { entity: questionType.toLowerCase() });
  const addQuestionButtonTooltip = t("tooltips.press_to_action",
    { action: addQuestionButtonTitle.toLowerCase() });
  const removeQuestionButtonLabel = t("actions.remove.entity",
    { entity: questionType.toLowerCase() });
  const removeQuestionButtonTooltip = t("tooltips.press_to_action",
    { action: removeQuestionButtonLabel.toLowerCase() });

  const addQuestion = useCallback(() => {
    let newQuestions: LocalizedContent[] = questions;
    newQuestions.push({he_nikkudot: "", he: ""} as LocalizedContent);
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, { questions: newQuestions });
    setCurrentQuestion(newQuestions.length - 1 || 0);
    form.resetFields(ObjectUtil.getLeaves(lesson));
  }, [questions, __t, updateExerciseByTaskIndexAndExerciseType, taskIndex]);
  const removeCurrentQuestion = useCallback(() => {
    const newQuestions: LocalizedContent[] = questions.filter((_, index) => index !== currentQuestion)
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, { questions: newQuestions });
    form.resetFields(ObjectUtil.getLeaves(lesson));
    setCurrentQuestion(currentQuestion >= newQuestions.length ? newQuestions.length - 1 : currentQuestion);
  }, [updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, questions, form, lesson, currentQuestion]);
  const hasQuestionFormError = useCallback((questionIndex) => {
    const fieldNameTemplate = `tasks[${taskIndex}].exercises[${exerciseIndex}].questions[${questionIndex}]`;
    return form.getFieldsError()
               .find(fieldError => fieldError.errors.length && fieldError.name.some(fieldName => fieldName.startsWith(fieldNameTemplate)));
  }, [form, taskIndex, exerciseIndex]);

  useEffect(() => {
    setCurrentQuestion(oldState => questions?.length === 0 ? 0 : oldState);
    questions?.length === 0 && (removeExercise(taskIndex, exerciseIndex));
  }, [exerciseIndex, questions?.length, removeExercise, taskIndex]);

  const questionFormList = questions.map((questionContent, questionIndex) => (
    <React.Fragment key={questionIndex}>
      <QuestionItemForm questionContent={questionContent}
                        fieldName={`${contentFieldsPrefix}[${questionIndex}]`}
      />
    </React.Fragment>
  ))

  return (
    <div style={{width: "100%"}}>
      <Row>
        <Col span={21} hidden={exerciseIndex < 0}>
          <HebCard>
            {questionFormList.length > 0 && questionFormList.map((content, contentIndex) => (
              <Row>
                <Col xs={24} hidden={contentIndex !== currentQuestion}>
                  {content}
                </Col>
              </Row>
            ))}
            <Col span={24}>
              <Row gutter={[36, 8]}>
                <Col xs={24} md={12} hidden={!questionFormList.length}>
                  <Tooltip placement="top"
                           title={nl2br(removeQuestionButtonTooltip)}>
                    <HebButton block buttonSize="small" indicatorLine={false}
                               onClick={removeCurrentQuestion} className="exercise__text-questions__remove-question">
                      {nl2br(removeQuestionButtonLabel)}
                    </HebButton>
                  </Tooltip>
                </Col>
                <Col xs={24} md={12}>
                  <HebTooltip placement="top"
                              title={addQuestionButtonTooltip}>
                    <HebButton block onClick={addQuestion} indicatorLine={false}
                               buttonSize="small" className="exercise__text-questions__add-question">
                      {nl2br(addQuestionButtonTitle)}
                    </HebButton>
                  </HebTooltip>
                </Col>
              </Row>
            </Col>
          </HebCard>
        </Col>
        <Col className="exercise__text-questions__stepper" span={3} hidden={!questionFormList.length || exerciseIndex < 0}>
          <HebSteps direction="vertical" type="navigation" current={currentQuestion} onChange={setCurrentQuestion}>
            {
              questionFormList.map((_, questionIndex) => (
                <HebSteps.Step status={hasQuestionFormError(questionIndex)
                                       ? "error"
                                       : currentQuestion === questionIndex ? "process"
                                         : "finish"}
                               key={questionIndex}/>))
            }
          </HebSteps>
        </Col>
      </Row>
    </div>
  )
}