import React from "react";
import { StudentForm } from "./StudentForm";
import { TeacherForm } from "./TeacherForm";
import { ExerciseType, UserRole } from "../../../../../constants";

class ExerciseGiveTitleComponentFactory {
  static [UserRole.STUDENT] = StudentForm
  static [UserRole.TEACHER] = TeacherForm

  static buildComponent(role, props = {}) {
    const Component = ExerciseGiveTitleComponentFactory[role];
    return (
      <>
        {Component && <Component {...props}/>}
      </>
    );
  }
}

export const GiveTitleForm = ({
                                _id = "",
                                __t = ExerciseType.GiveTitleText,
                                exerciseIndex,
                                taskIndex,
                                role,
                                ...props
                              }) => {
  return (
    <>
      {_id && ExerciseGiveTitleComponentFactory.buildComponent(role,
                                                               {
                                                                 _id,
                                                                 __t,
                                                                 role,
                                                                 taskIndex,
                                                                 exerciseIndex,
                                                                 ...props
                                                               })}
    </>
  );
}

 GiveTitleForm;