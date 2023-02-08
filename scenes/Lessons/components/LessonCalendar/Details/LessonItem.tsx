import React, { useCallback } from "react";
import { Avatar, Col, List, Menu, Row } from "antd";
import { useTranslation } from "next-i18next";
import { HebButton, HebDropdown, HebTooltip } from "../../../../../components/HebElements";
import { EditOutlined, MenuOutlined, ShareAltOutlined } from "@ant-design/icons";
import nl2br from "react-nl2br";
import Link from "next/link";
import { RoutePath, UserRole } from "../../../../../constants";
import { useAuth } from "../../../../../shared/hooks";
import { RouteUrl } from "../../../../../types";
import { useNavigator } from "../../../../../providers";

const {
  TEACHER,
  LESSONS_PATH,
  STUDENT_TASKS_ANSWERS_PATH,
  STUDENT,
  LESSON_ID,
  LESSON_ID_PATH
} = RoutePath;

export const LessonItem = ({lesson}) => {
  const {t} = useTranslation();
  const {user} = useAuth();
  const {share} = useNavigator();

  const editLink: RouteUrl = LESSON_ID_PATH(LESSONS_PATH(TEACHER()));
  const showLink: RouteUrl = LESSON_ID_PATH(LESSONS_PATH(STUDENT()));
  const getTaskAnswersLinkByLessonId = useCallback(lessonId => () => `${STUDENT_TASKS_ANSWERS_PATH(TEACHER())}?lesson=${lessonId}`, []);
  const getHebrewProficiencyLabel = useCallback((proficiency) =>
                                                  t(`enums.HebrewProficiency.${proficiency.toUpperCase()}.title`),
                                                [t]);
  const getEntityByType = useCallback((type) => t(`entities.lesson.${type}`), [t]);
  const timeOfDayLabel = t("enums.TimeOfDay.label");
  const getTimeOfDayTitle = useCallback((timeOfDay) =>
                                          t(`enums.TimeOfDay.${timeOfDay.toUpperCase()}.title`),
                                        [t]);
  const getTimeOfDayTooltip = useCallback((timeOfDay) =>
                                            t(`enums.TimeOfDay.${timeOfDay.toUpperCase()}.tooltip`),
                                          [t]);
  const getEditLessonLabelByType = useCallback((typeLesson) =>
                                                 t("actions.edit",
                                                   {entity: t(`entities.lesson.${typeLesson}`).toLowerCase()}),
                                               [t]);
  const sharePlainText = t("actions.share.plain");

  const getShareWithTeachersLessonLabelByType = useCallback((typeLesson) => t("actions.share.with_teachers", {entity: getEntityByType(typeLesson).toLowerCase()}),
                                                            [t, getEntityByType]);

  const getShareWithStudentsLessonLabelByType = useCallback((typeLesson) => t("actions.share.with_students", {entity: getEntityByType(typeLesson).toLowerCase()}),
                                                            [t, getEntityByType]);

  const goToAnswersLabel = t("components.calendar.details.actions.go_to_answer.label");

  const shareByPath = useCallback(async (path) => {
    const {protocol, port, hostname} = window.location;
    const linkForStudents = `${protocol}//${hostname}:${port}` + path;
    share(linkForStudents);
  }, [t, share]);

  const shareMenu = (
    <Menu style={{padding: 0}}>
      <Menu.Item style={{padding: 0}}>
        <HebButton className="share-dropdown__button" viewType="text" buttonSize="small" icon={<ShareAltOutlined/>} onClick={() => shareByPath(editLink.replace(`[${LESSON_ID}]`, lesson._id))}>
          {nl2br(getShareWithTeachersLessonLabelByType(lesson.type))}
        </HebButton>
      </Menu.Item>
      <Menu.Item style={{padding: 0}}>
        <HebButton className="share-dropdown__button" viewType="text" buttonSize="small" icon={<ShareAltOutlined/>} onClick={() => shareByPath(showLink.replace(`[${LESSON_ID}]`, lesson._id))}>
          {nl2br(getShareWithStudentsLessonLabelByType(lesson.type))}
        </HebButton>
      </Menu.Item>
    </Menu>
  )

  return (
    <List.Item
      className="day-details__list-item"
    >
      <List.Item.Meta
        avatar={
          <Avatar className="studentsHebrewProficiency">
            {getHebrewProficiencyLabel(lesson?.studentsHebrewProficiency)}
          </Avatar>
        }
        title={
          <span className="title">
            {lesson?.title?.he_nikkudot || lesson?.title?.he}
          </span>
        }
      />
      <div className="day-details__info">
        { `${timeOfDayLabel}: ` }
        <HebTooltip
          placement="top"
          title={ getTimeOfDayTooltip(lesson?.timeOfDay) }
        >
          { getTimeOfDayTitle(lesson?.timeOfDay) }
        </HebTooltip>
      </div>
      <Row className="dat-details__actions" gutter={[18, 18]}>
        <Col xs={24} md={9} hidden={user?.role === UserRole.STUDENT }>
          <Link href={editLink.replace("[id]", lesson._id)}>
            <HebButton
              block
              overText={false}
              viewType="secondary"
              buttonSize="over-small"
              icon={<EditOutlined />}
            >{nl2br(getEditLessonLabelByType(lesson.type))}</HebButton>
          </Link>
        </Col>
        <Col xs={24} md={6} hidden={user?.role === UserRole.STUDENT }>
          <HebDropdown overlay={shareMenu} placement="bottomLeft" arrow>
            <HebButton
              block
              viewType="secondary"
              overText={false}
              buttonSize="over-small"
              icon={<ShareAltOutlined />}
            >{sharePlainText}</HebButton>
          </HebDropdown>
        </Col>
        <Col xs={24} md={9} hidden={user?.role === UserRole.STUDENT}>
          <Link href={getTaskAnswersLinkByLessonId(lesson._id)()}>
            <HebButton
              block
              viewType="secondary"
              overText={false}
              buttonSize="over-small"
              icon={<MenuOutlined />}
            >{goToAnswersLabel}</HebButton>
          </Link>
        </Col>
      </Row>
    </List.Item>
  )
}