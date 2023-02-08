import React from "react";
import Tour from "reactour";
import { ExerciseType } from "../../../../../constants";
import {
  AmericanQuestionsStudentSteps,
  ChooseWordsByCategoriesStudentSteps,
  CollectSentencesFromWordsStudentSteps,
  EssayStudentSteps,
  ExplainIdeaStudentSteps,
  GiveTitleTextStudentSteps,
  InsertMissingWordsStudentSteps,
  OrderParagraphsInTextStudentSteps,
  SelectMissingWordsStudentSteps,
  SupplementSentencesStudentSteps,
  SupplementTextStudentSteps,
  TextQuestionsStudentSteps,
  TrueFalseQuestionsStudentSteps
} from "./steps";
import { TFunction, useTranslation } from "next-i18next";

const steps = {
  [ExerciseType.AmericanQuestions]: AmericanQuestionsStudentSteps,
  [ExerciseType.ChooseWordsByCategories]: ChooseWordsByCategoriesStudentSteps,
  [ExerciseType.CollectSentencesFromWords]: CollectSentencesFromWordsStudentSteps,
  [ExerciseType.ExplainIdea]: ExplainIdeaStudentSteps,
  [ExerciseType.GiveTitleText]: GiveTitleTextStudentSteps,
  [ExerciseType.InsertMissingWords]: InsertMissingWordsStudentSteps,
  [ExerciseType.OrderParagraphsInText]: OrderParagraphsInTextStudentSteps,
  [ExerciseType.SelectMissingWords]: SelectMissingWordsStudentSteps,
  [ExerciseType.SupplementSentences]: SupplementSentencesStudentSteps,
  [ExerciseType.SupplementText]: SupplementTextStudentSteps,
  [ExerciseType.TrueFalseQuestions]: TrueFalseQuestionsStudentSteps,
  [ExerciseType.Essay]: EssayStudentSteps,
  [ExerciseType.TextQuestions]: TextQuestionsStudentSteps,
  buildStepsByExerciseType: (exerciseType: string, t: TFunction) => {
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

export const StudentTour = ({isOpen, onRequestClose, type, ...props}) => {
  const {t} = useTranslation();
  const finallySteps = steps.buildStepsByExerciseType(type, t);
  return process.browser && (<Tour steps={finallySteps}
                                   isOpen={finallySteps.length > 0 ? isOpen : false}
                                   startAt={0}
                                   onRequestClose={onRequestClose}/>);
};

export default StudentTour;