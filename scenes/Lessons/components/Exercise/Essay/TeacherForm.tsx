import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Col, Row } from "antd";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";

import { ExerciseType } from "../../../../../constants";
import { HebButton, HebForm, HebInput, HebTypography } from "../../../../../components/HebElements";
import { ObjectUtil } from "../../../../../util";
import { LocalizedContent } from "../../../../../types";
import { useLessonForm } from "../../../../../providers";

class TeacherFormProps {
  taskIndex: number;
  exerciseIndex: number;
  essayThemeTitleList: LocalizedContent[];
  __t: string;
}

export const TeacherForm = ({
                              taskIndex,
                              exerciseIndex,
                              essayThemeTitleList = [],
                              __t = ExerciseType.Essay
                            }: TeacherFormProps) => {
  const {t} = useTranslation();
  const {
    lesson,
    form,
    updateExerciseByTaskIndexAndExerciseType
  } = useLessonForm();

  const getEssayThemeTitleFieldNameByIndex = useCallback((index: number): string => {
    return `tasks[${taskIndex}].exercises[${exerciseIndex}].essayThemeTitleList[${index}].he_nikkudot`;
  },[]);

  const essayThemeTitleFieldTitle = t("pages.lesson.form.tasks.exercises.essayThemeTitle.label");

  const addEssayTheme = useCallback(() => {
    const newEssayThemeTitleList: LocalizedContent[] = essayThemeTitleList;
    newEssayThemeTitleList.push({he_nikkudot: "", he: ""} as LocalizedContent)
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, { essayThemeTitleList: newEssayThemeTitleList });
    form.resetFields(ObjectUtil.getLeaves(lesson));
  }, [essayThemeTitleList, __t, updateExerciseByTaskIndexAndExerciseType, taskIndex]);
  const removeEssayTheme = useCallback((selectedIndex) => {
      const newEssayThemeTitleList: LocalizedContent[] = essayThemeTitleList.filter((_,
                                                                                     index) => index !== selectedIndex)
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {
        essayThemeTitleList: newEssayThemeTitleList
      });
      form.resetFields(ObjectUtil.getLeaves(lesson));
    },
    [updateExerciseByTaskIndexAndExerciseType, taskIndex, __t, essayThemeTitleList, form, lesson]);

  return (
    <div style={{width: "100%"}}>
      <Row gutter={18}>
        <Col xs={24}>
          <HebTypography.Text style={{color: "#fff"}}>{essayThemeTitleFieldTitle}</HebTypography.Text>
        </Col>
        <Col xs={24} className="exercise__essay__themes">
          <Row>
            {
              essayThemeTitleList.map((essayThemeTitle, index) => {
                return(
                  <>
                    <Col xs={20}>
                      <HebForm.Item name={getEssayThemeTitleFieldNameByIndex(index)}
                                    initialValue={essayThemeTitle.he_nikkudot}
                                    required={true}
                                    rules={[{required: true}]}
                      >
                        <HebInput lang="he"
                                  cssType="primary"
                                  dir="rtl"
                        />
                      </HebForm.Item>
                    </Col>
                    <Col xs={4}>
                      <HebButton onClick={() => removeEssayTheme(index)}
                                 overText={false}
                                 className="exercise__essay__remove-theme-item"
                                 block
                                 buttonSize="small"
                      >
                        <DeleteOutlined />
                      </HebButton>
                    </Col>
                  </>
                )
              })
            }
          </Row>
        </Col>
        <Col xs={24}>
          <HebButton onClick={addEssayTheme}
                     overText={false}
                     block
                     className="exercise__essay__add-theme-item"
                     buttonSize="small"
          >
            <PlusSquareOutlined />
          </HebButton>
        </Col>
      </Row>
    </div>
  );
}