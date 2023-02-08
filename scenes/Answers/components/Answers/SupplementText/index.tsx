import React from "react";
import { useTranslation } from "next-i18next";
import { Card, Divider } from "antd";
import { HebTypography } from "../../../../../components/HebElements";
import { exerciseParserInstructionsForParagraphs } from "../../../../Lessons/components/Exercise/ExerciseParserInstructionsForParagraphs";
import { Parser } from "html-to-react";
import { useLessonForm } from "../../../../../providers";

const parser = new Parser();
const isValidNode = (node) => true;

export const SupplementTextFrom = ({
                                     paragraphs = [],
                                     task = {content: []},
                                     answer = {answer: ""},
                                 isStart
                               }) => {
  const {t} = useTranslation();
  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);
  const renderedParagraphs = task.content.filter(paragraph => paragraph.isVisibleForStudents)
    .filter(paragraph => paragraphs.includes(paragraph._id))
    .map((paragraph, paragraphIndex) => {
      return (
        <Card key={paragraphIndex} style={{width: "100%"}}
              bordered={false}
              hoverable={false}
              bodyStyle={{padding: 24}}>
          <HebTypography.Paragraph dir="rtl"
                                   lang="he"
                                   style={{padding: 0, textAlign: "right"}}
                                   className="exercise-question__paragraph">
            {parser.parseWithInstructions(paragraph.he_nikkudot,
              isValidNode,
              sourceHtmlProcessingInstructions)
            }
          </HebTypography.Paragraph>
        </Card>
      )
    });
  const originalTextLabel = t("pages.lesson.form.tasks.exercises.original_text");
  const answerLabel = t("entities.answer.answer");
  return (
    <>
      { isStart
      && <>
        <Divider orientation="right">
          <HebTypography.Text strong>
            {originalTextLabel}
          </HebTypography.Text>
        </Divider>
        {renderedParagraphs}
      </>
      }
      <Divider orientation="right">
        <HebTypography.Text strong>{answerLabel}</HebTypography.Text>
      </Divider>
      <Card bordered={false}
            hoverable={false}
            bodyStyle={{padding: 24}}
            style={{width: "100%"}}>
        <HebTypography.Paragraph dir="rtl"
                                 lang="he"
                                 style={{
                                          padding: 0,
                                          whiteSpace: "pre-wrap",
                                          textAlign: "right"
                                        }}>
          {answer?.answer || ""}
        </HebTypography.Paragraph>
      </Card>
      { !isStart
      && <>
        {renderedParagraphs}
        <Divider orientation="left">
          <HebTypography.Text strong>
            {originalTextLabel}
          </HebTypography.Text>
        </Divider>
      </>
      }
    </>
  )
}