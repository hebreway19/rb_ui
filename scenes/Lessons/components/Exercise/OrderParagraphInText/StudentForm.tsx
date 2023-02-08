import { Col, Row } from "antd";
import { merge } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

import { ExerciseType, StudentAnswerType } from "../../../../../constants";
import { useLessonForm } from "../../../../../providers";
import { OrderParagraphsInTextAnswer, Task, TextContent } from "../../../../../types";
import { ArrayUtil } from "../../../../../util";
import { ParagraphContent } from "./ParagraphContent";
import { SortableList } from "./SortableList";

type StudentFormProps = {
  taskIndex: number;
  __t: ExerciseType;
  _id: string;
  mode: 'view' | 'default';
  task: Partial<Task<TextContent>>;
  paragraphs: string[];
  answer: OrderParagraphsInTextAnswer;
  
  setAnswer(value): void;
  commitAnswer(value): void;
}

export const StudentForm = ({
                              __t,
                              _id,
                              task = {content: []},
                              paragraphs = [],
                              answer = {paragraphs: []},
                              setAnswer
                            }: StudentFormProps) => {
  const {lesson} = useLessonForm();
  
  const [currentOrderedParagraphs, setCurrentOrderedParagraphs] = useState<TextContent[]>([]);
  
  const defaultOrderedParagraphs: TextContent[] = paragraphs.map(paragraphId => task.content.filter(item => item.isVisibleForStudents)
                                                                                            .find(item => item._id === paragraphId));
  
  const moveUp = useCallback((index: number) => {
    let newParagraphs = merge([], answer?.paragraphs);
    ArrayUtil.shiftUp<TextContent | string>(newParagraphs, index)
    setAnswer(oldState => ({...oldState, __t: StudentAnswerType.OrderParagraphsInTextStudentAnswer, paragraphs: newParagraphs}));
  }, [answer, setAnswer]);
  
  const moveDown = useCallback((index: number) => {
    let newParagraphs = merge([], answer?.paragraphs);
    ArrayUtil.shiftDown<TextContent | string>(newParagraphs, index)
    setAnswer(oldState => ({...oldState, __t: StudentAnswerType.OrderParagraphsInTextStudentAnswer, paragraphs: newParagraphs}));
  }, [answer, setAnswer]);
  
  const getParagraphKey = useCallback((paragraphId: string) => {
    return paragraphs.findIndex((id) => id === paragraphId);
  }, [paragraphs]);
  
  useEffect(() => {
    if (!answer?.paragraphs || answer?.paragraphs.length === 0) {
      const newCurrentOrderedParagraphs = paragraphs.map(paragraphId => (
                                                           task.content.filter(item => item.isVisibleForStudents)
                                                                       .find(item => item._id === paragraphId))._id);
      setAnswer(oldState => ({...oldState, __t: StudentAnswerType.OrderParagraphsInTextStudentAnswer, paragraphs: newCurrentOrderedParagraphs}));
    }
    if (answer?.paragraphs && answer.paragraphs.length > 0) {
      const newCurrentOrderedParagraphs: TextContent[] = answer.paragraphs.map(id => task.content.find(item => item._id === id));
      setCurrentOrderedParagraphs(newCurrentOrderedParagraphs);
    }
  }, [answer]);
  
  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col xs={24} md={0}>
          <SortableList paragraphsIds={currentOrderedParagraphs.map(item => item._id)}
                        isStudent={true} paragraphs={defaultOrderedParagraphs}
                        onMoveDown={moveDown} onMoveUp={moveUp} />
        </Col>
        <Col xs={24} md={16}>
          {currentOrderedParagraphs.map((paragraphContent: TextContent, paragraphIndex: number) => (
            <React.Fragment key={paragraphIndex}>
              <ParagraphContent paragraph={paragraphContent} lessonType={lesson.type} isStudent={true}
                                isMediaContentVisibleForStudent={lesson.isMediaContentVisibleForStudent}
                                studentsNativeLanguage={lesson.studentsNativeLanguage}
                                paragraphKey={getParagraphKey(paragraphContent._id)}/>
            </React.Fragment>
          ))}
        </Col>
        <Col xs={0} md={8}>
          <div style={{position: "sticky", top: "1rem"}}>
            <SortableList paragraphsIds={currentOrderedParagraphs.map(item => item._id)}
                          isStudent={true} paragraphs={defaultOrderedParagraphs}
                          onMoveDown={moveDown} onMoveUp={moveUp} />
          </div>
        </Col>
      </Row>
    </div>
  )
}