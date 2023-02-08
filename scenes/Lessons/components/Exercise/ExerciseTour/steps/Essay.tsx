import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.essay";

export const EssayTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__essay__themes",
    content: t(`${pathToTranslate}.themes`)
  },
  {
    selector: ".exercise__essay__add-theme-item",
    content: t(`${pathToTranslate}.add_theme_item`)
  },
  {
    selector: ".exercise__essay__remove-theme-item",
    content: t(`${pathToTranslate}.remove_theme_item`)
  }
];
export const EssayStudentSteps = (t: TFunction) => [];