import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.supplement_sentences";

export const SupplementSentencesTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__supplement-sentences__sentence",
    content: t(`${pathToTranslate}.sentence`)
  },
  {
    selector: ".exercise__supplement-sentences__change-type",
    content: t(`${pathToTranslate}.change_type`)
  },
  {
    selector: ".exercise__supplement-sentences__add-sentence",
    content: t(`${pathToTranslate}.add_sentence`)
  },
  {
    selector: ".exercise__supplement-sentences__remove-sentence",
    content: t(`${pathToTranslate}.remove_sentence`)
  },
  {
    selector: ".exercise__supplement-sentences__stepper",
    content: t(`${pathToTranslate}.stepper`)
  }
];
export const SupplementSentencesStudentSteps = (t: TFunction) => [];