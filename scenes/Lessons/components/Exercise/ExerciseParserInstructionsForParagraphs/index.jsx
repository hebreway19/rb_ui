import React from "react";
import { ContentImage } from "../../ContentImage";
import { ContentAudio } from "../../ContentAudio";
import { ContentFootnote } from "../../ContentFootnote";
import { LessonType } from "../../../../../constants";
import { ProcessNodeDefinitions } from "html-to-react";

const processNodeDefinitions = new ProcessNodeDefinitions(React);

export const exerciseParserInstructionsForParagraphs = (lesson) => [
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
    processNode: processNodeDefinitions.processDefaultNode,
  }
];