import {TFunction} from "next-i18next";

const pathToTranslate: string = "tours.exercises.order_paragraphs_in_text";

export const OrderParagraphsInTextTeacherSteps = (t: TFunction) => [
  {
    selector: ".exercise__order-paragraphs-in-text__paragraphs",
    content: t(`${pathToTranslate}.paragraphs`)
  },
  {
    selector: ".exercise__order-paragraphs-in-text__paragraphs-items",
    content: t(`${pathToTranslate}.paragraphs_items`)
  },
  {
    selector: ".exercise__order-paragraphs-in-text__paragraphs-items__control",
    content: t(`${pathToTranslate}.paragraphs_items_control`)
  },
];
export const OrderParagraphsInTextStudentSteps = (t: TFunction) => [];