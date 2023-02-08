import React, { useCallback } from "react";
import Link from "next/link";
import { Button, Col, Dropdown, Menu, message, Row, Tooltip } from "antd";
import { DeleteTwoTone, EditFilled, ShareAltOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { startCase } from "lodash";

import { LanguageCode, LessonType, RoutePath } from "../../constants";
import { useLessonsService } from "../../services";
import { HebPopconfirm } from "../HebElements";
import { BaseLesson } from "../../types";
import { useNavigator } from "../../providers";

export type LessonListItemProps = BaseLesson & {
  onDelete(): void;
};

export const LessonListItem = ({
                                 _id,
                                 onDelete,
                                 studentsNativeLanguage = LanguageCode.EN,
                                 title = {
                                   he: "",
                                   he_nikkudot: ""
                                 },
                                 type = LessonType.TEMPLATE
                               }: LessonListItemProps) => {
  const {t} = useTranslation();
  const lessonsService = useLessonsService();
  const {share} = useNavigator();
  const lessonFormUrl = {
    pathname: RoutePath.LESSON_ID_PATH(RoutePath.TYPE_PATH(RoutePath.LESSONS_PATH(RoutePath.TEACHER()))),
    query: {
      type,
      lessonId: _id
    }
  };

  const shareLessonWithStudents = useCallback(async () => {
    const {protocol, port, hostname} = window.location;
    let linkForStudents = `${protocol}//${hostname}`;
    if (port) {
      linkForStudents += `:${port}`;
    }
    linkForStudents += RoutePath.LESSON_ID_PATH((RoutePath.LESSONS_PATH(RoutePath.STUDENT()))).replace(`[${RoutePath.LESSON_ID}]`, _id);
    await share(linkForStudents);
  }, [_id, share]);

  const shareLessonWithTeachers = useCallback(async () => {
    const {protocol, port, hostname} = window.location;
    const linkForStudents = `${protocol}//${hostname}:${port}` + RoutePath.LESSON_ID_PATH(RoutePath.TYPE_PATH(RoutePath.LESSONS_PATH(RoutePath.TEACHER())))
                                                                          .replace(`[${RoutePath.LESSON_ID}]`, _id)
                                                                          .replace(`[${RoutePath.TYPE}]`, type);
    share(linkForStudents);
  }, [_id, type, share]);

  const handleDeleteClick = useCallback(async () => {
    try {
      await lessonsService.deleteLessonById(_id);
      message.success(t("messages.deleted"));
      onDelete && onDelete()
    } catch (error) {
      console.error(error);
      message.warning([t("messages.failed"), error.message]);
    }
  }, [_id, t, onDelete, lessonsService]);

  const shareWithStudentsButtonTitle = t("actions.share.with_students", {entity: type.toLowerCase()});
  const shareWithTeachersButtonTitle = t("actions.share.with_teachers",
                                         {entity: type.toLowerCase()});

  const shareItems = (
    <Menu style={{padding: 0}}>
      {
        process.browser && (
          [
            <Menu.Item key={1} hidden={type === LessonType.TEMPLATE} style={{padding: 0}}>
              <Button onClick={shareLessonWithStudents}
                      icon={<ShareAltOutlined/>}
                      block
                      type="text"
                      style={{height: 40}}
                      disabled={type === LessonType.TEMPLATE}>
                {shareWithStudentsButtonTitle}
              </Button>
            </Menu.Item>,
            <Menu.Item key={2} style={{padding: 0}}>
              <Button onClick={shareLessonWithTeachers}
                      style={{height: 40}}
                      icon={<ShareAltOutlined/>}
                      type="text"
                      block>
                {shareWithTeachersButtonTitle}
              </Button>
            </Menu.Item>
          ]
        )
      }
    </Menu>
  )

  const containerNumber = Math.floor(Math.random() * 2 + 1);
  return (
    <div className={`lesson-card-container lesson-card-${containerNumber}`}>
      <Row style={{height: "100%"}}>
        <Col span={24}>
          <Row justify="space-between" gutter={[1, 1]} wrap={false}>
            <Col>
              <div className="lesson-card-language">
                {startCase(String(studentsNativeLanguage).toLowerCase())}
              </div>
            </Col>
            <Col>
              <div className="lesson-card-title" lang="he">
                {title.he_nikkudot}
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{alignSelf: "flex-end"}}>
          <Row className="lesson-card-actions" justify="center" align="middle" gutter={7} wrap={false}>
            <Col span={8} className="lesson-card-action">
              <Tooltip key="delete" title={t("actions.delete", {entity: t("entities.lesson.lesson").toLowerCase()})} placement="top">
                <HebPopconfirm title={t("tooltips.are_you_sure")} okText={t("tooltips.yes")} cancelText={t("tooltips.no")} onConfirm={handleDeleteClick} placement="right">
                  <Button type="link" block size="large" style={{height: "100%"}}>
                    <DeleteTwoTone twoToneColor={["#ff3b30", "#ff453a"]}/>
                  </Button>
                </HebPopconfirm>
              </Tooltip>
            </Col>
            <Col span={8} className="lesson-card-action">
              <Tooltip key="edit" title={t("actions.edit", {entity: t("entities.lesson.lesson").toLowerCase()})} placement="top">
                <Link href={lessonFormUrl} prefetch={false}>
                  <Button type="link" block  size="large" style={{height: "100%"}} icon={<EditFilled style={{color: "white"}}/>}/>
                </Link>
              </Tooltip>
            </Col>
            <Col span={8} className="lesson-card-action">
              <Dropdown overlay={shareItems} placement="bottomCenter" arrow>
                <Button type="link" block size="large" style={{height: "100%"}}>
                  <ShareAltOutlined style={{color: "#75ECF9"}}/>
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};