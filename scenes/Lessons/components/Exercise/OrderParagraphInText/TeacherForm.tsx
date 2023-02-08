import { merge } from "lodash";
import React, {useCallback, useEffect} from "react";
import {Col, Row} from "antd";
import { arrayMove } from "react-sortable-hoc";
import {ExerciseType} from "../../../../../constants";
import {Task, TextContent} from "../../../../../types";
import { ArrayUtil } from "../../../../../util";
import {ParagraphContent} from "./ParagraphContent";
import {useLessonForm} from "../../../../../providers";
import {SortableList} from "./SortableList";

type TeacherFormProps = {
  [key: string]: any;
  _id: string;
  taskIndex: number;
  exerciseIndex: number;
  __t: ExerciseType;
  task: Partial<Task<TextContent>>;
  paragraphs?: string[];

  updateExerciseByTaskIndexAndExerciseType;
}

export const TeacherForm = ({
                              _id,
                              taskIndex,
                              exerciseIndex,
                              task = { content: [] },
                              paragraphs = [],
                              __t = ExerciseType.OrderParagraphsInText
                            }: TeacherFormProps) => {
  const {lesson, updateExerciseByTaskIndexAndExerciseType} = useLessonForm();

  const visibleParagraphs: TextContent[] = paragraphs.map(paragraphId => task.content.filter(paragraph => !!paragraph.isVisibleForStudents)
                                                                                     .find(paragraph => paragraph._id === paragraphId))
                                                     .filter(paragraph => !!paragraph);
  const defaultVisibleParagraphs: TextContent[] = task.content.filter((paragraph) => !!paragraph.isVisibleForStudents);

  const getParagraphKey = useCallback((paragraphId: string) => {
    return task.content.findIndex((paragraph) => paragraph._id === paragraphId);
  }, [task.content]);
  
  const moveUp = useCallback((index: number) => {
    let newParagraphs = merge([], paragraphs);
    ArrayUtil.shiftUp<string>(newParagraphs, index)
    updateExerciseByTaskIndexAndExerciseType(taskIndex, ExerciseType.OrderParagraphsInText,
      {
        _id,
        __t: ExerciseType.OrderParagraphsInText,
        paragraphs: newParagraphs,
      })
  }, [paragraphs, updateExerciseByTaskIndexAndExerciseType, _id, taskIndex]);
  
  const moveDown = useCallback((index: number) => {
    let newParagraphs = merge([], paragraphs);
    ArrayUtil.shiftDown<string>(newParagraphs, index)
    updateExerciseByTaskIndexAndExerciseType(taskIndex, ExerciseType.OrderParagraphsInText,
      {
        _id,
        __t: ExerciseType.OrderParagraphsInText,
        paragraphs: newParagraphs,
      })
  }, [paragraphs, updateExerciseByTaskIndexAndExerciseType, _id, taskIndex]);
  
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    const sortedParagraphs = arrayMove(paragraphs, oldIndex, newIndex);
    updateExerciseByTaskIndexAndExerciseType(taskIndex, ExerciseType.OrderParagraphsInText,
      {
        _id,
        __t: ExerciseType.OrderParagraphsInText,
        paragraphs: sortedParagraphs,
      })
  }, [_id, taskIndex, updateExerciseByTaskIndexAndExerciseType, paragraphs]);
  
  useEffect(() => {
    if (!paragraphs.length && exerciseIndex > -1) {
      const newParagraphIds: string[] = task.content.map(paragraph => paragraph._id);
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {__t, _id, paragraphs: newParagraphIds});
    }
  }, [updateExerciseByTaskIndexAndExerciseType, _id, __t, task.content, paragraphs, taskIndex, exerciseIndex]);

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24} md={0}>
        <SortableList paragraphsIds={paragraphs} onMoveDown={moveDown} onMoveUp={moveUp}
                      isStudent={false} paragraphs={defaultVisibleParagraphs} />
      </Col>
      <Col xs={24} md={16}>
        {visibleParagraphs.map((paragraphContent: TextContent, paragraphIndex: number) => (
          <React.Fragment key={paragraphIndex}>
            <ParagraphContent paragraph={paragraphContent}
                              lessonType={lesson.type}
                              isStudent={false}
                              isMediaContentVisibleForStudent={lesson.isMediaContentVisibleForStudent}
                              studentsNativeLanguage={lesson.studentsNativeLanguage}
                              paragraphKey={getParagraphKey(paragraphContent._id)} />
          </React.Fragment>
        ))}
      </Col>
      <Col xs={0} md={8}>
        <div style={{position: "sticky", top: "1rem"}}>
          <SortableList paragraphsIds={paragraphs} onMoveDown={moveDown} onMoveUp={moveUp}
                        isStudent={false} paragraphs={defaultVisibleParagraphs} />
        </div>
      </Col>
    </Row>
  )
}