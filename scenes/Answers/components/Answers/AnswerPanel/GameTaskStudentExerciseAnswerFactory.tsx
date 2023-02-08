import React from "react";
import { GameTaskAnswersTypes } from "../../../../../constants";
import { EssayAnswer } from "../../../../../types";
import { GameExerciseStudentFormFactory } from "./GameExerciseStudentFormFactory";

export const GameTaskStudentExerciseAnswerFactory = {
  [GameTaskAnswersTypes.Memory]: (exerciseType: string, props: any, studentAnswer: EssayAnswer) => {
    const memoryAnswerProps = {
      answer: studentAnswer,
      sets: props.sets
    }
    return GameExerciseStudentFormFactory.buildExerciseComponent(exerciseType, memoryAnswerProps);
  },
  buildExerciseAnswerComponent: (answerType: string,
                                 exerciseType: string,
                                 props: any,
                                 studentExerciseAnswer: any): any => {
    const answerComponentRender: any = GameTaskStudentExerciseAnswerFactory[answerType] || null;
    return <>{answerComponentRender && answerComponentRender(exerciseType, props, studentExerciseAnswer)}</>
  }
}