import { Parser } from "html-to-react";
import React, { useCallback } from "react";
import { Col, Row, Space } from "antd";
import { ExerciseType } from "../../../../../constants";
import { Trans, useTranslation } from "next-i18next";
import { HebCard, HebCheckbox, HebSwitch, HebTypography } from "../../../../../components/HebElements";
import { exerciseParserInstructionsForParagraphs } from "../ExerciseParserInstructionsForParagraphs";
import { useLessonForm } from "../../../../../providers";

const parser = new Parser();
const isValidNode = (node) => true;

export const TeacherForm = ({
                              _id,
                              taskIndex,
                              exerciseIndex,
                              isStart = true,
                              __t = ExerciseType.SupplementText,
                              task = {content: []},
                              paragraphs = []
                            }) => {
  const {updateExerciseByTaskIndexAndExerciseType} = useLessonForm();
  const {t} = useTranslation();

  const addParagraphToExercise = useCallback((paragraphId) => {
    if (!paragraphs.includes(paragraphId)) {
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {__t, paragraphs: [...paragraphs, paragraphId]})
    }
  }, [paragraphs, updateExerciseByTaskIndexAndExerciseType, taskIndex, __t]);

  const removeParagraphFromExercise = useCallback((paragraphId) => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
      __t,
      paragraphs: paragraphs.filter(paragraph => paragraph !== paragraphId)
    })
  }, [updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, paragraphs]);

  const toggleParagraph = useCallback((paragraphId) => (checked) => {
    if (checked) {
      addParagraphToExercise(paragraphId);
    } else {
      removeParagraphFromExercise(paragraphId);
    }
  }, [removeParagraphFromExercise, addParagraphToExercise]);

  const changeType = useCallback((value) => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                             __t,
                                             {isStart: value});
  }, [__t, taskIndex, updateExerciseByTaskIndexAndExerciseType]);

  const controlDescription = t(`pages.lesson.form.tasks.exercises.isStart.text.long.${isStart}`);
  const textTypeLabel = t(`pages.lesson.form.tasks.exercises.isStart.text.short.${isStart}`);
  const useParagraphLabel = t("pages.lesson.form.tasks.exercises.use_paragraph_in_exercise.label");

  const controls = (
    <Space direction="vertical"
           className="exercise__supplement-text__change-type"
           style={{width: "100%"}}>
      <Row gutter={[8, 8]} dir="rtl" hidden={!(exerciseIndex > -1)} style={{marginRight: 24}}>
        <Col xs={24}>
          <Space dir="ltr" style={{color: "#fff"}}>
            {textTypeLabel}
            <HebSwitch onChange={changeType}
                       checked={isStart}/>
          </Space>
        </Col>
        <Col xs={24}>
          <HebTypography.Text style={{color: "#fff"}}>
            {controlDescription}
          </HebTypography.Text>
        </Col>
      </Row>
    </Space>
  );

  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);

  const renderedParagraphs = task.content.filter(paragraph => paragraph.isVisibleForStudents)
                                 .map((paragraph, paragraphIndex) => {
                                   const isUsingInExercise = paragraphs.includes(paragraph._id);
                                   const toggleParagraphCallback = toggleParagraph(paragraph._id);
                                   return (
                                     <HebCard key={paragraphIndex} style={{width: "100%"}}
                                           bordered={false}
                                           dir="rtl"
                                           onClick={() => toggleParagraphCallback(!isUsingInExercise)}
                                           hoverable={true}
                                           title={
                                             <HebCheckbox
                                               className="exercise__supplement-text__control"
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
                                       <HebTypography.Paragraph align="justify"
                                                             dir="rtl"
                                                             lang="he"
                                                             style={{padding: 0}}>
                                         {parser.parseWithInstructions(paragraph.he_nikkudot,
                                                                       isValidNode,
                                                                       sourceHtmlProcessingInstructions)
                                         }
                                       </HebTypography.Paragraph>
                                     </HebCard>
                                   )
                                 });
  return (
    <>
      {controls}
      <div className="exercise__supplement-text__text" style={{width: "100%"}}>
        {exerciseIndex > -1 && renderedParagraphs}
      </div>
    </>
  );
};