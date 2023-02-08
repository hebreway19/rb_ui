import { ExerciseType } from "../../../../../constants";
import { Parser } from "html-to-react";
import React, { useCallback } from "react";
import { Typography } from "antd";
import { Trans, useTranslation } from "next-i18next";
import { HebCard, HebCheckbox } from "../../../../../components/HebElements";
import { exerciseParserInstructionsForParagraphs } from "../ExerciseParserInstructionsForParagraphs";
import { useLessonForm } from "../../../../../providers";

const parser = new Parser();
const isValidNode = (node) => true;

export const TeacherForm = ({
                              _id,
                              taskIndex,
                              exerciseIndex,
                              __t = ExerciseType.ExplainText,
                              task = {content: []},
                              paragraphs = []
                            }) => {
  const {updateExerciseByTaskIndexAndExerciseType} = useLessonForm();
  const {t} = useTranslation();

  const addParagraphToExercise = useCallback((paragraphId) => {
    if (!paragraphs.includes(paragraphId)) {
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {__t, paragraphs: [...paragraphs, paragraphId]})
    }
  }, [paragraphs, updateExerciseByTaskIndexAndExerciseType, __t]);

  const removeParagraphFromExercise = useCallback((paragraphId) => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
      __t,
      paragraphs: paragraphs.filter(paragraph => paragraph !== paragraphId)
    })
  }, [paragraphs, updateExerciseByTaskIndexAndExerciseType, __t]);

  const toggleParagraph = useCallback((paragraphId) => (checked) => {
    if (checked) {
      addParagraphToExercise(paragraphId);
    } else {
      removeParagraphFromExercise(paragraphId);
    }
  }, [removeParagraphFromExercise, addParagraphToExercise]);

  const useParagraphLabel = t("pages.lesson.form.tasks.exercises.use_paragraph_in_exercise.label");
  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);
  const renderedParagraphs = task.content.filter(paragraph => paragraph.isVisibleForStudents)
                                 .map((paragraph, paragraphIndex) => {
                                   const isUsingInExercise = paragraphs.includes(paragraph._id);
                                   const toggleParagraphCallback = toggleParagraph(paragraph._id);
                                   return (
                                     <HebCard key={paragraphIndex} style={{width: "100%"}}
                                           dir="rtl"
                                           onClick={() => toggleParagraphCallback(!isUsingInExercise)}
                                           hoverable={true}
                                           title={
                                             <HebCheckbox
                                               className="exercise__explain-idea__checkbox"
                                               checked={isUsingInExercise}
                                               size="small"
                                               onChange={({target}) => toggleParagraphCallback(target.checked)}
                                             >
                                               <Trans
                                                 i18nKey={`pages.lesson.form.tasks.exercises.types.${__t}.useParagraphInExercise`}>
                                                 {useParagraphLabel}
                                               </Trans>
                                             </HebCheckbox>
                                           }
                                           bodyStyle={{padding: 24}}>
                                       <Typography.Paragraph align="justify"
                                                             dir="rtl"
                                                             lang="he"
                                                             style={{padding: 0}}>
                                         {parser.parseWithInstructions(paragraph.he_nikkudot,
                                                                       isValidNode,
                                                                       sourceHtmlProcessingInstructions)
                                         }
                                       </Typography.Paragraph>
                                     </HebCard>
                                   )
                                 });
  return (
    <div className="exercise__explain-idea__paragraphs" style={{width: "100%"}}>
      {exerciseIndex > -1 && renderedParagraphs}
    </div>
  );
}