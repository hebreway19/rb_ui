import React from "react";
import { StringUtil } from "../../../../../util";
import { TextContent } from "../../../../../types";
import { HebTypography } from "../../../../../components/HebElements";
import { WordComponent } from "./WordComponent";
import { Card, Col, Row } from "antd";

export const InsertMissingWordsForm = ({task, words, answer}) => {
  const taskContents: TextContent[] = task?.content || [];

  const wordsList = taskContents.filter(taskContent => taskContent.isVisibleForStudents)
                                .map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || "")
                                                                              .map((word) => (
                                                                                word === "<br/>"
                                                                                ? <br/>
                                                                                : <HebTypography.Text dir="rlt">
                                                                                    {` ${word} `}
                                                                                  </HebTypography.Text>)))
                                .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x]
                                                                           : [x],
                                                                [])
                                .flat()
                                .map((word, index) => (
                                  <React.Fragment key={index}>
                                    <WordComponent word={word}
                                                   words={words}
                                                   answer={answer}
                                                   index={index} />
                                  </React.Fragment>
                                ));
  const wordsBlock = (
    <HebTypography.Paragraph lang="he">
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