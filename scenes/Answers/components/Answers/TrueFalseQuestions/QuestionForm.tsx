import React from "react";
import { useTranslation } from "next-i18next";
import { UserRole } from "../../../../../constants";
import { Badge, Col, Row, Space } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { HebTypography } from "../../../../../components/HebElements";

export const QuestionForm = ({
                               userRole,
                               isTrue,
                               correctAnswer,
                               questionIndex,
                               question
                             }) => {
  const {t} = useTranslation();
  const isIstTrueStudentAnswerLabel = userRole === UserRole.STUDENT
                                      ? t("pages.answer.student_answers.my_answer")
                                      : t("pages.answer.student_answers.single");
  const correctAnswerLabel = t("pages.answer.correct.label");
  const wrongAnswerLabel = t("pages.answer.incorrect.label");
  return (
    <Row>
      <Col xs={24}>
        <Badge.Ribbon text={correctAnswer === isTrue
          ? <>
            <Space>
              <CheckCircleOutlined />
              {correctAnswerLabel}
            </Space>
          </>
          : <>
            <Space>
              <CloseCircleOutlined />
              {wrongAnswerLabel}
            </Space>
          </>}
                      placement="start"
                      color={correctAnswer === isTrue ? "#1e9c73" : "#de9b16"}>
          <Row gutter={[8, 8]}
               style={{paddingTop: 34, paddingLeft: 4}}>
            <Col xs={0} md={4}>
              <HebTypography.Text>{`${isIstTrueStudentAnswerLabel}: `}</HebTypography.Text>
              <HebTypography.Text strong>
                {isTrue ? t("pages.answer.correct.boolean") : t("pages.answer.incorrect.boolean")}
              </HebTypography.Text>
            </Col>
            <Col xs={20} md={18}>
              <HebTypography.Paragraph dir="rtl"
                                    lang="he"
                                    style={{
                                      textAlign: "right",
                                      padding: 0,
                                      margin: 0
                                    }}>
                {question?.he_nikkudot || question?.he || ""}
              </HebTypography.Paragraph>
            </Col>
            <Col xs={4} md={2}
                 style={{textAlign: "right"}}>
              <HebTypography.Text lang="he">
                {`(${questionIndex + 1}`}
              </HebTypography.Text>
            </Col>
            <Col xs={20} md={0}>
              <HebTypography.Text>{`${isIstTrueStudentAnswerLabel}: `}</HebTypography.Text>
              <HebTypography.Text strong>
                {isTrue ? t("pages.answer.correct.boolean")
                        : t("pages.answer.incorrect.boolean")}
              </HebTypography.Text>
            </Col>
          </Row>
        </Badge.Ribbon>
      </Col>
    </Row>
  );
}