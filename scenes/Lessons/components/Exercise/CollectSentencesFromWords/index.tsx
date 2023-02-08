import React from "react";
import { UserRole } from "../../../../../constants";
import { TeacherForm } from "./TeacherForm";
import { StudentForm } from "./StudentForm";

class CollectSentencesFromWordsFormFactory {
  static [UserRole.TEACHER] = TeacherForm;
  static [UserRole.STUDENT] = StudentForm;

  static buildForm(role, props) {
    const FormComponent = CollectSentencesFromWordsFormFactory[role];
    return (<>{FormComponent && <FormComponent {...props}/>}</>);
  }
}

export const CollectSentencesFromWordsForm = ({role, ...props}) => {
  return CollectSentencesFromWordsFormFactory.buildForm(role, props);
}