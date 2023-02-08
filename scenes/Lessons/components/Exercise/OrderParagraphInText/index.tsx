import React from "react";
import { UserRole } from "../../../../../constants";
import { StudentForm } from "./StudentForm";
import { TeacherForm } from "./TeacherForm";

const Forms = {
  [UserRole.STUDENT]: StudentForm,
  [UserRole.TEACHER]: TeacherForm
};

export const OrderParagraphsInTextForm = ({
                                            role,
                                            ...props
                                          }) => {
  const Component = Forms[role];
  return (
    <>
      {Component && (<Component {...props}/>)}
    </>
  );
};