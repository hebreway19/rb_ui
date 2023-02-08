import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.choose_words_by_categories";

export const ChooseWordsByCategoriesTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__choose-words-by-categories__add-category",
    content: t(`${pathToTranslate}.add_category`)
  },
  {
    selector: ".exercise__choose-words-by-categories__selector",
    content: t(`${pathToTranslate}.selector`)
  },
  {
    selector: ".exercise__choose-words-by-categories__edit-category",
    content: t(`${pathToTranslate}.edit_category`)
  },
  {
    selector: ".exercise__choose-words-by-categories__text",
    content: t(`${pathToTranslate}.text`)
  },
];
export const ChooseWordsByCategoriesStudentSteps = (t: TFunction) => [];