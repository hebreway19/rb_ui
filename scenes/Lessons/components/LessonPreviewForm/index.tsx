import dynamic from "next/dynamic";
import React from "react";
import { Col, Empty, Row, Spin } from "antd";

import { TaskType } from "../../../../constants";
import { useLessonForm } from "../../../../providers";

const TextTaskEditForm = dynamic(() => import("../../../../components/TextTaskPreviewForm"), {ssr: false, loading: () => <Spin />});
const GameTaskEditForm = dynamic(() => import("../../../../components/GameTaskPreviewForm"), {ssr: false, loading: () => <Spin />});


class LessonPreviewFormProps {
  mode: "preview" | "default";
}

const TaskViewForm = {
  [TaskType.TextTask]: TextTaskEditForm,
  [TaskType.GameTask]: GameTaskEditForm
};

export const LessonPreviewForm = ({mode = "default"}: LessonPreviewFormProps) => {
  const { lesson } = useLessonForm();
  
  const tasksViews = lesson?.tasks.map((task, index) => {
    const TaskView = TaskViewForm[task.__t];
    return (
      <Col xs={24} key={index}>
        { TaskView && (<TaskView task={task} mode={mode} taskIndex={index}/>) }
      </Col>
    )
  });
  
  return (
    <Row justify="center">
      <Col xs={22}>
        <Row gutter={[0, 24]}>
          { tasksViews.length ? tasksViews : <Empty />}
        </Row>
      </Col>
    </Row>
  );
}