import React from "react";
import { TaskType } from "../../../../constants";
import { Exercise, Content } from "../../../../types";

class GameTaskProps {
  _id?: string;
  __t: string;
  index: number;
  content?: Content[];
  exercises: Exercise[];
  showText?: boolean;
}

const GameTask = ({
                           _id,
                           __t = TaskType.GameTask
                         }: GameTaskProps) => {
  return (<></>)
}

export default GameTask;