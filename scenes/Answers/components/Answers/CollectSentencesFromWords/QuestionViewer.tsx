import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { StringUtil } from "../../../../../util";
import { Col, Divider, Row } from "antd";
import { HebTypography } from "../../../../../components/HebElements";

export const QuestionViewer = ({
                                 sentence,
                                 questionIndex,
                                 answer
                               }) => {
  const {t} = useTranslation();

  const studentAnswerLabel: string = t("pages.lesson.form.tasks.exercises.student_answer.simple");
  const originalSentenceLabel: string = t("pages.lesson.form.tasks.exercises.sentence.simple");

  const [correctWordList] = useState<string[]>(StringUtil.convertSentenceToWordArray(sentence.he || ""));
  const [studentWordList] = useState<string[]>(StringUtil.convertSentenceToWordArray(answer || ""));
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={22}>
          <Row>
            <Col xs={4}>
              <HebTypography.Text strong>{originalSentenceLabel}:</HebTypography.Text>
            </Col>
            <Col xs={20}>
              <HebTypography.Paragraph lang="he"
                                    dir="rtl"
                                    style={{textAlign: "right", marginBottom: 5}}>
                {sentence.he}
              </HebTypography.Paragraph>
            </Col>
          </Row>
          <Row>
            <Col xs={5}>
              <HebTypography.Text strong>{studentAnswerLabel}:</HebTypography.Text>
            </Col>
            <Col xs={19}>
              <HebTypography.Paragraph lang="he"
                                    dir="rtl"
                                    style={{textAlign: "right", marginBottom: 5}}>
                { studentWordList.map((word, wordIndex) => (
                  <span style={{
                    color: correctWordList[wordIndex] === word ? "#1e9c73"
                      : "#de9b16"
                  }}>{`${word} `}</span>
                ))
                }
              </HebTypography.Paragraph>
            </Col>
          </Row>
        </Col>
        <Col xs={2}>
          <HebTypography.Paragraph lang="he">
            .{questionIndex + 1}
          </HebTypography.Paragraph>
        </Col>
      </Row>
      <Divider />
    </>
  );
}