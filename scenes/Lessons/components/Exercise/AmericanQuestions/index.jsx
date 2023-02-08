import React from "react";
import { UserRole } from "../../../../../constants/UserRole";
import { TeacherForm } from "./TeacherForm";
import { StudentForm } from "./StudentForm";

class ExerciseAmericanQuestionsFormFactory {
  static [UserRole.TEACHER] = TeacherForm;
  static [UserRole.STUDENT] = StudentForm;

  static buildForm(role, props = {}) {
    const FormComponent = ExerciseAmericanQuestionsFormFactory[role];
    return (
      <>
        {FormComponent && <FormComponent {...props}/>}
      </>
    );
  }
}

export const AmericanQuestionsForm = ({
                                        role,
                                        ...props
                                      }) => {
  return ExerciseAmericanQuestionsFormFactory.buildForm(role, props);
}

 AmericanQuestionsForm;