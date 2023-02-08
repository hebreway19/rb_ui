import React, { useCallback, useState } from "react";
import { Col, Row, Space } from "antd";
import { useTranslation } from "next-i18next";
import { HebPanel, HebTooltip, HebTypography } from "../../../../../components/HebElements";
import { ExerciseType, ViewModes } from "../../../../../constants";
import { Exercise } from "../../../../../types";

type TextTaskExerciseListForStudentProps = {
  exercises: Exercise[],
  mode?: ViewModes,
  
  onExerciseSelected(value: any): void
}

export const TextTaskExerciseListForStudent = ({exercises, mode = ViewModes.DEFAULT, onExerciseSelected}: TextTaskExerciseListForStudentProps) => {
  const {t} = useTranslation()
  const [selectedExerciseMeta, setSelectedExerciseMeta] = useState({__t: "", _id: ""});
  const currentExercises = exercises.filter(({__t, _id}) => Object.values(ExerciseType).includes(__t as ExerciseType));
  
  const getTitleExerciseByType = useCallback(type => t(`pages.lesson.form.tasks.exercises.types.${type}.title`), [t]);
  const colSizes = mode === "preview"
    ? {xs: 12, sm: 12, lg: 12, xxl: 4}
    : {xs: 12, sm: 8, lg: 6, xxl: 4}
  return (
    <Space direction="vertical"
           style={{width: "100%"}}>
      <Row>
        <Col xs={24}>
          <Row justify="start"
               className="lesson-form__exercises"
               gutter={[
                 {xs: 10, sm: 20, lg: 20, xxl: 20},
                 {xs: 10, sm: 20, lg: 20, xxl: 20}
               ]}>
            {
              currentExercises.map(({__t, _id, ...exercise}, index) => exercise.isEnabled && (
                <Col {...colSizes} key={index}>
                  <HebPanel hoverable={true}
                            active={selectedExerciseMeta.__t === __t}
                            onClick={() => {
                              onExerciseSelected({__t, _id, ...exercise});
                              setSelectedExerciseMeta({__t, _id});
                            }}>
                    <HebTooltip title={getTitleExerciseByType(__t)}>
                      <HebTypography.Text ellipsis={true} style={{color: "#fff", ...mode === "preview" && ({fontSize: ".8rem"})}}>
                        {getTitleExerciseByType(__t)}
                      </HebTypography.Text>
                    </HebTooltip>
                  </HebPanel>
                </Col>
              ))
            }
          </Row>
        </Col>
      </Row>
    </Space>
  );
}