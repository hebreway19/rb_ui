import React from "react";
import { UserRole } from "../../../../../constants";
import { StudentForm } from "./StudentForm";
import { TeacherForm } from "./TeacherForm";

class TrueFalseQuestionsFactory {
  static [UserRole.STUDENT] = StudentForm;
  static [UserRole.TEACHER] = TeacherForm;

  static buildComponent(role, props) {
    const Form = TrueFalseQuestionsFactory[role];
    return (
      <>
        {Form && <Form {...props} role={role}/>}
      </>
    );
  }
}

export const TrueFalseQuestionsForm = ({role, ...props}) => {
  return TrueFalseQuestionsFactory.buildComponent(role, props);
};

 TrueFalseQuestionsForm;