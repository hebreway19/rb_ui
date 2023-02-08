import React, { useCallback } from "react";
import moment from "moment";
import Icon, { CopyOutlined } from "@ant-design/icons";
import { Col, DatePicker, Descriptions, Row, Select, Space } from "antd";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";

import { HebButton, HebDatePicker, HebDivider, HebEnumRadioGroup, HebForm, HebSelect, HebTooltip } from "../../../../components/HebElements";
import { AccessType, HebrewProficiency, LanguageCode, LessonType, MediaContentVisibleForStudent, TimeOfDay } from "../../../../constants";
import { useLessonForm } from "../../../../providers";

const {RangePicker} = DatePicker;
const {Option} = Select;

export const LessonParamsPanel = ({...props}) => {
  const {t} = useTranslation();
  const {
    lesson, formState, updateFormStateField, createCopyFromLesson,
    getLessonFormFieldLabel, updatedField, form,
    getLessonFormFieldTooltip,
    getLessonFormFieldPlaceholder
  } = useLessonForm();

  const accessPeriodLabel = getLessonFormFieldLabel("accessPeriod");
  const accessPeriodTooltip = getLessonFormFieldTooltip("accessPeriod");

  const studentsNativeLanguagesLabel = getLessonFormFieldLabel("studentsNativeLanguages");
  const studentsNativeLanguagesTooltip = getLessonFormFieldTooltip("studentsNativeLanguages");
  const studentsNativeLanguagesPlaceholder = getLessonFormFieldPlaceholder("studentsNativeLanguages");

  const showWithoutNikkudotLabel = getLessonFormFieldLabel("showWithoutNikkudot");
  const showWithoutNikkudotTooltip = getLessonFormFieldTooltip("showWithoutNikkudot");

  const lessonParamsLabel = getLessonFormFieldLabel("lessonParams");
  const lessonParamsTooltip = getLessonFormFieldTooltip("lessonParams");

  const additionalActionsLabel = getLessonFormFieldLabel("additionalActions");
  const additionalActionsTooltip = getLessonFormFieldTooltip("additionalActions");
  const getCreateLessonBasedByType = useCallback((lessonType, basedLessonType) => 
                                                 t(`pages.lessons.actions.create_lesson_based.entity.based_on_sub_entity`, 
                                                    {entity: lessonType, subEntity: basedLessonType}), [t]);

  const languageOptions = [<Option key='none' value=''>{t("language.none")}</Option>];
  languageOptions.push(...Object.values(LanguageCode)
                                .filter(languageKey => !(languageKey === LanguageCode.HE || languageKey === LanguageCode.HE_NIKKUDOT))
                                .map(languageKey =>
                                       (<HebSelect.Option key={languageKey} value={languageKey}>
                                         {t(`language.${languageKey}`)}
                                       </HebSelect.Option>)));

  return (
    <>
      <HebDivider>
        {lessonParamsLabel}
      </HebDivider>
      <Descriptions size="small"
                    column={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 3}}
                    layout="vertical">
        <Descriptions.Item>
          <HebForm.Item form={form}
                        changedField={updatedField}
                        name="studentsNativeLanguage"
                        label={studentsNativeLanguagesLabel}
                        initialValue={lesson.studentsNativeLanguage}
                        tooltip={studentsNativeLanguagesTooltip}>
            <HebSelect circular={true}
                       type="filter"
                       placeholder={studentsNativeLanguagesPlaceholder}
                       value={lesson.studentsNativeLanguage}>
              {languageOptions}
            </HebSelect>
          </HebForm.Item>
        </Descriptions.Item>
        {
          lesson.type !== LessonType.TEMPLATE && (
            <Descriptions.Item>
              <HebForm.Item name="accessPeriod"
                            form={form}
                            changedField={updatedField}
                            required={true}
                            rules={[
                              {required: true}
                            ]}
                            initialValue={
                              lesson.type === LessonType.EXAM
                                ? [moment(lesson.openFrom), moment(lesson.openTo)]
                                : moment(lesson.openFrom)
                            }
                            label={formState.isExpertMode && accessPeriodLabel}
                            tooltip={accessPeriodTooltip}
              >
                {lesson.type === LessonType.EXAM
                 ? (<RangePicker showTime
                                 disabled={!formState.isExpertMode}
                                 style={{marginRight: "1rem"}}
                                 format="YYYY/MM/DD HH:mm"/>)
                 : lesson.type === LessonType.LESSON && (<HebDatePicker/>)
                }
              </HebForm.Item>
            </Descriptions.Item>)}
        <Descriptions.Item>
          <HebEnumRadioGroup enumType={HebrewProficiency}
                             isTooltipVisible={false}
                             contentDirection="rtl"
                             enumTypeName="HebrewProficiency"
                             formItemProps={{
                               lang: "he",
                               name: "studentsHebrewProficiency",
                               initialValue: lesson.studentsHebrewProficiency,
                               required: true,
                               rules: [
                                 {required: true}
                               ]
                             }}/>
        </Descriptions.Item>
        {lesson.type === LessonType.EXAM && (
          <Descriptions.Item>
            <HebEnumRadioGroup enumType={MediaContentVisibleForStudent} enumTypeName="MediaContentVisibleForStudent" formItemProps={{
              name: "isMediaContentVisibleForStudent",
              initialValue: lesson.isMediaContentVisibleForStudent,
              required: true,
              rules: [
                {required: true}
              ]
            }}/>
          </Descriptions.Item>
        )}
        {lesson.type !== LessonType.TEMPLATE && (
          <Descriptions.Item>
            <HebEnumRadioGroup enumType={AccessType} enumTypeName="AccessType" formItemProps={{
              name: "accessType",
              initialValue: lesson.accessType,
              disabled: true,
              required: true,
              rules: [
                {required: true}
              ]
            }}/>
          </Descriptions.Item>
        )}
        {lesson.type === LessonType.LESSON && (
          <Descriptions.Item>
            <HebEnumRadioGroup enumType={TimeOfDay} enumTypeName="TimeOfDay" formItemProps={{
              name: "timeOfDay",
              initialValue: lesson.timeOfDay,
              required: true,
              rules: [
                {required: true}
              ]
            }}/>
          </Descriptions.Item>
        )}
      </Descriptions>
      <HebDivider>
          {additionalActionsLabel}
      </HebDivider>
      <Row gutter={[8, 8]}>
        {
          !formState.isNewLesson && (
            <>
              <Col xs={0} xxl={8}>
                <HebButton viewType="primary-v2"
                           block
                           buttonSize="over-small"
                           onClick={createCopyFromLesson(LessonType.LESSON)}
                           icon={<CopyOutlined/>}>
                  {nl2br(getCreateLessonBasedByType(t("entities.lesson.lesson").toLowerCase(), t(`entities.lesson.${lesson.type}_r`).toLowerCase()))}
                </HebButton>
              </Col>
              <Col xs={0} xxl={8}>
                <HebButton block
                           viewType="primary-v2"
                           buttonSize="over-small"
                           onClick={createCopyFromLesson(LessonType.EXAM)}
                           icon={<CopyOutlined/>}>
                  {nl2br(getCreateLessonBasedByType(t("entities.lesson.exam").toLowerCase(), t(`entities.lesson.${lesson.type}_r`).toLowerCase()))}
                </HebButton>
              </Col>
            </>
          )
        }
        <Col xs={0} xxl={8}>
          <HebTooltip title={showWithoutNikkudotTooltip}>
            <HebButton icon={<Icon title={formState.showWithoutNikkudot ? "א" : "אָ"}
                                   component={() => formState.showWithoutNikkudot ? <span>"א"</span> : <span>"אָ"</span>}/>}
                       block
                       buttonSize="over-small"
                       viewType={formState.showWithoutNikkudot ? "primary-v2" : "primary"}
                       onClick={() => updateFormStateField("showWithoutNikkudot",
                         !formState.showWithoutNikkudot)}>
              {showWithoutNikkudotLabel}
            </HebButton>
          </HebTooltip>
        </Col>
        <Col xs={24} xxl={0}>
          <Space direction="vertical" size={8} style={{width: "100%"}}>
            {
              !formState.isNewLesson && (
                <>
                  <Row justify="center">
                    <Col xs={24} md={12}>
                      <HebButton viewType="primary-v2"
                                 block
                                 buttonSize="over-small"
                                 onClick={createCopyFromLesson(LessonType.LESSON)}
                                 icon={<CopyOutlined/>}>
                        {nl2br(getCreateLessonBasedByType(t("entities.lesson.lesson").toLowerCase(), t(`entities.lesson.${lesson.type}_r`).toLowerCase()))}
                      </HebButton>
                    </Col>
                  </Row>
                  <Row justify="center">
                    <Col xs={24} md={12}>
                      <HebButton block
                                 viewType="primary-v2"
                                 buttonSize="over-small"
                                 onClick={createCopyFromLesson(LessonType.EXAM)}
                                 icon={<CopyOutlined/>}>
                        {nl2br(getCreateLessonBasedByType(t("entities.lesson.exam").toLowerCase(), t(`entities.lesson.${lesson.type}_r`).toLowerCase()))}
                      </HebButton>
                    </Col>
                  </Row>
                </>
              )
            }
            <Row justify="center">
              <Col xs={24} md={12}>
                <HebTooltip title={showWithoutNikkudotTooltip}>
                  <HebButton icon={<Icon title={formState.showWithoutNikkudot ? "א" : "אָ"}
                                         component={() => formState.showWithoutNikkudot ? <span>"א"</span> : <span>"אָ"</span>}/>}
                             block
                             buttonSize="over-small"
                             viewType={formState.showWithoutNikkudot ? "primary-v2" : "primary"}
                             onClick={() => updateFormStateField("showWithoutNikkudot",
                               !formState.showWithoutNikkudot)}>
                    {showWithoutNikkudotLabel}
                  </HebButton>
                </HebTooltip>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </>
  );
};