import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.text_questions";

export const TextQuestionsTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__text-questions__question",
    content: t(`${pathToTranslate}.question`)
  },
  {
    selector: ".exercise__text-questions__add-question",
    content: t(`${pathToTranslate}.add_question`)
  },
  {
    selector: ".exercise__text-questions__remove-question",
    content: t(`${pathToTranslate}.remove_question`)
  },
  {
    selector: ".exercise__text-questions__stepper",
    content: t(`${pathToTranslate}.stepper`)
  },
];
export const TextQuestionsStudentSteps = (t: TFunction) => [];