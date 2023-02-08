import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons";
import { Col, Collapse, List, Row, Space, Tag, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { LessonType, TaskType, UserRole } from "../../../../constants";
import { Controls } from "./Controls";
import { useStudentTasksAnswersForm } from "../../../../providers";
import { StudentExerciseAnswerFactory, GameTaskStudentExerciseAnswerFactory } from "../Answers";

const BuilderAnswerFactory = {
  [TaskType.TextTask]: StudentExerciseAnswerFactory,
  [TaskType.GameTask]: GameTaskStudentExerciseAnswerFactory
}

const getConditionalResult = (condition: boolean, correctResult: any, wrongResult): any => {
  return condition ? correctResult : wrongResult;
}

export const StudentExerciseAnswerItem = ({
                                            answerContent,
                                            answerIndex,
                                            taskIndex,
                                            textTaskContent,
                                            reviewedBy,
                                            lessonType,
                                            taskType,
                                            role
                                          }) => {
  const {t} = useTranslation();
  const {
    handleTaskAnswerChange,
    studentTasksAnswers, getExerciseIndexByTaskIndexAndExerciseType} = useStudentTasksAnswersForm();

  const [isTouched, setIsTouched] = useState(false);
  useEffect(() => setIsTouched(!!reviewedBy), [reviewedBy]);

  const getAnswerStatus = useCallback((correctChild, incorrectChild, anyChild) => {
    const result = getConditionalResult(answerContent?.points > 0,
                                        correctChild,
                                        incorrectChild);
    if (isTouched) {
      return result;
    }
    if (answerContent?.exercise?.isAutomaticallyChecked) {
      if (role === UserRole.TEACHER && studentTasksAnswers.lesson?.type === LessonType.EXAM) {
        return anyChild;
      }
      return result;
    }
    return anyChild;
  }, [answerContent?.exercise, role, studentTasksAnswers?.lesson?.type, answerContent?.points, isTouched]);

  const getExerciseTitleByType = useCallback((type) => t(`pages.lesson.form.tasks.exercises.types.${type}.title`), [t]);
  const getCheckWayTitle = useCallback(value => value ? t("enums.checkWay.automatically.title")
    : t("enums.checkWay.manually.title"), [t]);
  const getIsCorrectAnswer = useCallback(() => getAnswerStatus(t("pages.answer.form.answer.correct.label"),
                                                                      t("pages.answer.form.answer.incorrect.label"),
                                                                      t("pages.answer.form.answer.unchecked.label")), [getAnswerStatus, t]);

  useEffect(() => {
    (!answerContent?.exercise?.isAutomaticallyChecked && !reviewedBy)
    && handleTaskAnswerChange([{name: `answers[${answerIndex}].points`, value: 1}]);
  }, [answerIndex, reviewedBy]);

  return (
    <List.Item key={answerIndex}>
      <Collapse bordered={false}
                expandIconPosition="right"
                defaultActiveKey={role !== UserRole.STUDENT
                  ? getConditionalResult(answerContent?.exercise?.isAutomaticallyChecked === true,
                                         "hidden",
                                         "exercise")
                  : getConditionalResult(answerContent.points > 0,
                                         "hidden",
                                         "exercise")
                }
                style={{backgroundColor: "inherit"}} >
        <Collapse.Panel header={
          <Row justify="space-between">
            <Col>
              <Typography.Title level={4}>{getExerciseTitleByType(answerContent?.exercise?.__t)}</Typography.Title>
            </Col>
            <Col>
              <Row gutter={8}>
                <Col>
                  { answerContent.teacherComment && <MessageOutlined  style={{ color: '#000000' }} />}
                </Col>
                <Col>
                  <Tag style={{background: "rgb(222,219,219)"}}
                       color={getAnswerStatus("success",
                         "error",
                         "warning")}
                       icon={getAnswerStatus(<CheckCircleOutlined />, <CloseCircleOutlined />, <ExclamationCircleOutlined />)} >
                    { getIsCorrectAnswer() }
                  </Tag>
                </Col>
                <Col hidden>{ getCheckWayTitle(answerContent?.exercise?.isAutomaticallyChecked) }</Col>
              </Row>
            </Col>
          </Row>
        }
                        key="exercise"
                        style={{border: 0, marginLeft: -16}}>
          { answerContent
            && BuilderAnswerFactory[taskType].buildExerciseAnswerComponent(answerContent?.__t,
              answerContent?.exercise?.__t,
              {
                ...answerContent?.exercise,
                taskIndex,
                content: textTaskContent,
                task: studentTasksAnswers.lesson?.tasks[taskIndex],
                exerciseIndex: getExerciseIndexByTaskIndexAndExerciseType(taskIndex, answerContent?.exercise?.__t)
              }, answerContent)
          }
          <Space direction="vertical"
                 style={{width: "100%", marginTop: 8}} >
            <Controls role={role}
                      isTouched={isTouched}
                      setIsTouched={setIsTouched}
                      answerContent={answerContent}
                      answerIndex={answerIndex}
                      handleTaskAnswerChange={handleTaskAnswerChange}
                      lessonType={lessonType}
                      reviewedBy={reviewedBy}
            />
          </Space>
        </Collapse.Panel>
      </Collapse>
    </List.Item>
  )
}