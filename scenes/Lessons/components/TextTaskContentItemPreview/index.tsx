import React from "react";
import { Col, Row } from "antd";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { useMediaQuery } from "react-responsive";

import { HebTypography } from "../../../../components/HebElements";
import { Lesson, TextContent } from "../../../../types";
import { LessonType } from "../../../../constants";
import { ContentImage } from "../ContentImage";
import { ContentAudio, ContentFootnote } from "../index";
import { useTranslation } from "next-i18next";
import { useLessonForm, useStudentTasksAnswersForm } from "../../../../providers";

const parser = new Parser();
const isValidNode = (node) => true;

const processNodeDefinitions = new ProcessNodeDefinitions(React);

const sourceHtmlProcessingInstructions = (lesson: Lesson) => [
  {
    shouldProcessNode: (node) => node.name === "section" && node.attribs.class === "image",
    processNode: (node, children, index) => {
      return (lesson?.type === LessonType.EXAM && !lesson?.isMediaContentVisibleForStudent
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
    processNode: processNodeDefinitions.processDefaultNode
  }
];


type TextTaskContentItemPreviewProps = {
  columnSizeMd?: number;
  taskContent: TextContent;
};

export const TextTaskContentItemPreview = ({columnSizeMd = 12, taskContent}: TextTaskContentItemPreviewProps) => {
  const {formState} = useStudentTasksAnswersForm();
  const {lesson} = useLessonForm();
  const {t} = useTranslation();
  const isMobile = useMediaQuery({query: "(max-width: 768px)"});

  const notTranslation = t("pages.lesson.form.tasks.content.not_translation.label");
  return (
    <Row justify="center" gutter={32} wrap={isMobile} align="top">
      {
        formState.isVisibleTranslate && (
          <Col xs={24} md={columnSizeMd}>
            <HebTypography.Paragraph style={{textAlign: "justify", marginRight: ".5rem"}}>
              {taskContent?.[lesson?.studentsNativeLanguage as string] || notTranslation}
            </HebTypography.Paragraph>
          </Col>
        )
      }
      <Col xs={24} md={columnSizeMd}>
        <HebTypography.Paragraph dir="rtl" lang="he" style={{textAlign: "right"}}>
          {!formState.showWithoutNikkudot
           ? parser.parseWithInstructions(taskContent.he_nikkudot, isValidNode, sourceHtmlProcessingInstructions(lesson))
           : taskContent.he
          }
        </HebTypography.Paragraph>
      </Col>
    </Row>
  );
};