import React from "react";
import { UserRole } from "../../../../../constants";
import { GameTaskExerciseListForStudent } from "./GameTaskExerciseListForStudent";
import { GameTaskExerciseListForTeacher } from "./GameTaskExerciseListForTeacher";

type GameTaskExerciseListProps = {
  [key: string]: any;
  role: UserRole;
}

class GameTaskExerciseListFactory {
  static [UserRole.STUDENT] = GameTaskExerciseListForStudent;
  static [UserRole.TEACHER] = GameTaskExerciseListForTeacher;
  static buildList(role: UserRole, props: any) {
    const Component = GameTaskExerciseListFactory[role];
    return <>{Component && (<Component {...props} />)}</>;
  }
}

export const GameTaskExerciseList = ({role, ...props}: GameTaskExerciseListProps) => {
  return <>{GameTaskExerciseListFactory.buildList(role, props)}</>
};