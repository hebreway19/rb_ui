import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.insert_missing_words";

export const InsertMissingWordsTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__insert-missing-words__text",
    content: t(`${pathToTranslate}.text`)
  }
];
export const InsertMissingWordsStudentSteps = (t: TFunction) => [];