import React from "react";
import Tour from "reactour";
import { ExerciseType } from "../../../../../constants";
import {
  AmericanQuestionsTeacherSteps,
  ChooseWordsByCategoriesTeacherSteps,
  CollectSentencesFromWordsTeacherSteps,
  EssayTeacherSteps,
  ExplainIdeaTeacherSteps,
  GiveTitleTextTeacherSteps,
  InsertMissingWordsTeacherSteps,
  OrderParagraphsInTextTeacherSteps,
  SelectMissingWordsTeacherSteps,
  SupplementSentencesTeacherSteps,
  SupplementTextTeacherSteps,
  TextQuestionsTeacherSteps,
  TrueFalseQuestionsTeacherSteps
} from "./steps";
import { TFunction, useTranslation } from "next-i18next";

const steps = {
  [ExerciseType.AmericanQuestions]: AmericanQuestionsTeacherSteps,
  [ExerciseType.ChooseWordsByCategories]: ChooseWordsByCategoriesTeacherSteps,
  [ExerciseType.CollectSentencesFromWords]: CollectSentencesFromWordsTeacherSteps,
  [ExerciseType.ExplainIdea]: ExplainIdeaTeacherSteps,
  [ExerciseType.GiveTitleText]: GiveTitleTextTeacherSteps,
  [ExerciseType.InsertMissingWords]: InsertMissingWordsTeacherSteps,
  [ExerciseType.OrderParagraphsInText]: OrderParagraphsInTextTeacherSteps,
  [ExerciseType.SelectMissingWords]: SelectMissingWordsTeacherSteps,
  [ExerciseType.SupplementSentences]: SupplementSentencesTeacherSteps,
  [ExerciseType.SupplementText]: SupplementTextTeacherSteps,
  [ExerciseType.TrueFalseQuestions]: TrueFalseQuestionsTeacherSteps,
  [ExerciseType.Essay]: EssayTeacherSteps,
  [ExerciseType.TextQuestions]: TextQuestionsTeacherSteps,
  buildStepsByExerciseType: (exerciseType, t: TFunction) => {
    const exerciseTranslate = `pages.lesson.form.tasks.exercises.types.${exerciseType}.title`;
    const previewStep = {
      selector: "",
      content: t(`tours.start_step`, {entity: t(exerciseTranslate)})
    }
    const finishStep = {
      selector: "",
      content: t(`tours.finish_step`, {entity: t(exerciseTranslate)})
    }
    return steps[exerciseType] ? [previewStep, ...steps[exerciseType](t), finishStep]
                               : [];
  }
}

export const TeacherTour = ({isOpen, onRequestClose, type, ...props}) => {
  const {t} = useTranslation();
  const finallySteps = steps.buildStepsByExerciseType(type, t);
  return process.browser && (<Tour steps={finallySteps}
                                   isOpen={finallySteps.length > 0 ? isOpen : false}
                                   startAt={0}
                                   onRequestClose={onRequestClose}/>);
};

export default TeacherTour;