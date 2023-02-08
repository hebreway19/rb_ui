import React, { useCallback } from "react";
import { MediaContent, MemoryCard } from "../../../../../../types";
import { AudioCardContent } from "./AudioCardContent";
import { ImageCardContent } from "./ImageCardContent";

const Content = {
  ["audio"]: AudioCardContent,
  ["image"]: ImageCardContent,
}

export type MediaCardContentProps = {
  card: MemoryCard,
  setAnswer;
}

export const MediaCardContent = ({ card, setAnswer }: MediaCardContentProps) => {
  const type: string = (card.content as MediaContent).mimeType.substring(0, 5);
  const Component = Content[type];
  
  const uploadFile = useCallback(({_id, mimeType}) => {
    setAnswer && setAnswer({ ...card, content: { ...card.content, _id, mimeType } as MediaContent });
  }, [setAnswer, card]);
  
  const componentProps = {
    cardContent: card.content as MediaContent,
    onDone: uploadFile
  }
  return (<>{Component && <Component { ...componentProps} />}</>);
}