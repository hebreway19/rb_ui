import { MemoryCard } from "./MemoryCard";
import { MemorySet } from "./MemorySet";
import { Task } from "./Task";
import { LocalizedContent } from "./LocalizedContent";
import { ExerciseType, GameTaskExerciseTypes, LanguageCode } from "../constants";
import { TextContent } from "./Content";
import { StudentAnswer } from "./StudentAnswer";

export type Exercise = {
  _id?: string | any;
  __t: ExerciseType | GameTaskExerciseTypes;
  isTextVisibleForUser: boolean;
  isAudioAnswerAvailable: boolean;
  isAutomaticallyChecked: boolean;
  task: Task | string;
  studentAnswers: StudentAnswer[] | string[];
  lessonId?: string;
  isEnabled?: boolean;
};

export type OrderParagraphsInTextExercise = Exercise & {
  paragraphs: TextContent[] | string[];
  isAutomaticallyChecked: true;
}

export type AmericanQuestion = {
  question: LocalizedContent;
  correctAnswer: LocalizedContent;
  wrongAnswers: LocalizedContent[];
};

export type AmericanQuestionsExercise = Exercise & {
  questions: AmericanQuestion[];
  isTextVisibleForUser: true;
  isAutomaticallyChecked: true;
};

export type GiveTitleTextExercise = Exercise & {
  isTextVisibleForUser: true;
};

export type InsertMissingWordsExercise = Exercise & {
  words: number[];
  isAutomaticallyChecked: true;
};

export type MissingWordSelect = {
  positionInText: number;
  wrongAnswers: string[];
};

export type SelectMissingWordsExercise = Exercise & {
  words: MissingWordSelect[];
  isAutomaticallyChecked: true;
};

export type CollectSentencesFromWordsQuestion = {
  sentence: LocalizedContent;
};

export type CollectSentencesFromWordsExercise = Exercise & {
  questions: CollectSentencesFromWordsQuestion[];
  isAutomaticallyChecked: true;
};

export type TrueFalseQuestion = {
  question: LocalizedContent;
  isTrue: boolean;
  language: LanguageCode;
  isAutomaticallyChecked: true;
};

export type TrueFalseQuestionsExercise = Exercise & {
  questions: TrueFalseQuestion[];
  isTextVisibleForUser: true;
  isAutomaticallyChecked: true;
};

export type SupplementSentenceQuestion = {
  sentence: LocalizedContent;
  isStart: boolean;
};

export type SupplementSentencesExercise = Exercise & {
  questions: SupplementSentenceQuestion[];
};

export type SupplementTextExercise = Exercise & {
  paragraphs: TextContent[] | string[];
  isStart?: boolean;
};

export type ExplainIdeaExercise = Exercise & {
  paragraphs: TextContent[] | string[];
  isAudioAnswerAvailable: true;
}

export type ChooseWordsByCategoriesExercise = Exercise & {
  wordsByCategories: Map<string, Map<string, any>>;
};

export type TextQuestionExercise = Exercise & {
  question: string[];
}

export type EssayExercise = Exercise & {
  essayThemeTitle: LocalizedContent[];
}

export type MemoryExercise = Exercise & {
  timeToSolve: number;
  sets: MemorySet[];
  readonly allCards: MemoryCard[] | string[];
  readonly activeCards: MemoryCard[] | string[];
  readonly activeSets: MemorySet[] | string[];
  readonly pronounceableSets: MemorySet[] | string[];
  readonly writeableSets: MemorySet[] | string[];
}