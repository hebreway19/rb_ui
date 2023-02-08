import React, { useCallback } from "react";
import { Button, Col, Dropdown, Menu, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useMediaQuery } from "react-responsive";
import nl2br from "react-nl2br";

import { LessonState, LessonType } from "../../../../constants";
import { DeleteTwoTone, QuestionCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
import { HebButton, HebPopconfirm, HebTooltip } from "../../../../components/HebElements";
import { useLessonForm } from "../../../../providers";

export const LessonPageExtra = ({setIsTourOpen}) => {
  const {t} = useTranslation();
  const {
    lesson,
    formState,
    form,
    removeLesson,
    shareLessonWithTeachers,
    updateFormStateField,
    shareLessonWithStudents,
    getLessonFormFieldLabel,
    getLessonFormFieldTooltip,
    isPageStateEqualToTarget,
    changePageState
  } = useLessonForm();

  const lessonTypeTitle = t(`entities.lesson.${lesson.type}`);
  const shareGroupTitle = t("actions.share.plain");

  const shareWithTeachersButtonTitle = t("actions.share.with_teachers", {entity: lessonTypeTitle.toLowerCase()});
  const shareWithStudentsButtonTitle = t("actions.share.with_students", {entity: lessonTypeTitle.toLowerCase()});

  const saveButtonTitle = formState.isNewLesson
    ? t("actions.create.entity", {entity: lessonTypeTitle.toLowerCase()})
    : t("actions.save", {entity: lessonTypeTitle.toLowerCase()});
  const saveButtonTooltip = formState.isNewLesson
    ? t("tooltips.press_to_action",
        {action: t("actions.create.entity", {entity: lessonTypeTitle.toLowerCase()}).toLowerCase()})
    : t("tooltips.press_to_action", {action: t("actions.save", {entity: lessonTypeTitle.toLowerCase()}).toLowerCase()});

  const tourTooltip = t("tooltips.press_to_action", {action: t("actions.show.entity", {entity: t('entities.tour')}).toLowerCase()});

  const expertModeLabel = getLessonFormFieldLabel("expertMode");
  const expertModeTooltip = getLessonFormFieldTooltip("expertMode");
  const previewModeTooltip = getLessonFormFieldTooltip("preview");
  const previewModeDisabledTooltip = getLessonFormFieldTooltip("previewDisabled");
  const previewModeLabel = getLessonFormFieldLabel("preview");
  const isPreviewMode = isPageStateEqualToTarget(LessonState.PREVIEW);

  const toggleExpertMode = useCallback(() => updateFormStateField("isExpertMode", !formState.isExpertMode),
                                       [formState.isExpertMode, updateFormStateField]);


  const isMediumScreen = useMediaQuery({query: "(min-width: 768px)"});
  const isLargeScreen = useMediaQuery({query: "(max-width: 1366px)"});
  const isRetinaPropsDisplayed = (isMediumScreen && isLargeScreen);

  return (
    <Row gutter={[15, 19]} justify="end" align="middle">
      <Col xs={24} md={2}>
        <HebTooltip placement="left"
                    title={nl2br(tourTooltip)}>
          <HebButton indicatorLine={false}
                     viewType="default"
                     overText={false}
                     buttonSize="over-small"
                     block
                     onClick={() => setIsTourOpen(true)}
                     icon={<QuestionCircleOutlined style={{fontSize: "1.25rem"}}/>}/>
        </HebTooltip>
      </Col>
      <Col xs={24} md={isRetinaPropsDisplayed ? 8 : 6}>
        <HebTooltip title={nl2br(saveButtonTooltip)} placement="bottom">
          <HebButton viewType="primary-v2"
                     overText={false}
                     buttonSize="over-small"
                     block
                     onClick={form.submit}>
            {saveButtonTitle}
          </HebButton>
        </HebTooltip>
      </Col>
      {
        !formState.isNewLesson && (
          <Col xs={24} md={isRetinaPropsDisplayed ? 6 : 5}>
            <Dropdown overlay={
              <Menu style={{padding: 0}}>
                {
                  process.browser && (
                    [
                      <Menu.Item key={1} style={{padding: 0}}>
                        <Button block type="text" size={"large"} disabled={formState.isNewLesson} icon={<ShareAltOutlined/>} onClick={shareLessonWithTeachers}>
                          {shareWithTeachersButtonTitle}
                        </Button>
                      </Menu.Item>,
                      <Menu.Item key={2} style={{padding: 0}}>
                        {lesson.type !== LessonType.TEMPLATE && (
                          <Button block type="text" size={"large"} disabled={formState.isNewLesson} icon={<ShareAltOutlined/>} onClick={shareLessonWithStudents}>
                            {shareWithStudentsButtonTitle}
                          </Button>
                        )}
                      </Menu.Item>
                    ]
                  )
                }
              </Menu>
            }>
              <HebButton
                indicatorLine={false}
                viewType={"primary-v2"}
                buttonSize="over-small"
                block
                icon={<ShareAltOutlined/>}
                overText={false}>
                {shareGroupTitle}
              </HebButton>
            </Dropdown>
          </Col>
        )
      }
      <Col xs={24} md={isRetinaPropsDisplayed ? formState.isNewLesson ? 14 : 6 : 4}>
        <HebTooltip title={expertModeTooltip} placement="bottom">
          <HebButton
            indicatorLine={false}
            overText={false}
            viewType={formState.isExpertMode ? "primary" : "secondary"}
            buttonSize="over-small"
            block
            onClick={toggleExpertMode}>
            {expertModeLabel}
          </HebButton>
        </HebTooltip>
      </Col>
      {
        !formState.isNewLesson && isLargeScreen &&
        (<Col xs={24} md={2}>
          <HebPopconfirm title={t("tooltips.are_you_sure")}
                         okText={t("tooltips.yes")}
                         onConfirm={removeLesson}
                         cancelText={t("tooltips.no")}
                         placement="bottom">
            <HebButton icon={<DeleteTwoTone style={{fontSize: "1.25rem"}} twoToneColor={["#ff3b30", "#ff453a"]}/>}
                       viewType="default"
                       block
                       buttonSize="over-small"
                       overText={false}/>
          </HebPopconfirm>
        </Col>)
      }
      <Col {...isRetinaPropsDisplayed ? {} : {xs: 24, md: formState.isNewLesson ? 11 : 6} } >
        <HebTooltip title={!lesson._id ? previewModeDisabledTooltip : previewModeTooltip} placement="bottom">
          <HebButton
            viewType={isPreviewMode ? "primary" : "primary-v2"}
            buttonSize="over-small"
            disabled={!lesson._id}
            overText={!isMediumScreen}
            block
            onClick={changePageState(LessonState.PREVIEW)}>
            {previewModeLabel}
          </HebButton>
        </HebTooltip>
      </Col>
      {
        !formState.isNewLesson && !isLargeScreen &&
        (<Col xs={24} md={2} lg={1}>
          <HebPopconfirm title={t("tooltips.are_you_sure")}
                      okText={t("tooltips.yes")}
                      onConfirm={removeLesson}
                      cancelText={t("tooltips.no")}
                      placement="bottom">
            <HebButton icon={<DeleteTwoTone style={{fontSize: "1.25rem"}} twoToneColor={["#ff3b30", "#ff453a"]}/>}
                       viewType="default"
                       block
                       buttonSize="over-small"
                       overText={false}/>
          </HebPopconfirm>
        </Col>)
      }
    </Row>
  );
};