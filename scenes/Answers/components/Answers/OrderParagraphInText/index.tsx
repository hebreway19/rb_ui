import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Parser } from "html-to-react";
import { Col, Row, Space } from "antd";

import { HebCard } from "../../../../../components/HebElements";
import { exerciseParserInstructionsForParagraphs } from "../../../../Lessons/components/Exercise/ExerciseParserInstructionsForParagraphs";
import { ParagraphComponent } from "./ParagraphItem";
import { useLessonForm } from "../../../../../providers";
import { TextContent } from "../../../../../types";

const parser = new Parser();

export const OrderParagraphInTextForm = ({
                                           task = {content: [] as TextContent[]},
                                           paragraphs = [],
                                           answer = {paragraphs: []}
                                         }) => {
  const {t} = useTranslation();
  const {lesson} = useLessonForm();

  const [actualVisibleParagraphs, setActualVisibleParagraphs] = useState([]);

  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);

  const updateActualVisibleParagraphs = useCallback(() => {
    const newActualVisibleParagraphs = paragraphs.filter(paragraph =>
                                                           task.content.some(contentParagraph => contentParagraph._id === paragraph && contentParagraph.isVisibleForStudents)
                                                 )
                                                 .map(paragraphId => task.content.find(contentParagraph => contentParagraph._id === paragraphId))
                                                 .filter(paragraph => !!paragraph);
    setActualVisibleParagraphs(newActualVisibleParagraphs);
  }, [paragraphs, task])

  useEffect(() => {
    if (actualVisibleParagraphs.length < 1 || answer?.paragraphs?.length > 0) {
      updateActualVisibleParagraphs();
    }
  }, [answer]);

  return (
    <HebCard headStyle={{color: "#ffffff"}}
             bordered={false}
             style={{border: "unset"}}
             bodyStyle={{padding: 0}}>
      <Space direction="vertical"
             style={{width: "100%"}}>
        <Row>
          <Col xs={24}>
            {answer.paragraphs
                   .map(answeredParagraph => actualVisibleParagraphs.find(paragraph => paragraph._id === answeredParagraph))
                   .filter(answeredParagraph => !!answeredParagraph)
                   .map((answeredParagraph, indexItem) => {
                     const correctAnswerIndex = task.content
                                                    .filter(content => content.isVisibleForStudents)
                                                    .findIndex(content => content._id === answeredParagraph._id);
                     const isCurrentAnswerCorrect = correctAnswerIndex === indexItem;
                     return (
                       <React.Fragment key={indexItem}>
                         <ParagraphComponent parser={parser}
                                             currentValue={answeredParagraph}
                                             isCorrectAnswer={isCurrentAnswerCorrect}
                                             sourceHtmlProcessingInstructions={sourceHtmlProcessingInstructions}
                         />
                       </React.Fragment>
                     );
                   })}
          </Col>
        </Row>
      </Space>
    </HebCard>
  )
}