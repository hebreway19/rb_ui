import React, { useCallback } from "react";
import { ExerciseType, UserRole } from "../../../../../constants";
import { StringUtil } from "../../../../../util";
import { WordComponent } from "../WordComponent";
import { HebTypography } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";
import { TextContent } from "../../../../../types";

export const WordItem = ({word, isSelected, select, unselect}) => {
  return (<WordComponent role={UserRole.TEACHER}
                         word={word}
                         style={{
                           cursor: "pointer",
                           whiteSpace: "nowrap",
                           color: "#ffffff"
                         }}
                         onClick={isSelected ? unselect : select}
                         mark={isSelected}/>);
};

export const TeacherForm = ({
                              _id = "",
                              __t = ExerciseType.InsertMissingWords,
                              taskIndex,
                              words = [],
                              exerciseIndex
                            }) => {
  const {
    lesson,
    updateExerciseByTaskIndexAndExerciseType
  } = useLessonForm();
  const addWordToExercise = useCallback((wordIndexInText) => () => {
    const newWords = [...words];
    if (!newWords.includes(wordIndexInText)) {
      newWords.push(wordIndexInText);
      updateExerciseByTaskIndexAndExerciseType(taskIndex,
        __t,
        { words: newWords });
    }
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, words]);

  const removeWordFromExercise = useCallback((wordIndexInText) => () => {
    const newWords = words.filter(word => word !== wordIndexInText);
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
      __t,
      {words: newWords});
  }, [taskIndex, __t, words, updateExerciseByTaskIndexAndExerciseType]);

  const exerciseIsExists = exerciseIndex > -1;

  const taskContents = lesson.tasks[taskIndex].content || [];
  const wordsComponents = taskContents.filter(taskContent => taskContent.isVisibleForStudents)
    .map((taskContent: TextContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || "")
                                                 .map(word => word === "<br/>" ? <br/> : word))
    .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x], [])
    .flat();
  const wordsBlock = (
    <HebTypography.Paragraph className="exercise__insert-missing-words__text" dir="rtl" style={{textAlign: "justify"}} lang="he">
      {
        wordsComponents.map((word, index) => (
          <React.Fragment key={index}>
            <WordItem word={word}
                      isSelected={words.includes(index)}
                      select={addWordToExercise(index)}
                      unselect={removeWordFromExercise(index)}/>
          </React.Fragment>
        ))
      }
    </HebTypography.Paragraph>);

  return (
    <>{exerciseIsExists && wordsBlock}</>
  )
};