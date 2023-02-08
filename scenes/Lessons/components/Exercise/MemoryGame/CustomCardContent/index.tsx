import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { TaskContentType } from "../../../../../../constants";
import { MemoryCard } from "../../../../../../types";

import { TextCardContent } from "./TextCardContent";
import { MediaCardContent } from "./MediaCardContent";

const Content = {
  [TaskContentType.TextContent]: TextCardContent,
  [TaskContentType.MediaContent]: MediaCardContent
}

export type CustomCardContentProps = {
  card: MemoryCard;
  setAnswer;
  removeCardByIndex;
}

export const CustomCardContent = ({ card, setAnswer, removeCardByIndex }: CustomCardContentProps) => {
  const Component = Content[(card.content?.__t || undefined) as TaskContentType];
  const componentProps = {
    card,
    setAnswer
  }
  return (
    <React.Fragment>
      <div style={{position: "absolute", top: ".5rem", right: ".5rem"}}>
        <DeleteOutlined onClick={removeCardByIndex} />
      </div>
      {Component && <Component { ...componentProps } />}
    </React.Fragment>
  );
}