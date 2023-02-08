import React, { useCallback } from "react";
import { Col, Row, Space } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { TextTaskContentArea } from "../index";
import { LanguageCode, LessonType, TaskContentType } from "../../../../constants";
import { HebButton, HebForm, HebPopconfirm, HebSwitch, HebTextArea, HebTooltip } from "../../../../components/HebElements";
import { useLessonForm } from "../../../../providers";
import { TextContent } from "../../../../types";

type TextTaskContentEditFormProps = {
  __t: string;
  taskIndex: number;
  contentIndex: number;
  content: TextContent;
};

const defaultTextTaskContent = () => {
  return {
    he: "",
    he_nikkudot: "",
    __t: TaskContentType.TextContent,
    isVisibleForStudents: true
  } as TextContent;
};

export const TextTaskContentEditForm = ({
                                          __t,
                                          taskIndex,
                                          contentIndex,
                                          content = defaultTextTaskContent(),
                                          ...props
                                        }: TextTaskContentEditFormProps) => {
  const {t} = useTranslation();
  const {lesson, form, formState, updatedField, handleLessonChange, addParagraph, removeParagraph} = useLessonForm();

  const contentFieldsPrefix = `tasks[${taskIndex}].content[${contentIndex}]`;
  const hebrewContent = `${contentFieldsPrefix}.he_nikkudot`;
  const hebrewWithoutNikkudotContent = `${contentFieldsPrefix}.he`;
  const hebrewContentLabel = t(`pages.lesson.form.tasks.content.he_nikkudot.label`);
  const hebrewWithoutNikkudotContentLabel = t(`pages.lesson.form.tasks.content.he.label`);
  const yesTooltip = t("tooltips.yes");
  const noTooltip = t("tooltips.no");
  const areYouSureTooltip = t("tooltips.are_you_sure");
  const paragraphTitle = t("entities.paragraph");
  const removeParagraphTitle = t("actions.remove.entity", {entity: paragraphTitle.toLowerCase()});
  const addParagraphTitle = t("actions.add.entity", {entity: paragraphTitle.toLowerCase()});
  const hideOrShowParagraphLabel = lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents
                              ? t("pages.lesson.form.tasks.content.actions.show.label")
                              : t("pages.lesson.form.tasks.content.actions.hide.label");
  const hideOrShowParagraphTooltip = lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents
                                     ? t("tooltips.press_to_action", { action: t("pages.lesson.form.tasks.content.actions.hide.label").toLowerCase()})
                                     : t("tooltips.press_to_action", { action: t("pages.lesson.form.tasks.content.actions.show.label").toLowerCase()});

  const handleEditableContentChange = useCallback((content) => {
    handleLessonChange([{name: hebrewContent, value: content}]);
    form.setFields([{
      name: hebrewContent,
      touched: true,
      value: content
    }])
  }, [hebrewContent, form, handleLessonChange]);

  const setVisibleParagraph = useCallback(() => {
    const newVisibleState = !lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents;
    handleLessonChange([{name: `${contentFieldsPrefix}.isVisibleForStudents`, value: newVisibleState}])
  }, [contentFieldsPrefix, contentIndex, handleLessonChange, lesson?.tasks, taskIndex])

  return (
    <Space direction="vertical" style={{width: "100%"}} size="small">
      <Row gutter={8}>
        <Col hidden={lesson.type === LessonType.TEMPLATE}
             className="text-task-content__edit-from__hide-or-show-paragraph">
          <HebTooltip placement="topLeft"
                      title={nl2br(hideOrShowParagraphTooltip)}>
            <HebSwitch onChange={setVisibleParagraph}
                       checked={lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents}
                       checkedChildren={nl2br(hideOrShowParagraphLabel)}
                       unCheckedChildren={nl2br(hideOrShowParagraphLabel)}/>
          </HebTooltip>
        </Col>
      </Row>
      <Row gutter={[50, 8]} justify="center"
           align="stretch"
           className="text-task-content__edit-from__content">
        {
          lesson.studentsNativeLanguage && (
            <Col xs={24} lg={12}>
              <HebForm.Item form={form}
                            changedField={updatedField}
                            hidden={!lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents}
                            key={lesson.studentsNativeLanguage as string}
                            name={`${contentFieldsPrefix}.${lesson.studentsNativeLanguage}`}
                            initialValue={content[lesson.studentsNativeLanguage as string]}
                            label={t(`pages.lesson.form.tasks.content.${lesson.studentsNativeLanguage}.label`)}>
                <HebTextArea lang={lesson.studentsNativeLanguage as string} className="heb-paragraph"
                             name={`${contentFieldsPrefix}.${lesson.studentsNativeLanguage}`}
                             style={{unicodeBidi: "isolate-override"}}
                             placeholder={t(`pages.lesson.form.tasks.content.${lesson.studentsNativeLanguage}.placeholder`)}/>
              </HebForm.Item>
            </Col>
          )
        }
        <Col xs={24} lg={12}>
          <HebForm.Item form={form}
                        changedField={updatedField}
                        hidden={!formState.showWithoutNikkudot || !lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents}
                        required={true}
                        rules={[{required: true}]}
                        name={hebrewWithoutNikkudotContent}
                        initialValue={content.he}
                        labelCol={{span: 24, style: {marginLeft: "auto"}}}
                        label={hebrewWithoutNikkudotContentLabel}>
            <HebTextArea lang={LanguageCode.HE}
                         dir={"rtl"}
                         className="heb-paragraph"
                         name={hebrewWithoutNikkudotContent}
                         style={{unicodeBidi: "isolate", minHeight: "3rem", fontSize: "1.5rem"}}
                         placeholder={t(`pages.lesson.form.tasks.content.he.placeholder`)}/>
          </HebForm.Item>
          <HebForm.Item form={form}
                        changedField={updatedField}
                        hidden={formState.showWithoutNikkudot || !lesson?.tasks[taskIndex]?.content[contentIndex]?.isVisibleForStudents}
                        required={true}
                        rules={[
                          {required: true}
                        ]}
                        name={hebrewContent}
                        initialValue={content.he_nikkudot}
                        labelCol={{span: 24, style: {marginLeft: "auto"}}}
                        label={hebrewContentLabel}>
            <TextTaskContentArea name={hebrewContent}
                                 textTaskContent={content}
                                 onContentChanged={handleEditableContentChange}
                                 lang={LanguageCode.HE}
                                 dir={"rtl"}
                                 style={{unicodeBidi: "isolate-override", minHeight: "3rem", fontSize: "1.5rem"}}
                                 placeholder={t(`pages.lesson.form.tasks.content.he.placeholder`)}/>
          </HebForm.Item>
        </Col>
      </Row>
      <Row justify="space-between"
           gutter={[50, 10]}
           className="text-task-content__edit-from__add-or-del-paragraph">
        <Col xs={24} md={12} xxl={6}>
          <HebPopconfirm title={areYouSureTooltip}
                         okText={yesTooltip}
                         disabled={!(lesson.tasks[taskIndex].content.length > 1)}
                         cancelText={noTooltip}
                         onConfirm={() => removeParagraph(contentIndex, taskIndex)}
                         placement="bottomLeft">
            <HebButton viewType="default"
                       block={true}
                       buttonSize="over-small"
                       disabled={!(lesson.tasks[taskIndex].content.length > 1)}
                       icon={<MinusOutlined/>}>
              {removeParagraphTitle}
            </HebButton>
          </HebPopconfirm>
        </Col>
        <Col xs={24} md={12} xxl={6}>
          <HebButton onClick={() => addParagraph(contentIndex, taskIndex)} block={true} icon={<PlusOutlined/>} viewType="default" buttonSize="over-small">
            {addParagraphTitle}
          </HebButton>
        </Col>
      </Row>
    </Space>
  );
};