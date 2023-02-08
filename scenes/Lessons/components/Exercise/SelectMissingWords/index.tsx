import React from "react";
import { TeacherForm } from "./TeacherForm";
import { StudentForm } from "./StudentForm";
import {UserRole} from "../../../../../constants";

class SelectMissingWordsFormFactory {
  static [UserRole.TEACHER] = TeacherForm;
  static [UserRole.STUDENT] = StudentForm;

  static buildForm(role, props = {}) {
    const FormComponent = SelectMissingWordsFormFactory[role];
    return (
      <>
        {FormComponent && <FormComponent {...props}/>}
      </>
    );
  }
}

export const SelectMissingWordsForm = ({
                                         role,
                                         ...props
                                       }) => {
  return SelectMissingWordsFormFactory.buildForm(role, props);
}
