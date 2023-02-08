import React from "react";
import { ExerciseType } from "../../../../../constants";
import {
  AnswerAmericanQuestionsForm,
  ChooseWordsByCategoriesForm,
  CollectSentencesFromWordsForm,
  ExplainIdeaForm,
  GiveTitleForm,
  InsertMissingWordsForm,
  OrderParagraphInTextForm,
  SelectMissingWordsForm,
  SupplementSentencesForm,
  SupplementTextFrom,
  TextQuestionsForm,
  TrueFalseQuestionsForm,
  EssayForm
} from "..";

export const ExerciseStudentFormFactory = {
  [ExerciseType.AmericanQuestions]: AnswerAmericanQuestionsForm,
  [ExerciseType.ChooseWordsByCategories]: ChooseWordsByCategoriesForm,
  [ExerciseType.CollectSentencesFromWords]: CollectSentencesFromWordsForm,
  [ExerciseType.ExplainIdea]: ExplainIdeaForm,
  [ExerciseType.GiveTitleText]: GiveTitleForm,
  [ExerciseType.InsertMissingWords]: InsertMissingWordsForm,
  [ExerciseType.OrderParagraphsInText]: OrderParagraphInTextForm,
  [ExerciseType.SelectMissingWords]: SelectMissingWordsForm,
  [ExerciseType.TrueFalseQuestions]: TrueFalseQuestionsForm,
  [ExerciseType.SupplementSentences]: SupplementSentencesForm,
  [ExerciseType.SupplementText]: SupplementTextFrom,
  [ExerciseType.TextQuestions]: TextQuestionsForm,
  [ExerciseType.Essay]: EssayForm,

  buildExerciseComponent: (exerciseType: string, props: any) => {
    const ExerciseComponent = ExerciseStudentFormFactory[exerciseType];
    return <>{ExerciseComponent && <ExerciseComponent {...props} />}</>
  }
}