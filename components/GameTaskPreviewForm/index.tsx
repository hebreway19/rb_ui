import React from "react";
import { Col, Row } from "antd";
import { UserRole } from "../../constants";
import { useLessonForm, useStudentTasksAnswersForm } from "../../providers";
import { Task } from "../../types";
import GameExercisesPanel from "../GameExercisesPanel";

type GameTaskPreviewFromProps = {
  mode: "default" | "preview",
  task: Task,
  taskIndex: number
}

export const GameTaskPreviewForm = ({mode, task, taskIndex}: GameTaskPreviewFromProps) => {
  const {formState: lessonFormState} = useLessonForm();
  const {formState: studentTasksAnswersFormState} = useStudentTasksAnswersForm();
  const isVisibleExercise: boolean = studentTasksAnswersFormState.isSingleGameTask ||
                                     studentTasksAnswersFormState.exercisesIsVisible || lessonFormState.exercisesIsVisible;
  const isPreview: boolean = mode === "preview";
  return (
    <Row>
      <Col span={isPreview ? 24 : 22} hidden={!isVisibleExercise}>
        <GameExercisesPanel role={UserRole.STUDENT} exercises={task.exercises} task={task} mode={mode}
                            taskIndex={taskIndex} />
      </Col>
    </Row>
  );
}

export default GameTaskPreviewForm;