import React from "react";
import { UserRole } from "../../../../../constants";
import dynamic from "next/dynamic";


const StudentTour = dynamic(() => import("./StudentTour"), {ssr: false});
const TeacherTour = dynamic(() => import("./TeacherTour"), {ssr: false});

class ExerciseTourBuilder {
  static [UserRole.TEACHER] = TeacherTour;
  static [UserRole.STUDENT] = StudentTour;

  static buildForm(role, props) {
    const FormComponent = ExerciseTourBuilder[role];
    return (
      <>
        {FormComponent && (<FormComponent role={role} {...props}/>)}
      </>
    );
  }
}

export const ExerciseTour = ({role, ...props}) => {
  return ExerciseTourBuilder.buildForm(role, props);
};