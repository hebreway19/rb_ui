import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.supplement_text";

export const SupplementTextTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__supplement-text__text",
    content: t(`${pathToTranslate}.text`)
  },
  {
    selector: ".exercise__supplement-text__change-type",
    content: t(`${pathToTranslate}.change_type`)
  },
  {
    selector: ".exercise__supplement-text__control",
    content: t(`${pathToTranslate}.control`)
  },
];
export const SupplementTextStudentSteps = (t: TFunction) => [];