import React from "react";
import { UserRole } from "../../constants";
import { StudentPanel } from "./StudentPanel";
import { TeacherPanel } from "./TeacherPanel";


class TextExerciseFormBuilder {
  static [UserRole.TEACHER] = TeacherPanel;
  static [UserRole.STUDENT] = StudentPanel;
  
  static buildForm(role, props) {
    const FormComponent = TextExerciseFormBuilder[role];
    return (
      <>
        {FormComponent && (<FormComponent role={role} {...props}/>)}
      </>
    );
  }
}

const TextExercisesPanel = ({role, ...props}) => {
  return TextExerciseFormBuilder.buildForm(role, props);
}

export default TextExercisesPanel;