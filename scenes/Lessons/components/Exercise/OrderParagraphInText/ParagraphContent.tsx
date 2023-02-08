import React from 'react';
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { Lesson, TextContent } from "../../../../../types";
import { HebTypography } from "../../../../../components/HebElements";
import { LanguageCode, LessonType } from "../../../../../constants";
import { NumberUtil, StringUtil } from "../../../../../util";
import { ContentImage } from "../../ContentImage";
import { ContentAudio, ContentFootnote } from "../../index";

const parser = new Parser();
const isValidNode = (node) => true;

const processNodeDefinitions = new ProcessNodeDefinitions(React);

const sourceHtmlProcessingInstructions = (lesson: Partial<Lesson>) => [
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

type ParagraphContentProps = {
  paragraph: TextContent,
  paragraphKey: number,
  lessonType: LessonType,
  isMediaContentVisibleForStudent: boolean,
  studentsNativeLanguage: LanguageCode,
  isStudent: boolean
}

const studentFontStyle = {
  color: "#000000"
}
const teacherFortStyle = {
  color: "#ffffff"
}

export const ParagraphContent = ({
                                   paragraph,
                                   paragraphKey,
                                   lessonType,
                                   isMediaContentVisibleForStudent,
                                   studentsNativeLanguage,
                                   isStudent
                                 }: ParagraphContentProps) => {
  const lesson: Partial<Lesson> = {
                                    type: lessonType, studentsNativeLanguage,
                                    isMediaContentVisibleForStudent,
                                  }
  const currentParagraphName: string = StringUtil.getUnicodeSymbolByHexadecimal(NumberUtil.convertNumToHexadecimal(paragraphKey + 65));
  
  return (
    <>
      <h3 id={`paragraph-${paragraphKey + 1}`} style={isStudent ? studentFontStyle : teacherFortStyle}>
        {currentParagraphName}
      </h3>
      <HebTypography.Paragraph lang="he" dir="rtl" style={isStudent ? studentFontStyle : teacherFortStyle}>
        {parser.parseWithInstructions(paragraph.he_nikkudot,
                                      isValidNode,
                                      sourceHtmlProcessingInstructions(lesson))}
      </HebTypography.Paragraph>
    </>
  )
}