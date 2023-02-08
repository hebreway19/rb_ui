import { Col, Row, Space, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { StudentAnswerType } from "../../../../../constants";
import { HebCard, HebForm, HebInput } from "../../../../../components/HebElements";

export const StudentForm = ({_id, __t, answer = {answer: ""}, mode, setAnswer, commitAnswer, ...props}) => {

  const {t} = useTranslation()
  const [answerText, setAnswerText] = useState(answer?.answer || "");

  const exerciseTitle = t("pages.lesson.form.tasks.exercises.types.GiveTitleTextExercise.title");
  const inputPlaceholder = t("pages.lesson.form.tasks.exercises.input.placeholder");
  const studentAnswerTitle = t("pages.lesson.form.tasks.exercises.student_answer.title");

  const updateAnswerText = useCallback(({target: {value}}) => {
    setAnswer({...answer, answer: value, __t: StudentAnswerType.GiveTitleTextStudentAnswer});
  }, []);

  useEffect(() => {
    setAnswerText(answer?.answer || "");
  }, [answer]);
  return (
    <HebCard title={mode === "view" ? null : exerciseTitle}
          bordered={false}
          headStyle={{color: "#ffffff"}}>
      <Space direction="vertical"
             style={{width: "100%"}}>
        <Row hidden={mode === "view"}>
          <Col xs={24}>
            <HebForm.Item title="Title text"
                       initialValue={answerText}
                       value={answerText}
                       rules={[
                         {required: true}
                       ]}>
              <HebInput placeholder={inputPlaceholder}
                     dir="rtl"
                     lang="he"
                     size="large"
                        cssType="primary"
                     className="input_hebrew-text"
                     defaultValue={answerText}
                     disabled={mode === "view"}
                     value={answerText}
                     onChange={updateAnswerText}/>
            </HebForm.Item>
          </Col>
        </Row>
        <Row hidden={mode !== "view"}>
          <Col xs={24} >
            <Typography.Text strong>
              {`${studentAnswerTitle}:`}
            </Typography.Text>
          </Col>
          <Col xs={24} style={{textAlign: "right"}}>
            <Typography.Paragraph dir="rtl"
                                  lang="he">
              {answerText}
            </Typography.Paragraph>
          </Col>
        </Row>
      </Space>
    </HebCard>
  )
};

 StudentForm;