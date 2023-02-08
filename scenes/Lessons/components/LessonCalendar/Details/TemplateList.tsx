import React, { useCallback, useEffect, useState } from "react";
import { HebCard, HebTypography } from "../../../../../components/HebElements";
import { Col, Empty, Pagination, Row } from "antd";
import { useLessonsService } from "../../../../../services";
import { LessonType, RoutePath } from "../../../../../constants";
import { useTranslation } from "next-i18next";
import moment from "moment";
import { Lesson, Page } from "../../../../../types";
import { useRouter } from "next/router";

const {TEACHER, LESSONS_PATH, TYPE_PATH, ID} = RoutePath;

const TemplatePage = ({day, month, year, templateList, lessonType}) => {
  const unixDate = moment(`${year}.${month + 1}.${day}`).unix();
  const router = useRouter();
  const redirectToCreateLesson = useCallback((id) => {
    router.push(ID(TYPE_PATH(LESSONS_PATH(TEACHER()))).replace(":id", `new/${id}?date=${unixDate}`)
                                                      .replace(":type", lessonType));
  }, [router, lessonType, unixDate]);
  const templateComponentsList = templateList.map((template, index) => (
    <Col xs={8} key={index}>
      <HebCard
        onClick={() => redirectToCreateLesson(template?._id)}
        style={{
          cursor: "pointer",
          height: "100%"
        }}
      >
        <Row justify="center">
          <Col xs={24}>
            <h3 style={{color: "#000", textAlign: "center"}} dir="rtl">
              {template.title.he_nikkudot || template.title.he}
            </h3>
          </Col>
        </Row>
      </HebCard>
    </Col>
  ));
  const EmptyList = (
    <Col xs={24}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </Col>
  );

  return (
    <Row gutter={[8, 8]}>
      {templateList.length > 0 ? templateComponentsList : EmptyList}
    </Row>
  );
}

export const TemplateList = ({day, month, year, lessonType}) => {
  const lessonsService = useLessonsService();
  const {t} = useTranslation();

  const [templateList, setTemplateList] = useState<Page<Lesson>>({docs: []} as Page<Lesson>);
  const [currentPage, setCurrentPage] = useState(0);

  const loadTemplates = useCallback(async () => {
    const foundPage = await lessonsService.loadAllLessons({
                                                            type: LessonType.TEMPLATE
                                                          }, {page: currentPage, limit: 6});
    setTemplateList(foundPage);
  }, [currentPage]);

  useEffect(() => {
    loadTemplates();
  }, [currentPage, loadTemplates]);

  const templateListTitle = t("entities.lesson.templates");

  return (
    <Row gutter={[0, 8]} className={"template-list"}>
      <Col xs={24}>
        <HebTypography.Title level={4} style={{color: "#000"}}>{templateListTitle}</HebTypography.Title>
      </Col>
      <Col xs={24}>
        <TemplatePage
          month={month}
          day={day}
          year={year}
          templateList={templateList.docs}
          lessonType={lessonType}
        />
      </Col>
      <Col xs={24}>
        <Row justify="center">
          <Col>
            <Pagination current={currentPage + 1}
                        pageSize={6}
                        showLessItems={true}
                        total={templateList?.totalPages}
                        onChange={(page) => setCurrentPage(page - 1)} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}