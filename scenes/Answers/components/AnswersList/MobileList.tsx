import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, List, Menu, Pagination, Row } from "antd";
import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";

import { Case, Switch } from "../../../../shared/components";
import { HebDropdown, HebInput } from "../../../../components/HebElements";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../../shared/hooks";
import { useStudentTasksAnswersAnswerList } from "../../../../providers";
import { RoutePath, StudentTasksAnswersState, UserRole } from "../../../../constants";
import { useRouter } from "next/router";
import { StudentTasksAnswers } from "../../../../types";

const listStates = {
  main: "main",
  lessons: "lessons",
  date: "date",
  groups: "group",
  students: "students"
}
const {
  TEACHER,
  STUDENT,
  STUDENT_TASKS_ANSWERS_PATH
} = RoutePath;

export const MainList = ({setMobileState, user}) => {
  const dataSource = Object.values(listStates).slice(1)
    .filter(item => !(user?.role === UserRole.STUDENT && item === listStates.students));
  const {t} = useTranslation();
  const getLabelByItem = useCallback((item) => t(`pages.answer.table.${item}`), [t]);
  return (
    <List className="list-main"
          dataSource={dataSource}
          renderItem={(item, index) => (
            <List.Item className="list-main-item"
                       key={index}
                       onClick={() => setMobileState(item)} >
              {getLabelByItem(item)}
            </List.Item>
          )}/>
  );
}

  export const LessonStartDate = ({answerList = [], setSelectedDate, setMobileState}) => {
  const {t} = useTranslation();
  const dateList: string[] = answerList.map(item => item?.lesson?.openFrom || undefined)
                                       .filter((item) => item !== undefined);
  return (
    <List className="list-data"
          dataSource={dateList}
          renderItem={(item) => (
            <List.Item className="list-data-item"
                       onClick={() => {
                         setSelectedDate(item)
                         setMobileState(listStates.lessons);
                       }} >
              {moment(item).format(t("date_format"))}
            </List.Item>
          )}/>
  );
}

export type LessonListProps = {
  answerList: StudentTasksAnswers[];
  selectedDate: any;
  redirectToTaskAnswerPageByIdTaskAnswerAndUserRole(userRole: string,
                                                    lessonId: string,
                                                    studentTasksAnswersId: string,
                                                    isFinished: boolean): Promise<void>;
}

export const LessonList = ({
                      answerList = [],
                      selectedDate,
                      redirectToTaskAnswerPageByIdTaskAnswerAndUserRole,
}: LessonListProps) => {
  const router = useRouter();
  const {user} = useAuth();
  let lessonList = answerList.map(item => item?.lesson || undefined)
                             .filter(item => item !== undefined);
  if (selectedDate) {
    lessonList = lessonList.filter(item => moment(item.openFrom).unix() < (moment(selectedDate).unix() + 86400) ||
      moment(item.openFrom).unix() > (moment(selectedDate).unix() - 86400));
  }
  return (
    <List className="list-data"
          dataSource={lessonList}
          renderItem={(item, index) => (
            <List.Item className="list-data-item"
                       onClick={() => redirectToTaskAnswerPageByIdTaskAnswerAndUserRole(user.role,
                                                                                        item?._id,
                                                                                        answerList[index]._id,
                                                                                        answerList[index].state === StudentTasksAnswersState.FINISHED)
                       }
            >
              {item?.title?.he_nikkudot || item?.title?.he || ""}
            </List.Item>
          )}/>
  );
}

type GroupListProps = {
  answerList: StudentTasksAnswers[]
}

export const GroupList = ({answerList = []}: GroupListProps) => {
  let groupList = answerList.map(item => item?.group || undefined)
                            .filter(item => item !== undefined);
  return (
    <List className="list-data"
          dataSource={groupList}
          renderItem={(item) => (
            <List.Item className="list-data-item" >
              {item?.name}
            </List.Item>
          )} />
  );
}

