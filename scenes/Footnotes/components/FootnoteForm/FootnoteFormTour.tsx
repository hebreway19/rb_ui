import React from "react";
import { useTranslation } from "next-i18next";
import Tour from "reactour";

export const FootnoteFormTour = ({
                                   isOpen,
                                   onRequestClose
                                 }) => {
  const {t} = useTranslation();
  const pathToTranslate = "tours.footnote_from";
  const steps = [
    {
      selector: '.footnote-page-header',
      content: t(`${pathToTranslate}.page_header`)
    },
    {
      selector: '.word',
      content: t(`${pathToTranslate}.word`)
    },
    {
      selector: '.show-without-nikkudot',
      content: t(`${pathToTranslate}.show_without_nikkudot`)
    },
    {
      selector: '.wordMeaning',
      content: t(`${pathToTranslate}.word_meaning`)
    },
    {
      selector: ".audio",
      content: t(`${pathToTranslate}.audio`)
    },
    {
      selector: ".externalReference",
      content: t(`${pathToTranslate}.external_reference`)
    }
  ];

  return process.browser && <Tour steps={steps}
                                  isOpen={isOpen}
                                  startAt={0}
                                  onRequestClose={onRequestClose}/>;
};

export default FootnoteFormTour;