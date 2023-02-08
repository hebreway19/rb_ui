import { LocalizedContent } from "./LocalizedContent";
import { File } from "./File";
import { TaskContentType } from "../constants";

export type Content = {
  _id?: string;
  __t: TaskContentType;
  isVisibleForStudents: boolean;
};

export type TextContent = Content & LocalizedContent & {};

export type MediaContent = Content & File & {
  mimeType: string;
};
