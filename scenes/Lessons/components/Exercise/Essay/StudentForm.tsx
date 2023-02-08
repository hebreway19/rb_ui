import React, { useCallback } from "react";
import { EssayAnswer, LocalizedContent } from "../../../../../types";
import { Col, Row } from "antd";
import { HebButton, HebForm, HebTextArea, HebTypography } from "../../../../../components/HebElements";
import { StudentAnswerType } from "../../../../../constants";
import { useTranslation } from "next-i18next";
import { StringUtil } from "../../../../../util";

class StudentFormProps {
  essayThemeTitleList: LocalizedContent[];
  answer: EssayAnswer;
  setAnswer: any
}
export const StudentForm = ({
                              essayThemeTitleList = [],
                              answer = { selectedEssayTheme: 0, answer: {he_nikkudot: "", he: ""} },
                              setAnswer
                            }: StudentFormProps): JSX.Element => {
  const {t} = useTranslation();
  const essayThemeTitleFieldTitle = t("pages.lesson.form.tasks.exercises.essayThemeTitle.label");
  const updateAnswerTheme = useCallback((index) => {
    setAnswer(oldAnswer => ({...oldAnswer, selectedEssayTheme: index}));
  }, [])
  const updateAnswerText = useCallback(({target: {value}}) => {
    setAnswer(oldAnswer => ({
                              ...oldAnswer,
                              answer: {
                                he_nikkudot: value,
                                he: StringUtil.removeNikkudots(value)
                              },
                              __t: StudentAnswerType.Essay
                            }));
  }, []);

  return (
    <Row>
      <Col xs={24}>
        <HebTypography.Paragraph style={{paddingLeft: 27, paddingRight: 27}}>
          {essayThemeTitleFieldTitle}
        </HebTypography.Paragraph>
      </Col>
      <Col xs={24}>
        <Row dir="rtl"
             lang="he"
             gutter={[8, 8]}
             justify="center"
             style={{paddingLeft: 27, paddingRight: 27, paddingBottom: 16}}>
          {essayThemeTitleList.map((itemValue: LocalizedContent, itemIndex: number) => (
            <Col key={itemIndex}>
              <div style={{
                width: "100%",
                backgroundColor: itemIndex === answer.selectedEssayTheme ? "rgba(94, 209, 227, 0.79)" : "#737390",
                cursor: "pointer",
                color: "#ffffff",
                direction: "rtl",
                textAlign: "center",
                padding: "0.5rem 1rem",
                border: ".125rem solid #75ECF9"
              }} onClick={() => updateAnswerTheme(itemIndex)} >
                {itemValue?.he_nikkudot.toUpperCase() || itemValue?.he.toUpperCase() || ""}
              </div>
            </Col>
          ))}
        </Row>
      </Col>
      <Col xs={24}>
        <HebForm.Item initialValue={answer?.answer?.he_nikkudot}
                      value={answer?.answer?.he_nikkudot}>
          <HebTextArea dir={"rtl"}
                       onChange={updateAnswerText}
                       rows={25}
                       value={answer?.answer?.he_nikkudot}
                       lang={"he"}/>
        </HebForm.Item>
      </Col>
    </Row>
  );
}