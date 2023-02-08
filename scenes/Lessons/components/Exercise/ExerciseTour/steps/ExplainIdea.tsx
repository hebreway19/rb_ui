import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.explain_idea";

export const ExplainIdeaTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__explain-idea__paragraphs",
    content: t(`${pathToTranslate}.paragraphs`)
  },
  {
    selector: ".exercise__explain-idea__checkbox",
    content: t(`${pathToTranslate}.checkbox`)
  }
];
export const ExplainIdeaStudentSteps = (t: TFunction) => [];