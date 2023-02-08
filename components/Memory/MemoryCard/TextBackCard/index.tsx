import React from "react";
import { HebTypography } from "../../../HebElements";
import { TextContent } from "../../../../types";

export type TextBackCardProps = {
  content: TextContent
}

export const TextBackCard = ({ content }: TextBackCardProps) => {
  return (
    <HebTypography.Paragraph lang="he">
      {content.he_nikkudot || content.he}
    </HebTypography.Paragraph>
  )
}