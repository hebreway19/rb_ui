import React from "react";
import { useTranslation } from "next-i18next";
import { Col, Row } from "antd";

import { EssayAnswer, LocalizedContent } from "../../../../../types";
import { HebTypography } from "../../../../../components/HebElements";

class EssayFormProps {
  essayThemeTitleList: LocalizedContent[];
  answer: EssayAnswer;
}

export const EssayForm = ({essayThemeTitleList, answer}: EssayFormProps) => {
  const {t} = useTranslation();

  const essayThemeTitleFieldTitle: string = t("pages.lesson.form.tasks.exercises.essayThemeTitle.label");
  const answerLabel: string = t("entities.answer.answer");

  return (
    <Row>
      <Col xs={24}>
        <HebTypography.Paragraph>
          {essayThemeTitleFieldTitle}:
        </HebTypography.Paragraph>
      </Col>
      <Col xs={24}>
        <HebTypography.Paragraph dir="rtl"
                                 lang="he">
          {essayThemeTitleList[answer?.selectedEssayTheme]?.he_nikkudot || essayThemeTitleList[answer?.selectedEssayTheme]?.he || ""}
        </HebTypography.Paragraph>
      </Col>
      <Col xs={24}>
        <HebTypography.Paragraph>
          {answerLabel}:
        </HebTypography.Paragraph>
      </Col>
      <Col xs={24}>
        <HebTypography.Paragraph dir="rtl"
                                 lang="he">
          {answer?.answer?.he_nikkudot || answer?.answer?.he}
        </HebTypography.Paragraph>
      </Col>
    </Row>
  );
};