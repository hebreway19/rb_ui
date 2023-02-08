import { StudentTasksAnswersState } from "../constants";
import { Lesson } from "./Lesson";
import { Exam } from "./Exam";
import { User } from "./User";
import { Task } from "./Task";
import { StudentAnswer } from "./StudentAnswer";

export type StudentTasksAnswers = {
  _id?: string;
  lesson?: Lesson | Exam;
  student: User | string;
  tasks: Task[];
  answers: StudentAnswer[];
  reviewedBy?: User | string;
  group?: any;
  state: StudentTasksAnswersState;
}