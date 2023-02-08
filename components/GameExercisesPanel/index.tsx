import React from "react";
import { UserRole } from "../../constants";
import { StudentPanel } from "./StudentPanel";
import { TeacherPanel } from "./TeacherPanel";


class GameExerciseFormBuilder {
  static [UserRole.TEACHER] = TeacherPanel;
  static [UserRole.STUDENT] = StudentPanel;
  
  static buildForm(role, props) {
    const FormComponent = GameExerciseFormBuilder[role];
    return (
      <>
        {FormComponent && (<FormComponent role={role} {...props}/>)}
      </>
    );
  }
}

const GameExercisesPanel = ({role, ...props}) => {
  return GameExerciseFormBuilder.buildForm(role, props);
}

export default GameExercisesPanel;