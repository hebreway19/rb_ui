import React from "react";
import { TeacherForm } from "./TeacherForm";
import { StudentForm } from "./StudentForm";
import { UserRole } from "../../../../../constants";

class InsertMissingWordsFormFactory {
  static [UserRole.TEACHER] = TeacherForm;
  static [UserRole.STUDENT] = StudentForm;

  static buildForm(role, props = {}) {
    const FormComponent = InsertMissingWordsFormFactory[role];
    return (
      <>
        {FormComponent && <FormComponent {...props} role={role}/>}
      </>
    );
  }
}

export const InsertMissingWordsForm = ({
                                         role,
                                         ...props
                                       }) => {
  return (
    <>
      {InsertMissingWordsFormFactory.buildForm(role, props)}
    </>
  );
}

export default InsertMissingWordsForm;