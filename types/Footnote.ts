import { LocalizedContent } from "./LocalizedContent";
import { User } from "./User";

export type Footnote = {
  _id?: string;
  audio?: string;
  picture?: string;
  title?: LocalizedContent;
  updatedAt?: number;
  createdAt?: number;
  author?: User;
  externalReference?: string;
  wordMeaning?: LocalizedContent;
  word?: LocalizedContent;
  toRecycleBin?: boolean;
};