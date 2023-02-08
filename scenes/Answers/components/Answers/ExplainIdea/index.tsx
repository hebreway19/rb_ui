import React from "react";
import { useTranslation } from "next-i18next";
import { Parser } from "html-to-react";

import { useLessonForm } from "../../../../../providers";
import { Card, Divider } from "antd";
import { HebTypography } from "../../../../../components/HebElements";
import { exerciseParserInstructionsForParagraphs } from "../../../../Lessons/components/Exercise/ExerciseParserInstructionsForParagraphs";
import { ExplainIdeaAnswer, Task, TextContent } from "../../../../../types";

const parser = new Parser();
const isValidNode = (node) => true;

class ExplainIdeaFormProps {
  paragraphs: string[];
  task: Task<TextContent>;
  answer: ExplainIdeaAnswer;
}

export const ExplainIdeaForm = ({
                                  paragraphs = [],
                                  task = {content: []} as Task<TextContent>,
                                  answer = {answer: ""}
                                }: ExplainIdeaFormProps) => {
  const {t} = useTranslation();
  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);
  const renderedParagraphs = task.content.filter((paragraph: TextContent) => paragraph.isVisibleForStudents === true)
                                         .filter((paragraph: TextContent) => paragraphs.includes(paragraph._id))
                                         .map((paragraph: TextContent, paragraphIndex: number) => {
                                           return (
                                             <Card key={paragraphIndex} style={{width: "100%"}}
                                                   bordered={false}
                                                   hoverable={false}
                                                   bodyStyle={{padding: 24}}>
                                               <HebTypography.Paragraph align="justify"
                                                                        dir="rtl"
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
  const originalTextLabel: string = t("pages.lesson.form.tasks.exercises.original_text");
  const answerLabel: string = t("entities.answer.answer");
  return (
    <>
      <Divider orientation="right">
        <HebTypography.Text strong>
          {originalTextLabel}
        </HebTypography.Text>
      </Divider>
      {renderedParagraphs}
      <Divider orientation="right">
        <HebTypography.Text strong>
          {answerLabel}
        </HebTypography.Text>
      </Divider>
      <Card bordered={false}
            hoverable={false}
            bodyStyle={{padding: 24}}
            style={{width: "100%"}}>
        <HebTypography.Paragraph align="justify"
                                 dir="rtl"
                                 lang="he"
                                 style={{padding: 0, whiteSpace: "pre"}}>
          {answer?.answer || ""}
        </HebTypography.Paragraph>
      </Card>
    </>
  );
}