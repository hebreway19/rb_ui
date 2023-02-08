import React from "react";
import { UserRole } from "../../../../../constants";
import { TeacherForm } from "./TeacherForm";
import { StudentForm } from "./StudentForm";

const Forms = {
  [UserRole.STUDENT]: StudentForm,
  [UserRole.TEACHER]: TeacherForm,
}

export const SupplementTextForm = ({role, ...props}) => {
  const Form = Forms[role];
  return (
    <>
      {Form && <Form {...props} role={role}/>}
    </>
  );
};