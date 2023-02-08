import React from "react";
import { Badge } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { HebCard, HebTypography } from "../../../../../components/HebElements";
import { useTranslation } from "next-i18next";


const isValidNode = (node) => true;

export const ParagraphComponent = ({parser, sourceHtmlProcessingInstructions, currentValue, isCorrectAnswer}) => {
  const {t} = useTranslation();
  return (
    <Badge.Ribbon
      text={
        isCorrectAnswer ? (<><CheckCircleOutlined/> {t("pages.answer.correct.label")}</>)
                        : (<><CloseCircleOutlined/> {t("pages.answer.incorrect.label")}</>)
      }
      placement="start"
      color={
        isCorrectAnswer ? "#1e9c73"
                        : "#de9b16"
      }>
      <HebCard style={{
        width: "100%",
        cursor: "inherit",
        zIndex: 100000
      }}
               bordered={true}
               bodyStyle={{padding: "32px 24px 24px 24px"}}>
        <HebTypography.Paragraph align="justify"
                                 dir="rtl"
                                 lang="he"
                              style={{
                                padding: 0,
                                marginBottom: -16
                              }}>
          {parser.parseWithInstructions(currentValue?.he_nikkudot,
            isValidNode,
            sourceHtmlProcessingInstructions)
          }
        </HebTypography.Paragraph>
      </HebCard>
    </Badge.Ribbon>
  );
}