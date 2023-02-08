import { Exercise } from "./Exercise";
import { Content } from "./Content";
import { TaskType } from "../constants";

export type Task<T = Content> = {
  _id?: string;
  __t: TaskType;
  content: T[];
  exercises: Exercise[];
  showText?: boolean;
};