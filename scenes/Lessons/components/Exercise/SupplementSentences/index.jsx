import React from "react";
import { UserRole } from "../../../../../constants";
import { StudentForm } from "./StudentForm";
import { TeacherForm } from "./TeacherForm";

const Forms = {
  [UserRole.STUDENT]: StudentForm,
  [UserRole.TEACHER]: TeacherForm,
}

export const SupplementSentencesForm = ({role, ...props}) => {
  const Form = Forms[role];
  return (
    <>
      {Form && <Form {...props} role={role}/>}
    </>
  );
};

 SupplementSentencesForm;