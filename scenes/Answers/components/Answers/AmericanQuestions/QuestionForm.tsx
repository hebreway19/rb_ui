import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { LocalizedContent } from "../../../../../types";
import { Badge, Card, Col, Row } from "antd";
import { HebCard, HebTypography } from "../../../../../components/HebElements";

export const QuestionForm = ({
                        answer,
                        question,
                        correctAnswer,
                        wrongAnswers
                      }) => {
  const {t} = useTranslation();

  const [answerList, setAnswersList] = useState<any[]>([]);

  const studentCardGridTitle: string = t("pages.answer.student_answers.single");
  const correctCardGridTitle: string = t("pages.answer.correct.single");

  const getAnswerContentBlock = (answerContent: LocalizedContent) => (
    <div style={{ padding: "2.125rem 1.5rem .875rem 1.5rem" }}
         lang="he"
         dir="rtl">
      {answerContent?.he_nikkudot || answerContent?.he}
    </div>
  );
  const getCorrectStudentAnswerComponent = (answerContent: LocalizedContent) => (
    <Badge.Ribbon text={correctCardGridTitle}
                  placement="end">
      <Badge.Ribbon text={studentCardGridTitle}
                    placement="start"
                    color={"#1e9c73"} >
        {getAnswerContentBlock(answerContent)}
      </Badge.Ribbon>
    </Badge.Ribbon>
  );
  const getCorrectTeacherAnswerComponent = (answerContent: LocalizedContent) => (
    <Badge.Ribbon text={correctCardGridTitle}
                  placement="end"
                  color={"#1e9c73"} >
      {getAnswerContentBlock(answerContent)}
    </Badge.Ribbon>
  );
  const getWrongStudentAnswerComponent = (answerContent: LocalizedContent) => (
    <Badge.Ribbon text={studentCardGridTitle}
                  placement="start"
                  color={"#de9b16"} >
      {getAnswerContentBlock(answerContent)}
    </Badge.Ribbon>
  );
  const checkCorrectAndReturnResult = (correctAnswerHeNikkudot: string,
                                       studentAnswerHeNikkudot: string,
                                       currentAnswerHeNikkudot: string) => {
    let result = getAnswerContentBlock;
    if (currentAnswerHeNikkudot === correctAnswerHeNikkudot) {
      result = getCorrectTeacherAnswerComponent;
      if (currentAnswerHeNikkudot === studentAnswerHeNikkudot) {
        result = getCorrectStudentAnswerComponent;
      }
    }
    if (currentAnswerHeNikkudot === studentAnswerHeNikkudot) {
      result = getWrongStudentAnswerComponent;
    }
    return result;
  }
  const getListItem = (answerContent) => (
    <Card.Grid style={{width: "100%", padding: 0}}>
      { checkCorrectAndReturnResult(correctAnswer?.he_nikkudot,
        answer?.he_nikkudot,
        answerContent?.he_nikkudot)
      (answerContent)
      }
    </Card.Grid>
  )


  useEffect(() => {
    const unshuffledAnswersList = [...(wrongAnswers || []), correctAnswer];
    setAnswersList(unshuffledAnswersList);
  }, [wrongAnswers, correctAnswer]);

  return (
    <HebCard bordered={false}
             title={
               <Row dir="rtl">
                 <Col xs={24}>
                   <HebTypography.Title level={5}
                                        dir="rtl"
                                        lang="he"
                                        style={{ textAlign: "right" }}>
                     {question?.he_nikkudot || question?.he || "he_nikkudot"}
                   </HebTypography.Title>
                 </Col>
               </Row>
             }>
      {answerList.map((answerContent, answerIndex) => (
        <React.Fragment key={answerIndex}>
          {getListItem(answerContent)}
        </React.Fragment>))
      }
    </HebCard>
  );
}