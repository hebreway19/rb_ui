import React from "react";
import { StudentAnswerType } from "../../../../../constants";
import { ExerciseStudentFormFactory } from "./ExerciseStudentFormFactory";
import {
  AmericanQuestionsAnswer, ChooseWordsByCategoriesAnswer, CollectSentencesFromWordsAnswer, EssayAnswer, ExplainIdeaAnswer, GiveTitleTextAnswer, InsertMissingWordsAnswer, OrderParagraphsInTextAnswer,
  SelectMissingWordsAnswer, SupplementSentencesAnswer, SupplementTextAnswer, TextQuestionAnswer, TrueFalseQuestionsAnswer
} from "../../../../../types";

export const StudentExerciseAnswerFactory = {
  [StudentAnswerType.AmericanQuestionsAnswer]: (exerciseType: string, props: any, studentExerciseAnswer: AmericanQuestionsAnswer) => {
    const americanQuestionAnswerProps = {
                                          questions: props.questions || [],
                                          answer: {
                                            answers: studentExerciseAnswer.answers
                                          }
                                        }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, americanQuestionAnswerProps)
  },
  [StudentAnswerType.ChooseWordsByCategories]: (exerciseType: string,
                                                props: any,
                                                studentExerciseAnswer: ChooseWordsByCategoriesAnswer) => {
    const chooseWordsByCategoriesAnswerProps = {
                                                 task: props.task,
                                                 wordsByCategories: props.wordsByCategories,
                                                 answer: { wordsByCategories: studentExerciseAnswer.wordsByCategories }
                                               }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, chooseWordsByCategoriesAnswerProps)
  },
  [StudentAnswerType.CollectSentencesFromWordsAnswer]: (exerciseType: string,
                                                        props: any,
                                                        studentExerciseAnswer: CollectSentencesFromWordsAnswer) => {
    const collectSentencesFromWordsAnswerProps = {
                                                   questions: props.questions,
                                                   answer: { answers: studentExerciseAnswer.answers }
                                                 }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, collectSentencesFromWordsAnswerProps);
  },
  [StudentAnswerType.ExplainIdeaAnswer]: (exerciseType: string,
                                          props: any,
                                          studentExerciseAnswer: ExplainIdeaAnswer) => {
    const explainIdeaAnswerProps = {
                                     paragraphs: props.paragraphs,
                                     task: props.task,
                                     answer: { answer: studentExerciseAnswer.answer }
                                   }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, explainIdeaAnswerProps)
  },
  [StudentAnswerType.GiveTitleTextStudentAnswer]: (exerciseType: string,
                                                   props: any,
                                                   studentExerciseAnswer: GiveTitleTextAnswer) => {
    const giveTitleTextAnswerProps = {
                                       answer: { answer: studentExerciseAnswer.answer }
                                     }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, giveTitleTextAnswerProps);
  },
  [StudentAnswerType.InsertMissingWordsAnswer]: (exerciseType: string,
                                                 props: any,
                                                 studentExerciseAnswer: InsertMissingWordsAnswer) => {
    const insertMissingWordsAnswerProps = {
                                            task: props.task,
                                            words: props.words,
                                            answer: studentExerciseAnswer
                                          }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, insertMissingWordsAnswerProps);
  },
  [StudentAnswerType.OrderParagraphsInTextStudentAnswer]: (exerciseType: string, props: any, studentAnswer: OrderParagraphsInTextAnswer) => {
    const orderParagraphsInTextAnswerProps = {
                                               task: props.task,
                                               paragraphs: props.paragraphs,
                                               answer: { paragraphs: studentAnswer.paragraphs }
                                             }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, orderParagraphsInTextAnswerProps);
  },
  [StudentAnswerType.SelectMissingWordsAnswer]: (exerciseType: string, props: any, studentAnswer: SelectMissingWordsAnswer) => {
    const selectedMissingWordsAnswerProps = {
                                              task: props.task,
                                              words: props.words,
                                              exercise: studentAnswer.exercise,
                                              answer: { words: studentAnswer.words }
                                            }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, selectedMissingWordsAnswerProps);
  },
  [StudentAnswerType.SupplementSentencesAnswer]: (exerciseType: string, props: any, studentAnswer: SupplementSentencesAnswer) => {
    const supplementSentencesAnswerProps = {
                                             questions: props.questions,
                                             answer: { answers: studentAnswer.answers }
                                           }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, supplementSentencesAnswerProps);
  },
  [StudentAnswerType.SupplementTextAnswer]: (exerciseType: string, props: any, studentAnswer: SupplementTextAnswer) => {
    const supplementTextAnswerProps = {
                                        paragraphs: props.paragraphs,
                                        task: props.task,
                                        isStart: props.isStart,
                                        answer: { answer: studentAnswer.answer }
                                      }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, supplementTextAnswerProps);
  },
  [StudentAnswerType.TrueFalseQuestionsAnswer]: (exerciseType: string, props: any, studentAnswer: TrueFalseQuestionsAnswer) => {
    const trueFalseQuestionsAnswerProps = {
      questions: props.questions,
      answer: { answers: studentAnswer.answers }
    }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, trueFalseQuestionsAnswerProps);
  },
  [StudentAnswerType.TextQuestions]: (exerciseType: string, props: any, studentAnswer: TextQuestionAnswer) => {
    const textQuestionsAnswerProps = {
      answer: studentAnswer,
      questions: props.questions,
    }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, textQuestionsAnswerProps);
  },
  [StudentAnswerType.Essay]: (exerciseType: string, props: any, studentAnswer: EssayAnswer) => {
    const essayAnswerProps = {
      answer: studentAnswer,
      essayThemeTitleList: props.essayThemeTitleList
    }
    return ExerciseStudentFormFactory.buildExerciseComponent(exerciseType, essayAnswerProps);
  },

  buildExerciseAnswerComponent: (answerType: string,
                                 exerciseType: string,
                                 props: any,
                                 studentExerciseAnswer: any): any => {
    const answerComponentRender: any = StudentExerciseAnswerFactory[answerType] || null;
    return <>{answerComponentRender && answerComponentRender(exerciseType, props, studentExerciseAnswer)}</>
  }
}