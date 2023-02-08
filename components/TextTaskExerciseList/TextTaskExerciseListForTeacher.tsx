import React, { useCallback } from "react";
import { ExerciseType, TaskType } from "../../constants";
import { useTranslation } from "next-i18next";
import { Col, Row } from "antd";
import { HebDivider, HebPanel, HebTooltip, HebTypography } from "../HebElements";
import { useLessonForm } from "../../providers";

type TextTaskExerciseListForTeacherProps = {
  taskIndex: number,
  taskTypes: TaskType,
  
  onExerciseSelected(exerciseType: string): void,
}

export const TextTaskExerciseListForTeacher = ({taskIndex, onExerciseSelected}: TextTaskExerciseListForTeacherProps) => {
  const { t } = useTranslation();
  const { getExerciseIndexByTaskIndexAndExerciseType, lesson } = useLessonForm();
  
  const taskTypeTitle = t(`pages.lesson.form.tasks.taskType.${TaskType.TextTask}`);
  const cardTitle = t("entities.exercise.exercises");
  
  const getTitleExerciseByType = useCallback(type => t(`pages.lesson.form.tasks.exercises.types.${type}.title`), [t]);
  
  const exerciseTypeList = Object.values(ExerciseType)
    .map(type => {
        const existsExerciseInLesson = getExerciseIndexByTaskIndexAndExerciseType(taskIndex, type) > -1
          && lesson.tasks[taskIndex].exercises[getExerciseIndexByTaskIndexAndExerciseType(taskIndex, type)].isEnabled
        return (
          <Col xs={12} sm={8} lg={6} xxl={4} key={type}>
            <HebPanel type="text" active={existsExerciseInLesson}
                      hoverable={true} onClick={onExerciseSelected(type)}>
              <HebTooltip title={getTitleExerciseByType(type)}>
                <HebTypography.Text ellipsis={true} style={{color: "#fff"}}>
                  {getTitleExerciseByType(type)}
                </HebTypography.Text>
              </HebTooltip>
            </HebPanel>
          </Col>
        );
      }
    );
  
  return (
    <>
      <HebDivider>{taskTypeTitle}. {cardTitle}</HebDivider>
      <Row justify="center">
        <Col span={24}>
          <Row justify="start"
               className="lesson-form__exercises"
               gutter={[
                 {xs: 10, sm: 20, lg: 20, xxl: 20},
                 {xs: 10, sm: 20, lg: 20, xxl: 20}
               ]}>
            {exerciseTypeList}
          </Row>
        </Col>
      </Row>
    </>
  );
}