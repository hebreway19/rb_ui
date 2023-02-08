import { Col, Form, message, Row, Spin, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import nl2br from "react-nl2br";
import { HebPageHeader } from "../../../../components/HebElements/HebPageHeader";

import { LessonType, RoutePath, TaskType, UserRole } from "../../../../constants";
import { useStudentTasksAnswersForm } from "../../../../providers";
import { useAuth } from "../../../../shared/hooks";
import { StudentExerciseAnswerList } from "../StudentExerciseAnswerList";
import { StudentInfo } from "../StudentInfo";
import { TaskAnswerExtra } from "./TaskAnswerExtra";
import { TextTaskContentPreview } from "./TextTaskContentAnswerPreview";

const StudentTasksAnswersPage = ({role, ...props}) => {
  const {t} = useTranslation();
  const {user} = useAuth();
  const router = useRouter();
  const {
    studentTasksAnswers,
    formState,
    form,
    handleTaskAnswerChange,
    saveStudentTasksAnswers,
  } = useStudentTasksAnswersForm();

  const originalTextColumnTitle: string = t("pages.answer.original_text.title");
  const translationTextColumnTitle: string = t("pages.answer.translation_text.title");
  const exerciseColumnTitle: string = t("pages.answer.student_answers.title");
  const redirectMessageLabel = nl2br(t("messages.not_access.entity",
                                       {entity: t(`entities.lesson.${studentTasksAnswers.lesson?.type}`).toLowerCase()}));

  useEffect(() => {
    let newCorrectAnswerCount = 0;
    let totalScore = 0;
    studentTasksAnswers.answers.forEach(({points}) => {
      totalScore += points;
      newCorrectAnswerCount += points > 0 ? 1 : 0;
    });
  }, [studentTasksAnswers]);

  useEffect(() => {
    const redirectToAnswersPage = async () => {
      await message.warn(redirectMessageLabel);
      await router.push(RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.STUDENT()));
    }
    if (studentTasksAnswers.lesson?.type === LessonType.EXAM && user?.role === UserRole.STUDENT) {
      redirectToAnswersPage()
    }
  }, [])

  return (
    <div className="site-page-header-wrapper">
      <Spin spinning={!formState.didLoaded}>
        <Form form={form} onFinish={saveStudentTasksAnswers} layout="vertical" onFieldsChange={handleTaskAnswerChange}>
          <HebPageHeader style={{marginRight: -16}}
                         ghost={false}
                         title={<StudentInfo student={studentTasksAnswers?.student}
                                             role={role}
                                             lesson={studentTasksAnswers.lesson}
                                             isReviewed={studentTasksAnswers?.reviewedBy != null}/>}
                         extra={<TaskAnswerExtra role={role} />} />
          <Row gutter={[16, 16]} style={{paddingLeft: 16, paddingRight: 16, marginRight: 0, marginLeft: 0}} justify="center">
            <Col xs={24} md={12} hidden={role === UserRole.STUDENT}>
              <Row gutter={[0, 16]}>
                <Col xs={24}>
                   <Row justify="center" gutter={[16, 16]}>
                     <Col xs={24} md={12} hidden={!formState.isVisibleTranslate}>
                       <Typography.Title style={{margin: 0}} level={4}>{translationTextColumnTitle}</Typography.Title>
                     </Col>
                     <Col xs={24} md={formState.isVisibleTranslate ? 12 : 24}>
                       <Typography.Title style={{margin: 0}} level={4}>{originalTextColumnTitle}</Typography.Title>
                     </Col>
                   </Row>
                </Col>
                {
                  studentTasksAnswers.tasks.map(task => {
                    return (
                      <Col xs={24} key={task._id} hidden={task.__t !== TaskType.TextTask}>
                        <Row className="heb-text-black">
                          <Col xs={24}>
                            <TextTaskContentPreview formState={formState} lesson={studentTasksAnswers.lesson} mode="preview" task={task}/>
                          </Col>
                        </Row>
                      </Col>
                    );
                  })
                }
              </Row>
            </Col>
            <Col xs={24} hidden={role !== UserRole.STUDENT || !formState.textIsVisible}>
              <Row justify="center" gutter={8}>
                <Col xs={12} hidden={!formState.isVisibleTranslate}>
                  <Typography.Title level={4}>
                    {translationTextColumnTitle}
                  </Typography.Title>
                </Col>
                <Col xs={12}>
                  <Typography.Title level={4}>
                    {originalTextColumnTitle}
                  </Typography.Title>
                </Col>
                {
                  studentTasksAnswers.tasks.map(task => {
                    return (
                      <Row justify="center" key={task._id} hidden={task.__t !== TaskType.TextTask}>
                        <Col xs={formState.isVisibleTranslate ? 24 : 12}>
                          <TextTaskContentPreview formState={formState}
                                                  lesson={studentTasksAnswers.lesson}
                                                  task={task}
                                                  mode="preview"/>
                        </Col>
                      </Row>
                    );
                  })
                }
              </Row>
            </Col>
            <Col xs={24} md={role === UserRole.STUDENT ? 24 : 12} lg={12} hidden={role === UserRole.STUDENT && formState.textIsVisible}>
              <Row gutter={[0, 16]} style={{paddingBottom: 16}}>
                <Col xs={24}>
                  <Typography.Title level={4} style={{margin: 0}}>
                    {exerciseColumnTitle}
                  </Typography.Title>
                </Col>
                { studentTasksAnswers.tasks.map((task, taskIndex) => {
                      return (
                        <Col xs={24} key={task._id}>
                          <StudentExerciseAnswerList studentExerciseAnswers={studentTasksAnswers.answers}
                                                     taskIndex={taskIndex}
                                                     role={role}
                                                     reviewedBy={studentTasksAnswers?.reviewedBy}
                                                     currentLessonType={studentTasksAnswers.lesson?.type}
                                                     taskType={task.__t}
                                                     textTaskContent={task.content}/>
                        </Col>
                      );
                    })
                }
              </Row>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  )
}

export default StudentTasksAnswersPage;