export const StudentListItem = ({item, role, index, selectedIndex, setSelectedIndex}) => {
  const {t} = useTranslation();
  const { createStudentTasksAnswersPath } = useStudentTasksAnswersAnswerList();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(oldState => selectedIndex !== index ? false : oldState);
  }, [selectedIndex]);

  const showDetails = useCallback(() => {
    setIsVisible(true);
    setSelectedIndex(index);
  }, [setSelectedIndex, index]);

  return (
    <List.Item className="list-data-item">
      <div hidden={!isVisible} className="list-data-item__info">
        <div className="close-icon">
          <CloseOutlined onClick={() => setIsVisible(false)} />
        </div>
        <Row style={{height: "100%"}} align="middle">
          <Col xs={24}>
            {t("pages.answers.table.lesson_openFrom.label")}: <span>{moment(item?.openFrom).format(t("date_format"))}</span>
          </Col>
          <Col xs={24}>
            {t("pages.answers.table.is_checked.label")}: <span>{item?.openFrom ? t("pages.answers.table.is_checked.checked.tooltip")
            : t("pages.answers.table.is_checked.unchecked.tooltip")}</span>
          </Col>
        </Row>
      </div>
      <Row style={{width: "100%"}}>
        <Col flex={9} onClick={showDetails}>
          {`${item.student?.firstname} ${item.student?.surname}`}
        </Col>
        <Col flex={1}
             style={{textAlign: "right"}}>
          <Link passHref
                href={createStudentTasksAnswersPath(role,
                                                    item.lesson,
                                                    item.studentTasksAnswers,
                                                    item.state === StudentTasksAnswersState.FINISHED)}>
            <Button type="text" icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 11H22V13H15V11ZM16 15H22V17H16V15ZM14 7H22V9H14V7ZM4 19H14V18C14 15.243 11.757 13 9 13H7C4.243 13 2 15.243 2 18V19H4ZM8 12C9.995 12 11.5 10.495 11.5 8.5C11.5 6.505 9.995 5 8 5C6.005 5 4.5 6.505 4.5 8.5C4.5 10.495 6.005 12 8 12Z"
                  fill="#686868"/>
              </svg>
            } />
          </Link>
        </Col>
      </Row>
    </List.Item>
  )
}

const StudentList = ({answerList = [], role}) => {
  const studentList = answerList.map(item => ({
    student: item?.student,
    studentTasksAnswers: item?._id,
    lesson: item?.lesson?._id,
    isFinished: item?.isFinished,
    openFrom: item?.lesson?.openFrom
  }));
  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    <List className="list-data"
          dataSource={studentList}
          renderItem={(item, index) => <StudentListItem item={item}
                                                        index={index}
                                                        selectedIndex={selectedIndex}
                                                        setSelectedIndex={setSelectedIndex}
                                                        role={role} />}/>
  );
}

