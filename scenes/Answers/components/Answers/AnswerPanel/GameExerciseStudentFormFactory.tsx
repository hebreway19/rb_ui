import React from "react";
import { GameTaskExerciseTypes } from "../../../../../constants";
import {MemoryForm} from "../.";

export const GameExerciseStudentFormFactory = {
  [GameTaskExerciseTypes.Memory]: MemoryForm,
  
  buildExerciseComponent: (exerciseType: string, props: any) => {
    const ExerciseComponent = GameExerciseStudentFormFactory[exerciseType];
    return <>{ExerciseComponent && <ExerciseComponent {...props} />}</>
  }
}