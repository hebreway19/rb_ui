const pathToTranslate: string = "tours.exercises.american_questions";

export const AmericanQuestionsTeacherSteps = t => [
  {
    selector: ".exercise__american-question__question",
    content: t(`${pathToTranslate}.question`)
  },
  {
    selector: ".exercise__american-question__correct-answer",
    content: t(`${pathToTranslate}.correct_answer`)
  },
  {
    selector: ".exercise__american-question__wrong-answers",
    content: t(`${pathToTranslate}.wrong_answers`)
  },
  {
    selector: ".exercise__american-question__stepper",
    content: t(`${pathToTranslate}.stepper`)
  }
];

export const AmericanQuestionsStudentSteps = (t) => [];