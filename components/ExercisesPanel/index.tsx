import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Col, Row, Space, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

import { TaskType, UserRole } from "../../constants";
import { Exercise, Task } from "../../types";

const GameExercisesPanel = dynamic(() => import("../GameExercisesPanel"), {ssr: false, loading: () => <Spin/>});
const TextExercisesPanel = dynamic(() => import("../TextExercisesPanel"), {ssr: false, loading: () => <Spin/>});

type ExercisesPanelProps = {
  role: UserRole;
  __t: TaskType;
  task: Task;
  taskIndex: number;
  exercises: Exercise[];
}

const ExercisePanels = {
  [TaskType.TextTask]: TextExercisesPanel,
  [TaskType.GameTask]: GameExercisesPanel
};

export const ExercisesPanel = ({role, __t, ...props}: ExercisesPanelProps) => {
  const ExercisesPanelComponent = ExercisePanels[__t];
  return <ExercisesPanelComponent role={role} {...props}/>;
};

// eslint-disable-next-line react/display-name
export const withExercisePanel = (Component, t) => ({role, task, taskIndex, exercises, content, showText, _id, __t, ...props}) => {
  const emptyExamsLabel = t("pages.lesson.form.tasks.exercises.messages.none_create_lesson");
  return (
    <React.Fragment key={_id}>
      <Space direction="vertical" style={{width: "100%"}}>
        {<Component {...task} index={taskIndex} key={taskIndex}/>}
        {_id ? <ExercisesPanel role={UserRole.TEACHER}
                               __t={__t}
                               task={{_id, __t, content, exercises, showText}}
                               taskIndex={taskIndex}
                               {...props}
                               exercises={exercises}/>
          : <Row justify="center">
              <Col xs={24} style={{textAlign: "center"}}>
                <Space>
                  <FontAwesomeIcon style={{color: "#eaad09"}} icon={faExclamationTriangle as IconProp}/>
                  <span style={{color: "#fff"}}>{emptyExamsLabel}</span>
                </Space>
              </Col>
            </Row>
        }
      </Space>
    </React.Fragment>
  );
};