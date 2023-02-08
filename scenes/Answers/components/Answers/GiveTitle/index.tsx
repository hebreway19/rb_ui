import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { HebCard, HebTypography } from "../../../../../components/HebElements";
import { Col, Row, Space } from "antd";

export const GiveTitleForm = ({answer}) => {
  const {t} = useTranslation();

  const [answerText] = useState<string>(answer.answer || "");

  const studentAnswerTitle = t("pages.lesson.form.tasks.exercises.student_answer.title");

  return (
    <HebCard bordered={false}
             headStyle={{color: "#ffffff"}}>
      <Space direction="vertical"
             style={{width: "100%"}}>
        <Row>
          <Col xs={24} >
            <HebTypography.Text strong>
              {`${studentAnswerTitle}:`}
            </HebTypography.Text>
          </Col>
          <Col xs={24} style={{textAlign: "right"}}>
            <HebTypography.Paragraph dir="rtl"
                                     lang="he">
              {answerText}
            </HebTypography.Paragraph>
          </Col>
        </Row>
      </Space>
    </HebCard>
  )
}