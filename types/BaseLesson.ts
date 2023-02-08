import { AccessType, HebrewProficiency, LanguageCode, LessonType, TimeOfDay } from "../constants";
import { LocalizedContent } from "./LocalizedContent";
import { User } from "./User";
import { Task } from "./Task";

export type BaseLesson = {
  _id?: string;
  __t?: LessonType;
  title: LocalizedContent;
  timeOfDay?: TimeOfDay;
  studentsHebrewProficiency: HebrewProficiency;
  studentsNativeLanguage?: LanguageCode;
  author: User | string;
  tasks: Task[];
  type: LessonType;
  accessType: AccessType;
  openFrom?: number;
  openTo?: number;
  maxCountToUse?: number;
  isMediaContentVisibleForStudent?: boolean;
};
