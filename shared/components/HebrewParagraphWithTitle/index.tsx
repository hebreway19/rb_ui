import React from "react";
import { HebTypography } from "../../../components/HebElements";

const {Paragraph} = HebTypography;

export const HebrewParagraphWithTitle = ({title = "", content, fontSize = 18, fontFamilyStyle = null, color = null}) => {
  return (
    <>
      {title && <h3 style={fontFamilyStyle} lang="he" dir="rtl">{title}</h3>}
      {content && <Paragraph style={fontFamilyStyle} lang="he" dir="rtl">{content}</Paragraph>}
    </>
  );
};