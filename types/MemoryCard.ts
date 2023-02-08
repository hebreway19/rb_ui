import { MemoryCardType } from "../constants";
import { Content, MediaContent, TextContent } from "./Content";

export type MemoryCard<C extends Content = Content> = {
  _id?: string;
  isEnabled: boolean;
  __t: MemoryCardType;
  content: C;
}
export type MediaMemoryCard = MemoryCard<MediaContent> & {};
export type TextMemoryCard = MemoryCard<TextContent> & {};