import React from "react";
import {UserRole} from "../../../../../constants";
import {StudentPanel} from "./StudentPanel";
import {TeacherPanel} from "./TeacherPanel";


class ExerciseFormBuilder {
  static [UserRole.TEACHER] = TeacherPanel;
  static [UserRole.STUDENT] = StudentPanel;

  static buildForm(role, props) {
    const FormComponent = ExerciseFormBuilder[role];
    return (
      <>
        {FormComponent && (<FormComponent role={role} {...props}/>)}
      </>
    );
  }
}

export const ExercisesPanel = ({role, ...props}) => {
  return ExerciseFormBuilder.buildForm(role, props);
}