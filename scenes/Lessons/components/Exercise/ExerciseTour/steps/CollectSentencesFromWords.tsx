import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.collect_sentences_from_words";

export const CollectSentencesFromWordsTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__collect-sentences-from-words__question",
    content: t(`${pathToTranslate}.question`)
  },
  {
    selector: ".exercise__collect-sentences-from-words__add-question",
    content: t(`${pathToTranslate}.add_question`)
  },
  {
    selector: ".exercise__collect-sentences-from-words__remove-question",
    content: t(`${pathToTranslate}.remove_question`)
  },
  {
    selector: ".exercise__collect-sentences-from-words__stepper",
    content: t(`${pathToTranslate}.stepper`)
  },
];
export const CollectSentencesFromWordsStudentSteps = (t: TFunction) => [];