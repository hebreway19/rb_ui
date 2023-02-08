import { Col, List, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  GameTaskAnswersTypes,
  LessonType,
  StudentAnswerType,
  TaskType,
} from "../../../../constants";
import { StudentExerciseAnswerItem } from "./ListItem";
import { useTranslation } from "next-i18next";
import { FileListItem } from "./FileListItem";
import { useMediaQuery } from "react-responsive";
import { useStudentTasksAnswersForm } from "../../../../providers";

const filterOptionsBuilder = {
  [TaskType.TextTask]: StudentAnswerType,
  [TaskType.GameTask]: GameTaskAnswersTypes
}

export const checkAnswersOnFile = (answerList = []) => {
  return !(answerList.every(answer => answer?.__t !== StudentAnswerType.File))
}

export const StudentExerciseAnswerList = ({studentExerciseAnswers, taskIndex, textTaskContent, reviewedBy, currentLessonType, role, taskType}) => {
  const {t} = useTranslation()
  const isFileAnswers = checkAnswersOnFile(studentExerciseAnswers);
  const {sortAnswer} = useStudentTasksAnswersForm();
  const [totalScore, setTotalScore] = useState(0);
  useEffect(() => {
    sortAnswer();
  }, []);
  useEffect(() => {
    const totalPoints = studentExerciseAnswers.map(answer => answer?.points || 0)
      .reduce((acc, answerPoints) => acc + answerPoints, 0)
    setTotalScore(totalPoints);
  }, [studentExerciseAnswers]);
  const totalPointsLabel = t("pages.lesson.form.tasks.exercises.total_score.label");
  const isMobile = useMediaQuery({query: "(max-width: 768px)"});
  return (
    <>
      { studentExerciseAnswers
      && <List className="heb-text-black" itemLayout="vertical"
               style={{
                 background: "#C2C4CB",
                 border: ".1875rem solid #75ECF9",
                 borderRadius: "1.9375rem",
                 padding: "1rem",
                 overflow: "auto",
                 minHeight: isMobile ? "20.5rem" : "30.3125rem",
                 height: isMobile ? "20.5rem" : "calc(100vh - 10.25rem)",
                 maxHeight: isMobile ? "20.5rem" : "calc(100vh - 10.25rem)"
               }}
               dataSource={studentExerciseAnswers}
               renderItem={(answer: any, index) => (
                 <React.Fragment key={index}>
                   { isFileAnswers ?
                     <FileListItem answerContent={answer}
                                   answerIndex={index}
                                   key={index}
                                   role={role}
                                   reviewedBy={reviewedBy}
                                   lessonType={currentLessonType}
                     />
                     : Object.values(filterOptionsBuilder[taskType]).includes(answer?.__t) &&
                       <StudentExerciseAnswerItem answerContent={answer}
                                                  answerIndex={index}
                                                  key={index}
                                                  role={role}
                                                  reviewedBy={reviewedBy}
                                                  taskIndex={taskIndex}
                                                  taskType={taskType}
                                                  textTaskContent={textTaskContent}
                                                  lessonType={currentLessonType} />
                   }
                 </React.Fragment>
               )}
      />
      }
      <Row hidden={currentLessonType !== LessonType.EXAM}>
        <Col>
          <Typography.Text>
            <Typography.Text strong>{totalPointsLabel}: </Typography.Text>
            {totalScore}
          </Typography.Text>
        </Col>
      </Row>
    </>
  )
}