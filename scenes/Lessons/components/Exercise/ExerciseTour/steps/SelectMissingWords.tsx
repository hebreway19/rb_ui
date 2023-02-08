import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.select_missing_words";

export const SelectMissingWordsTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__select-missing-words__text",
    content: t(`${pathToTranslate}.text`)
  },
];
export const SelectMissingWordsStudentSteps = (t: TFunction) => [];