import React from "react";
import { UserRole } from "../../../../../constants";
import { TextTaskExerciseListForStudent } from "./TextTaskExerciseListForStudent";
import { TextTaskExerciseListForTeacher } from "./TextTaskExerciseListForTeacher";

type TextTaskExerciseListProps = {
  [key: string]: any,
  role: UserRole
}

class TextTaskExerciseListFactory {
  static [UserRole.STUDENT] = TextTaskExerciseListForStudent;
  static [UserRole.TEACHER] = TextTaskExerciseListForTeacher;
  static buildList(role: UserRole, props: any) {
    const Component = TextTaskExerciseListFactory[role];
    return <>{ Component && (<Component {...props} />) }</>
  }
}

export const TextTaskExerciseList = ({role, ...props}: TextTaskExerciseListProps) => TextTaskExerciseListFactory.buildList(role, props);