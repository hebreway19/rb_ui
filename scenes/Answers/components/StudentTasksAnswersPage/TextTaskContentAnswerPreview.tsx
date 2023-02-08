import React from "react";
import { useTranslation } from "next-i18next";
import { LessonType } from "../../../../constants";
import { ContentAudio, ContentFootnote, ContentImage } from "../../../Lessons/components";
import { Col, Divider, Row } from "antd";
import { HebTypography } from "../../../../components/HebElements";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { useMediaQuery } from "react-responsive";

const parser = new Parser();
const isValidNode = (node) => true;

const processNodeDefinitions = new ProcessNodeDefinitions(React);

export const TextTaskContentPreview = ({task = {content: []}, lesson, mode, formState, ...props}) => {
  const {t} = useTranslation();
  const notTranslation = t("pages.lesson.form.tasks.content.not_translation.label");
  const columnSizeMd = formState.isVisibleTranslate
    ? 12
    : 24;
  const sourceHtmlProcessingInstructions = [
    {
      shouldProcessNode: (node) => node.name === "section" && node.attribs.class === "image",
      processNode: (node, children, index) => {
        return (lesson?.type === LessonType.EXAM && !lesson.isMediaContentVisibleForStudent
          ? null
          : <ContentImage mode="preview" key={index} dataId={node.attribs["data-id"]} {...node.attribs}/>);
      }
    },
    {
      shouldProcessNode: (node) => node.name === "section" && node.attribs.class === "audio",
      processNode: (node, children, index) => {
        return (lesson?.type === LessonType.EXAM && !lesson?.isMediaContentVisibleForStudent
          ? null
          : <ContentAudio mode="preview" key={index} dataId={node.attribs["data-id"]} {...node.attribs}/>);
      }
    },
    {
      shouldProcessNode: (node) => node.name === "span" && node.attribs.class === "footnote",
      processNode: (node, children, index) => {
        return (lesson?.type === LessonType.EXAM
          ? <span>{node.attribs.word}</span>
          : <ContentFootnote mode="preview"
                             key={index}
                             dataId={node.attribs["data-id"]}
                             word={node.attribs.word}
                             language={lesson?.studentsNativeLanguage}
                             {...node.attribs} />);
      }
    },
    {
      shouldProcessNode: (node) => true,
      processNode: processNodeDefinitions.processDefaultNode,
    }
  ];

  const isMobile = useMediaQuery({query: "(max-width: 768px)"});
  const content = task.content.map((taskContent, itemIndex) => (
    taskContent.isVisibleForStudents &&
    <Row justify="center" gutter={32} wrap={isMobile} align="top" key={itemIndex * 2}>
      {
        formState.isVisibleTranslate && (
          <>
            <Col xs={24} flex={"auto"}>
              <HebTypography.Paragraph style={{textAlign: "justify", marginRight: ".5rem"}}>
                {taskContent?.[lesson.studentsNativeLanguage as string] || notTranslation}
              </HebTypography.Paragraph>
            </Col>
          </>
        )
      }
      <Col xs={24} md={columnSizeMd}>
        <HebTypography.Paragraph dir="rtl" lang="he" style={{textAlign: "justify"}}>
          {!formState.showWithoutNikkudot
            ? parser.parseWithInstructions(taskContent.he_nikkudot,
              isValidNode,
              sourceHtmlProcessingInstructions)
            : taskContent.he
          }
        </HebTypography.Paragraph>
      </Col>
    </Row>
  ))
    .reduce((items, currentValue, index) =>
      currentValue
        ? [...items,
          (
            <Row gutter={8} justify="center" wrap={false}
                 align="bottom" key={`separator${index}`}>
              {
                formState.isVisibleTranslate && (
                  <>
                    <Col flex="auto">
                      <Divider type="horizontal"/>
                    </Col>
                  </>
                )
              }
              <Col xs={24} md={columnSizeMd}>
                <Divider type="horizontal"/>
              </Col>
            </Row>
          ), currentValue]
        : items, []);
  return (
    <Row className="answer-text">
      <Col flex="auto">
        {content}
      </Col>
    </Row>
  );
};