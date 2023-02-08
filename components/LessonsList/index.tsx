import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Col, message, Pagination, Row, Spin, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

import { useLessonsService } from "../../services";
import { HebrewProficiency, RoutePath, TimeOfDay } from "../../constants";
import { HebButton, HebFilter, HebPageHeader } from "../HebElements";
import { Lesson, Page } from "../../types";
import { LessonListItem } from "../LessonListItem";
import { useMediaQuery } from "react-responsive";

const {ID, TYPE_PATH, TEACHER, LESSONS_PATH} = RoutePath;
const maxSizePage = 6;

export const LessonsList = ({type}) => {
  const {t} = useTranslation();
  const lessonsService = useLessonsService();

  const [lessonsPage, setLessonsPage] = useState<Page<Lesson>>({docs: [], totalDocs: 0} as Page<Lesson>);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterProps, setFilterProps] = useState({});
  const [searchString, setSearchString] = useState("");
  const [isFiltered, serIsFiltered] = useState(false);
  const [didLoaded, setDidLoaded] = useState(false);

  const onFilter = useCallback(async (page: number = 0) => {
    try {
      setDidLoaded(false);
      const query = {
        type,
        ...filterProps
      };
      const paginateQuery = {
        page,
        limit: maxSizePage,
        sort: {openFrom: "desc"}
      };
      const loadedPage = await lessonsService.loadAllLessons(query, paginateQuery);
      setLessonsPage(loadedPage);
    }
    catch (error) {
      console.error(error);
      message.warning([t("messages.failed"), error.message]);
    }
    finally {
      serIsFiltered(true);
      setDidLoaded(true);
    }
  }, [t, type, lessonsService, filterProps]);
  const reloadLessons = useCallback(async (page: number = 0) => {
    try {
      setDidLoaded(false);
      const loadedPage = await lessonsService.loadAllLessons({type, ...filterProps},
                                                             {
                                                               page,
                                                               limit: maxSizePage,
                                                               sort: {openFrom: "desc"}
                                                             });
      setLessonsPage(loadedPage);
    }
    catch (error) {
      console.error(error);
      message.warning([t("messages.failed"), error.message]);
    }
    finally {
      serIsFiltered(false);
      setDidLoaded(true);
    }
  }, [t, type, lessonsService, filterProps]);

  useEffect(() => {
    reloadLessons();
  }, [type]);

  const title = t(`pages.lessons.title.${type}`);
  const createNewLesson = t("actions.create.entity", {entity: t(`entities.lesson.${type}`).toLowerCase()});
  const createNewLessonTooltip = t("tooltips.press_to_action", {action: createNewLesson.toLowerCase()});
  const linkToNewLessonForm = {
    pathname: ID(TYPE_PATH(LESSONS_PATH(TEACHER()))),
    query: {
      type,
      id: "new"
    }
  };

  const showOrHideFilterButtonLabel = t("components.filter.buttons.filter.show");

  const filtersOptions = [
    {
      filterTag: "timeOfDay",
      options: [""].concat(Object.values(TimeOfDay)),
      translateTitle: t("enums.TimeOfDay.label"),
      translateOptions: (value) => t(`enums.TimeOfDay.${value.toUpperCase()}.title`)
    },
    {
      filterTag: "studentsHebrewProficiency",
      options: [""].concat(Object.values(HebrewProficiency)),
      translateTitle: t("enums.HebrewProficiency.label"),
      translateOptions: (value) => `${t(`enums.HebrewProficiency.${value.toUpperCase()}.title`)} - ${t(`enums.HebrewProficiency.${value.toUpperCase()}.tooltip`)}`
    }
  ];

  const isFullHdDisplay = useMediaQuery({query: "(min-width: 1918px)"});

  return (
    <div>
      <HebPageHeader ghost={!didLoaded}
                     title={title}/>
      <Row justify="center">

        <Col span={22}>
          <Row className="lessons-list-header" justify="end" style={{marginLeft: 0, marginRight: 0}}>
            <Col xs={24} xl={12}>
              <Row justify="space-around" gutter={[0, 12]}>
                <Col xs={23} sm={11}>
                  <HebButton icon={<FilterOutlined/>} block={true} buttonSize="small" viewType={"secondary"} className="lessons-list-button border-yellow"
                             onClick={() => setIsFilterVisible(oldState => !oldState)}>
                    {showOrHideFilterButtonLabel}
                  </HebButton>
                </Col>
                <Col xs={23} sm={11}>
                  <Tooltip key="1" title={createNewLessonTooltip}>
                    <Link href={linkToNewLessonForm}>
                      <HebButton block={true} buttonSize="small" className="lessons-list-button" viewType="primary-v2">
                        {createNewLesson}
                      </HebButton>
                    </Link>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={22}>
          <Spin style={{width: "100%"}} spinning={!didLoaded}>
            <Row className="lessons-list" justify="center">
              <Col xs={23} sm={23}>
                <Row justify="start"
                     gutter={[{xs: 0, sm: 15, md: 19, xl: 23, xxl: isFullHdDisplay ? 109 : 45}, {xs: 10, sm: 15, md: 19, xl: 23, xxl: 45}]}>
                  {
                    lessonsPage.docs.map((item) => (
                        <Col key={item._id}>
                          <LessonListItem onDelete={() => reloadLessons(lessonsPage?.page || 1)} {...item}/>
                        </Col>
                      )
                    )}
                </Row>
              </Col>
              <Col span={24} style={{textAlign: "center"}}>
                {
                  lessonsPage.docs.length > 0 && <Pagination onChange={isFiltered ? onFilter : reloadLessons}
                                                             pageSize={maxSizePage}
                                                             total={lessonsPage.totalDocs}
                                                             showSizeChanger={false}/>
                }
              </Col>
            </Row>
          </Spin>
        </Col>
      </Row>
      <HebFilter.WithDrawer onClose={() => setIsFilterVisible(false)}
                            setFilterProps={setFilterProps}
                            isVisible={isFilterVisible}
                            paginateOptions={{
                              page: lessonsPage.page,
                              limit: maxSizePage,
                              sort: {openFrom: "desc"}
                            }}
                            searchOptions={{path: "$text.$search"}}
                            filtersOptions={filtersOptions}
                            filterCallback={lessonsService.loadAllLessons.bind(lessonsService)}
                            setItemsPage={setLessonsPage}
                            setSearchString={setSearchString}
                            specificFilteringOptions={{type: type}}
                            onCloseFilter={() => setIsFilterVisible(false)}
      />
    </div>
  );
};