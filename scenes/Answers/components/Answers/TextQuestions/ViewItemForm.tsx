import React from "react";
import { useTranslation } from "next-i18next";
import { Col, Row } from "antd";
import { HebTypography } from "../../../../../components/HebElements/HebTypography";
import { LocalizedContent } from "../../../../../types";

class ViewItemFormProp {
  question: LocalizedContent;
  questionIndex: number;
  studentAnswer: LocalizedContent;
}

export const ViewItemForm = ({
                               question,
                               questionIndex,
                               studentAnswer,
                             }: ViewItemFormProp) => {
  const {t} = useTranslation();
  const questionItemLabel = t("pages.lesson.form.tasks.exercises.questions.item_label");
  const answerLabel = t("entities.answer.answer");
  return (
    <Row gutter={[0, 16]}>
      <Col xs={4}>
        <HebTypography.Text>
          {questionItemLabel}{questionIndex + 1}:
        </HebTypography.Text>
      </Col>
      <Col xs={20} dir={"rtl"} style={{textAlign: "right"}} >
        <HebTypography.Text dir={"rtl"}
                            lang={"he"}
        >
          {question?.he_nikkudot || question?.he}
        </HebTypography.Text>
      </Col>
      <Col xs={4}>
        <HebTypography.Text>
          {answerLabel}:
        </HebTypography.Text>
      </Col>
      <Col xs={20} dir={"rtl"} style={{textAlign: "right"}}>
        <HebTypography.Text dir={"rtl"}
                            lang={"he"}
        >
          {studentAnswer?.he_nikkudot || studentAnswer?.he}
        </HebTypography.Text>
      </Col>
    </Row>
  )
}