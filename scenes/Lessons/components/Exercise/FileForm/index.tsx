import React from "react";
import { StudentForm } from "./StudentForm";
import { TeacherForm } from "./TeacherForm";
import { UserRole } from "../../../../../constants";

class FileFormBuilder {
  static [UserRole.STUDENT] = StudentForm;
  static [UserRole.TEACHER] = TeacherForm;
  
  static build(role, props) {
    const Component = FileFormBuilder[role];
    return (<>{ Component && <Component {...props}/> }</>);
  }
}

export const FileForm = ({role, ...props}) => {
  return FileFormBuilder.build(role, props);
}