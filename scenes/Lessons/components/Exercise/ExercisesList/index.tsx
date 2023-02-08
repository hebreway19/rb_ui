import React from "react";
import { UserRole } from "../../../../../constants";
import { ExercisesListForStudent } from "./ExercisesListForStudent";
import { ExercisesListForTeacher } from "./ExercisesListForTeacher";

class ExercisesListFactory {
  static [UserRole.TEACHER] = ExercisesListForTeacher;
  static [UserRole.STUDENT] = ExercisesListForStudent;

  static buildList(role, props) {
    const ListComponent = ExercisesListFactory[role];
    return (
      <>
        {ListComponent && (<ListComponent {...props}/>)}
      </>
    );
  }
}

export const ExercisesList = ({role, ...props}) => {
  return ExercisesListFactory.buildList(role, props);
}