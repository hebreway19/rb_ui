import {UserRole} from "../../../../../constants";
import React from "react";
import {StudentForm} from "./StudentForm";
import {TeacherForm} from "./TeacherForm";

const EssayFormFactory = {
  [UserRole.STUDENT]: StudentForm,
  [UserRole.TEACHER]: TeacherForm,

  buildForm: (role: string, props: any = {}): JSX.Element => {
    const FormComponent = EssayFormFactory[role];
    return (
      <>
        {FormComponent && <FormComponent role={role} {...props} />}
      </>
    );
  }
}

export const EssayForm = ({role, ...props}): JSX.Element => {
  return EssayFormFactory.buildForm(role, props);
}