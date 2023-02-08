import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.true_false_questions";

export const TrueFalseQuestionsTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__true-false-questions__question",
    content: t(`${pathToTranslate}.question`)
  },
  {
    selector: ".exercise__true-false-questions__answer",
    content: t(`${pathToTranslate}.answer`)
  },
  {
    selector: ".exercise__true-false-questions__add-question",
    content: t(`${pathToTranslate}.add_question`)
  },
  {
    selector: ".exercise__true-false-questions__remove-question",
    content: t(`${pathToTranslate}.remove_question`)
  },
  {
    selector: ".exercise__true-false-questions__stepper",
    content: t(`${pathToTranslate}.stepper`)
  }
];
export const TrueFalseQuestionsStudentSteps = (t: TFunction) => [];