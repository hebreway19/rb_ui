import {
  AmericanQuestionsExercise,
  ChooseWordsByCategoriesExercise,
  CollectSentencesFromWordsExercise,
  EssayExercise,
  Exercise,
  ExplainIdeaExercise,
  GiveTitleTextExercise,
  InsertMissingWordsExercise,
  OrderParagraphsInTextExercise,
  SelectMissingWordsExercise,
  SupplementSentencesExercise,
  SupplementTextExercise,
  TextQuestionExercise,
  TrueFalseQuestionsExercise
} from "./Exercise";
import { TextContent } from "./Content";
import { LocalizedContent } from "./LocalizedContent";

export type StudentAnswer = {
  __t?: string;
  _id?: string;
  id?: string;
  teacherComment?: string;
  points?: number;
};

export type StudentExerciseAnswer<E extends Exercise = Exercise> = StudentAnswer & {
  exercise?: E | string;
};

export type OrderParagraphsInTextAnswer = StudentExerciseAnswer<OrderParagraphsInTextExercise> & {
  paragraphs: TextContent[] | string[];
};

export type CollectSentencesFromWordsAnswer = StudentExerciseAnswer<CollectSentencesFromWordsExercise> & {
  answers: string[];
};

export type SupplementSentencesAnswer = StudentExerciseAnswer<SupplementSentencesExercise> & {
  answers: string[];
};

export type GiveTitleTextAnswer = StudentExerciseAnswer<GiveTitleTextExercise> & {
  answer: string;
};

export type FileAnswer = StudentAnswer & {
  files: File[] | string[];
};

export type AmericanQuestionsAnswer = StudentExerciseAnswer<AmericanQuestionsExercise> & {
  answers: LocalizedContent[];
};

export type InsertMissingWordsAnswer = StudentExerciseAnswer<InsertMissingWordsExercise> & {
  words: string[];
};

export type MissingWordAnswer = {
  positionInText: number;
  answer: string;
};

export type SelectMissingWordsAnswer = StudentExerciseAnswer<SelectMissingWordsExercise> & {
  words: MissingWordAnswer[];
};

export type TrueFalseQuestionsAnswer = StudentExerciseAnswer<TrueFalseQuestionsExercise> & {
  answers: boolean[];
};

export type SupplementTextAnswer = StudentExerciseAnswer<SupplementTextExercise> & {
  answer: string;
};

export type ExplainIdeaAnswer = StudentExerciseAnswer<ExplainIdeaExercise> & {
  answer: string;
};

export type ChooseWordsByCategoriesAnswer = StudentExerciseAnswer<ChooseWordsByCategoriesExercise> & {
  wordsByCategories: Map<string, string[]>;
};

export type TextQuestionAnswer = StudentExerciseAnswer<TextQuestionExercise> & {
  answers: LocalizedContent[];
}

export type EssayAnswer = StudentExerciseAnswer<EssayExercise> & {
  selectedEssayTheme: number
  answer: LocalizedContent;
}
