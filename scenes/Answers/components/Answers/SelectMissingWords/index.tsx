import React from "react";
import { StringUtil } from "../../../../../util";
import { WordComponent } from "./WordComponent";
import { HebTypography } from "../../../../../components/HebElements";
import { Card, Col, Row } from "antd";

export const SelectMissingWordsForm = ({
                                         task,
                                         exercise,
                                         words = [],
                                         answer = { words: [] }
                                       }) => {
  const taskContents = task?.content || [];
  const wordsList = taskContents.filter(taskContent => taskContent.isVisibleForStudents)
                                .map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || "")
                                                                .map((word) => word === "<br/>" ? <br/> : word))
                                .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x],
                                        [])
                                .flat()
                                .map((word, index) => (
                                  <span key={index}> <WordComponent word={word}
                                                                    words={words}
                                                                    answer={answer}
                                                                    index={index}/> </span>));
  const wordsBlock = (
    <HebTypography.Paragraph lang="he"
                             dir="rtl">
      {wordsList}
    </HebTypography.Paragraph>
  );

  return (
    <Card>
      <Row>
        <Col xs={24} style={{textAlign: "right"}}>
          {wordsBlock}
        </Col>
      </Row>
    </Card>
  );
}