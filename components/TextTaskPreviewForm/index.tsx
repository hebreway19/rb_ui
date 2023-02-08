import React from "react";
import { Col, Row } from "antd";
import { UserRole } from "../../constants";
import { useLessonForm, useStudentTasksAnswersForm } from "../../providers";
import { FileForm } from "../../scenes/Lessons/components/Exercise/FileForm";
import { TextTaskContentListPreview } from "../../scenes/Lessons/components/TextTaskContentListPreview";
import { Task } from "../../types";
import TextExercisesPanel from "../TextExercisesPanel";

type TextTaskPreviewFromProps = {
  mode: "default" | "preview",
  task: Task,
  taskIndex: number
}

export const TextTaskPreviewForm = ({mode = "default", task, taskIndex}: TextTaskPreviewFromProps) => {
  const { formState: lessonFormState } = useLessonForm();
  const { formState: studentTasksAnswersFormState } = useStudentTasksAnswersForm();
  
  const isVisibleExercise: boolean = studentTasksAnswersFormState.exercisesIsVisible || lessonFormState.exercisesIsVisible;
  const isVisibleUploadComponent: boolean = lessonFormState.isVisibleUploadAnswerComponent || studentTasksAnswersFormState.isVisibleUploadAnswerComponent;
  const isVisibleTranslate: boolean = studentTasksAnswersFormState.isVisibleTranslate || lessonFormState.isVisibleTranslate;
  const isPreview: boolean = mode === "preview";
  
  
  return (
    <Row>
      <Col span={isPreview ? 24 : 22} hidden={isVisibleExercise}>
        {!(isVisibleExercise) && (
          <Row justify="center">
            <Col xs={24} md={isPreview && isVisibleTranslate || isVisibleTranslate ? 24 : 12 }>
              <div className="site-page-header-wrapper without-scroll" style={{padding: 0}}>
                <TextTaskContentListPreview mode={mode} task={task}/>
              </div>
            </Col>
          </Row>
        )}
      </Col>
      <Col span={isPreview ? 24 : 22} hidden={!isVisibleExercise}>
        { isVisibleExercise && isVisibleUploadComponent && (<FileForm task={task} role={UserRole.STUDENT} />) }
        { isVisibleExercise && !isVisibleUploadComponent && (
          <TextExercisesPanel role={UserRole.STUDENT} exercises={task.exercises} task={task} mode={mode}
                              taskIndex={taskIndex} />
        )}
      </Col>
    </Row>
  )
}

export default TextTaskPreviewForm;