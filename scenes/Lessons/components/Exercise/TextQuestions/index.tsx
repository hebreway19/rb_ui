import React from "react";
import {TeacherForm} from "./TeacherForm";
import {StudentForm} from "./StudentForm";
import {UserRole} from "../../../../../constants";

const TextQuestionsFormFactory = {
  [UserRole.STUDENT]: StudentForm,
  [UserRole.TEACHER]: TeacherForm,

  buildForm: (role, props = {}) => {
    const FormComponent = TextQuestionsFormFactory[role];
    return (
      <>
        {FormComponent && <FormComponent role={role} {...props} />}
      </>
    );
  }
}

export const TextQuestionsForm = ({role, ...props}) => {
  return (<>{TextQuestionsFormFactory.buildForm(role, props)}</>);
}