export const MobileList = () => {
  const {user} = useAuth();
  const router = useRouter();
  const {
    studentTasksAnswersPage,
    loadStudentTaskAnswersByQueryAndPagination,
    redirectToTaskAnswerPageByIdTaskAnswerAndUserRole
  } = useStudentTasksAnswersAnswerList();
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [mobileState, setMobileState] = useState(listStates.main);
  const [currentPage, setCurrentPage] = useState(1);
  const {t} = useTranslation();
  const query = router.query;
  const getLabelByItem = useCallback((item) => t(`pages.answer.table.${item}`), [t]);

  useEffect(() => {
    setMobileState(oldState => query.lesson != null ? listStates.students : oldState);
  }, [query]);

  const onSearch = useCallback(async (value = "") => {
    let foundAnswers = []
    if (value.trim() !== "") {
      foundAnswers = await loadStudentTaskAnswersByQueryAndPagination(
        {
          "lesson.title.he": value
        },
        {
          page: currentPage,
          limit: 6
        })
    }
    setMobileState(oldState => foundAnswers.length > 0 ? listStates.lessons : oldState);
  }, [loadStudentTaskAnswersByQueryAndPagination, currentPage]);

  const onFilter = useCallback((value) => {
    let queryParams: any = {};
    if (value !== undefined) {
      queryParams =
        {
          state: value
        }
    }
    const foundAnswers = loadStudentTaskAnswersByQueryAndPagination(queryParams, {
      page: currentPage,
      limit: 6
    });
    setMobileState(oldState => foundAnswers.length > 0 ? listStates.students : oldState);
  }, [loadStudentTaskAnswersByQueryAndPagination, currentPage]);

  useEffect(() => {
    loadStudentTaskAnswersByQueryAndPagination({}, {
      page: currentPage,
      limit: 6
    })
  }, [currentPage, mobileState]);

  const filterItem = (
    <Menu>
      <Menu.Item onClick={() => onFilter(StudentTasksAnswersState.FINISHED)}>
        {t("pages.answers.table.is_checked.checked.tooltip")}
      </Menu.Item>
      <Menu.Item onClick={() => onFilter(StudentTasksAnswersState.STARTED)}>
        {t("pages.answers.table.is_checked.unchecked.tooltip")}
      </Menu.Item>
      <Menu.Item onClick={() => onFilter(undefined)}>
        {t("actions.cancel")}
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="mobile-answers-page">
      <Row className="mobile-answers-page__navs"
           align="middle"
           gutter={14}>
        <Col onClick={async () => {
          setMobileState(listStates.main);
          await router.push(STUDENT_TASKS_ANSWERS_PATH(user?.role === UserRole.STUDENT
                                                       ? STUDENT()
                                                       : TEACHER()));
        }}>
          <span {...mobileState !== listStates.main && ({className: "active"})}>
            {getLabelByItem(listStates?.main)}
          </span>
        </Col>
        { mobileState !== listStates.main &&
        <>
          <Col>
            <svg width="28" height="8" viewBox="0 0 28 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.3913 4.35355C27.5866 4.15829 27.5866 3.84171 27.3913 3.64645L24.2093 0.464466C24.0141 0.269204 23.6975 0.269204 23.5022 0.464466C23.307 0.659728 23.307 0.976311 23.5022 1.17157L26.3306 4L23.5022 6.82843C23.307 7.02369 23.307 7.34027 23.5022 7.53553C23.6975 7.7308 24.0141 7.7308 24.2093 7.53553L27.3913 4.35355ZM0.960938 4.5H27.0377V3.5L0.960938 3.5V4.5Z" fill="black"/>
            </svg>
          </Col>
          <Col>
              <span>
                {getLabelByItem(mobileState)}
              </span>
          </Col>
        </>
        }
      </Row>
      <Row justify="space-between"
           align="middle"
           className="mobile-answers-page__header">
        <Col flex="2">
          <HebDropdown
            overlay={filterItem}
            placement="bottomLeft"
            arrow={true}
            trigger={["click"]}>
            <Button icon={<FilterOutlined/>} type="text"/>
          </HebDropdown>
        </Col>
        <Col flex="8">
          <HebInput.Search enterButton
                           dir="rtl"
                           allowClear
                           onSearch={onSearch}
                           size="over-small"
                           cssType="default"/>
        </Col>
      </Row>
      <Switch parameter={mobileState}>
        <Case value={listStates.main}>
          <MainList setMobileState={setMobileState}
                    user={user} />
        </Case>
        <Case value={listStates.lessons}>
          <LessonList answerList={studentTasksAnswersPage.docs}
                      redirectToTaskAnswerPageByIdTaskAnswerAndUserRole={redirectToTaskAnswerPageByIdTaskAnswerAndUserRole}
                      selectedDate={selectedDate}/>
        </Case>
        <Case value={listStates.students}>
          <StudentList answerList={studentTasksAnswersPage.docs}
                       role={user?.role}/>
        </Case>
        <Case value={listStates.groups}>
          <GroupList answerList={studentTasksAnswersPage.docs} />
        </Case>
        <Case value={listStates.date}>
          <LessonStartDate answerList={studentTasksAnswersPage.docs}
                           setMobileState={setMobileState}
                           setSelectedDate={setSelectedDate} />
        </Case>
      </Switch>
      <Row className="mobile-answers-page__footer"
           align="middle"
           justify="center">
        <Col>
          <Pagination current={currentPage}
                      pageSize={6}
                      total={studentTasksAnswersPage.totalDocs || 0}
                      onChange={(page: number) => {
                        loadStudentTaskAnswersByQueryAndPagination({

                        }, {
                          page: page,
                          limit: 6
                        });
                        setCurrentPage(page);
                      }} />
        </Col>
      </Row>
    </div>
  )
}