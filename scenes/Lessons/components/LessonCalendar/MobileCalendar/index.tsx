import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Col, List, message, Row, Select, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ApiEndpoint, LessonType, StorageKey, TimeOfDay } from "../../../../../constants";
import { useTranslation } from "next-i18next";
import { DataCellsList } from "./DataCellsList";
import { getMonthLength } from "../utils";
import { HebSwitch } from "../../../../../components/HebElements/";
import { useLessonsService } from "../../../../../services";
import { DayDetails } from "../Details";

const daysLocale = {
  ru: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  fr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}
const monthLocale = {
  ru: [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  fr: [
    "Janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ]
}

export const MobileCalendar = () => {

  const lessonsService = useLessonsService();
  const {t, i18n} = useTranslation();

  const [lessonsPage, setLessonsPage] = useState({docs: []});
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [currentLessonType, setCurrentLessonType] = useState(LessonType.LESSON);
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState(TimeOfDay.MORNING);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [detailsIsVisible, setDetailsIsVisible] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  const generateYearsList = (currentYear) => {
    let resultArray = [];
    for (let i = currentYear - 50; i < currentYear + 10; i++) {
      resultArray.push(i);
    }
    return resultArray;
  }
  const [yearList] = useState(generateYearsList(new Date().getFullYear()));

  useEffect(() => {
    const monthLength = getMonthLength(currentYear, currentMonth);
    setCurrentDay(oldState => oldState > monthLength
      ? monthLength
      : oldState);
  }, [currentYear, currentMonth]);

  const selectMonth = useCallback((value) => setCurrentMonth(value), []);
  const selectYear = useCallback((value) => setCurrentYear(value), []);

  const goToDay = useCallback(() => {
    const currentDate = new Date();
    setCurrentDay(currentDate.getDate());
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  }, []);


  const getLessonTranslate = useCallback(type => t(`entities.lesson.${type}`), [t]);
  const lessonTypeLabel = t("enums.lessonType.label");
  const lessonTitleLabel = t(`entities.lesson.${currentLessonType}s`);
  const timeOfDayLabel = t("enums.TimeOfDay.short_label");
  const getTimeOfDayLabelByType = useCallback((type) => t(`enums.TimeOfDay.${type}.title`), [t]);
  const toDayButton = t("actions.to_day");

  const selectLessonType = useCallback((isExam) => setCurrentLessonType(!isExam ? LessonType.EXAM
    : LessonType.LESSON),
    []);

  const loadLessons = useCallback(async () => {
    const startDay = currentDay;
    const finishDay = currentDay + 1 > getMonthLength(currentYear, currentMonth)
      ? getMonthLength(currentYear, currentMonth)
      : currentDay + 1;
    try {
      const foundPage = await lessonsService.loadAllLessons({
        openFrom: {
          "$gte": new Date(currentYear + '-' + (currentMonth + 1) + '-' + startDay),
          "$lt": new Date(currentYear + '-' + (currentMonth + 1) + '-' + finishDay)
        },
        type: currentLessonType,
        timeOfDay: currentTimeOfDay
      });
      setLessonsPage(foundPage);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [currentMonth, currentYear, currentDay, currentLessonType, currentTimeOfDay, lessonsService]);

  useEffect(() => {
    loadLessons();
  }, [currentLessonType, currentTimeOfDay, currentYear, currentDay, currentMonth]);

  return (
    <>
      <Row className="mobile-calendar">
        <Col xs={24} style={{marginBottom: 21}}>
          <Row align="middle"
               justify="space-between"
               className="selected-day">
            <Col>
              <Row gutter={8} wrap={false}>
                <Col className="day-number">
                  {currentDay}
                </Col>
                <Col>
                  <Space style={{height: "100%"}}>
                    <Row gutter={[0, 6]}>
                      <Col xs={24} className="day-week">
                        {daysLocale[i18n.language]
                          [
                          new Date(currentYear + '-' + (currentMonth + 1) + '-' + currentDay)
                            .getDay()
                          ]}
                      </Col>
                      <Col xs={24} className="month-year">
                        {monthLocale[i18n.language][currentMonth]} {currentYear}
                      </Col>
                    </Row>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                style={{
                  background: "rgba(117, 236, 249, 0.1)",
                  borderRadius: 8,
                  border: "none",
                  fontFamily: "Roboto, sans-serif",
                  fontStyle: "normal",
                  fontWeight: "bold",
                  color: "#75ECF9",
                  fontSize: 16,
                  height: 40,
                  width: 83
                }}
                onClick={goToDay}
              >
                {toDayButton}
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={24} style={{marginBottom: 40}}>
          <Row justify="space-between" className="controls">
            <Col style={{width: 180}}>
              <Select className="month"
                      onChange={selectMonth}
                      defaultValue={currentMonth}>
                { monthLocale[i18n.language].map((translate, index) => (
                  <Select.Option value={index}>{translate}</Select.Option>
                ))
                }
              </Select>
            </Col>
            <Col style={{width: 110}}>
              <Select className="year"
                      onChange={selectYear}
                      defaultValue={currentYear}>
                { yearList.map((value) => (
                  <Select.Option value={value}>{value}</Select.Option>
                ))
                }
              </Select>
            </Col>
          </Row>
        </Col>
        <Col xs={24} style={{marginBottom: 55}}>
          <DataCellsList daysLocale={daysLocale}
                         currentDay={currentDay}
                         setCurrentDay={setCurrentDay}
                         currentYear={currentYear}
                         currentMonth={currentMonth} />

          <hr className="cells-hr"/>
        </Col>
        <Col xs={24} style={{marginBottom: 55}}>
          <Row className="lesson-type-selector"
               align="middle">
            <Col xs={8}>
              <span className="label">{lessonTypeLabel}</span>
            </Col>
            <Col xs={14}>
              <HebSwitch defaultValue={true}
                         onChange={selectLessonType}
                         checkedChildren={getLessonTranslate(LessonType.LESSON)}
                         unCheckedChildren={getLessonTranslate(LessonType.EXAM)} />
            </Col>
          </Row>
        </Col>
        <Col xs={24}>
          <Row gutter={[0, 24]}>
            <Col xs={24}>
              <Row align="middle">
                <Col xs={6} className="time-title">
                  {timeOfDayLabel}
                </Col>
                <Col xs={14} className="time-title">
                  {lessonTitleLabel}
                </Col>
                <Col xs={4} style={{textAlign: "right"}}>
                  <Button type="text">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.29019 14.29L6.00019 14.59V7C6.00019 6.73478 5.89483 6.48043 5.70729 6.29289C5.51976 6.10536 5.2654 6 5.00019 6C4.73497 6 4.48062 6.10536 4.29308 6.29289C4.10554 6.48043 4.00019 6.73478 4.00019 7V14.59L3.71019 14.29C3.52188 14.1017 3.26649 13.9959 3.00019 13.9959C2.73388 13.9959 2.47849 14.1017 2.29019 14.29C2.10188 14.4783 1.99609 14.7337 1.99609 15C1.99609 15.2663 2.10188 15.5217 2.29019 15.71L4.29019 17.71C4.38529 17.801 4.49743 17.8724 4.62019 17.92C4.73989 17.9729 4.86931 18.0002 5.00019 18.0002C5.13106 18.0002 5.26049 17.9729 5.38019 17.92C5.50294 17.8724 5.61508 17.801 5.71019 17.71L7.71019 15.71C7.80342 15.6168 7.87738 15.5061 7.92785 15.3842C7.97831 15.2624 8.00428 15.1319 8.00428 15C8.00428 14.8681 7.97831 14.7376 7.92785 14.6158C7.87738 14.4939 7.80342 14.3832 7.71019 14.29C7.61695 14.1968 7.50626 14.1228 7.38443 14.0723C7.26261 14.0219 7.13204 13.9959 7.00019 13.9959C6.86833 13.9959 6.73776 14.0219 6.61594 14.0723C6.49411 14.1228 6.38342 14.1968 6.29019 14.29ZM11.0002 8H21.0002C21.2654 8 21.5198 7.89464 21.7073 7.70711C21.8948 7.51957 22.0002 7.26522 22.0002 7C22.0002 6.73478 21.8948 6.48043 21.7073 6.29289C21.5198 6.10536 21.2654 6 21.0002 6H11.0002C10.735 6 10.4806 6.10536 10.2931 6.29289C10.1055 6.48043 10.0002 6.73478 10.0002 7C10.0002 7.26522 10.1055 7.51957 10.2931 7.70711C10.4806 7.89464 10.735 8 11.0002 8ZM21.0002 11H11.0002C10.735 11 10.4806 11.1054 10.2931 11.2929C10.1055 11.4804 10.0002 11.7348 10.0002 12C10.0002 12.2652 10.1055 12.5196 10.2931 12.7071C10.4806 12.8946 10.735 13 11.0002 13H21.0002C21.2654 13 21.5198 12.8946 21.7073 12.7071C21.8948 12.5196 22.0002 12.2652 22.0002 12C22.0002 11.7348 21.8948 11.4804 21.7073 11.2929C21.5198 11.1054 21.2654 11 21.0002 11ZM21.0002 16H11.0002C10.735 16 10.4806 16.1054 10.2931 16.2929C10.1055 16.4804 10.0002 16.7348 10.0002 17C10.0002 17.2652 10.1055 17.5196 10.2931 17.7071C10.4806 17.8946 10.735 18 11.0002 18H21.0002C21.2654 18 21.5198 17.8946 21.7073 17.7071C21.8948 17.5196 22.0002 17.2652 22.0002 17C22.0002 16.7348 21.8948 16.4804 21.7073 16.2929C21.5198 16.1054 21.2654 16 21.0002 16Z" fill="#BCC1CD"/>
                    </svg>
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={24}>
              <Row className="lesson-list">
                <Col xs={24}>
                  <List dataSource={lessonsPage?.docs}
                        className="lesson-list-container"
                        renderItem={(item, index) => (
                          <List.Item onClick={() => setSelectedLessonIndex(index)}>
                            <Row style={{width: "100%", height: "100%"}} gutter={[10, 10]} >
                              <Col xs={6}
                                   onClick={() => setCurrentTimeOfDay(TimeOfDay.MORNING)}
                                   className={selectedLessonIndex === index
                                     ? "time-label active"
                                     : "time-label"}>
                                {getTimeOfDayLabelByType(item?.timeOfDay.toUpperCase())}
                              </Col>
                              <Col xs={18}>
                                <div className={selectedLessonIndex === index
                                  ? "card-content active"
                                  : "card-content"}>
                                  <Row style={{height: "100%"}}>
                                    <Col style={{width: "calc(100% - 24px)", height: "100%"}}>
                                      <Row>
                                        <Col xs={24} className="lesson-title">
                                          {item?.title?.he_nikkudot || item?.title?.he || ""}
                                        </Col>
                                        <Col xs={24} className="lesson-sub-title">
                                          {item?.title?.[localStorage[StorageKey.I18NEXT]] || ""}
                                        </Col>
                                        <Col xs={24} className="lesson-author">
                                          <Row align="middle" gutter={10}>
                                            <Col>
                                              <Avatar
                                                style={{
                                                  background: "linear-gradient(104.91deg, #303144 1.5%, #7A7C89 105.55%)",
                                                  color: "#ffffff"
                                                }}
                                                {...item?.author?.photoUrl
                                                  ? ({src: item.author.photoUrl.includes('http')
                                                      ? item.author.photoUrl
                                                      : `${ApiEndpoint.FILE}/download/${item.author.photoUrl}`
                                                  })
                                                  : ({icon: <UserOutlined />})} />
                                            </Col>
                                            <Col>{item?.author?.firstname} {item?.author?.surname}</Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col style={{width: "24px"}}
                                         onClick={() => {
                                           setDetailsIsVisible(true);
                                         }}
                                    >
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 14C11.6044 14 11.2178 14.1173 10.8889 14.3371C10.56 14.5568 10.3036 14.8692 10.1522 15.2346C10.0009 15.6001 9.96126 16.0022 10.0384 16.3902C10.1156 16.7781 10.3061 17.1345 10.5858 17.4142C10.8655 17.6939 11.2219 17.8844 11.6098 17.9616C11.9978 18.0387 12.3999 17.9991 12.7654 17.8478C13.1308 17.6964 13.4432 17.44 13.6629 17.1111C13.8827 16.7822 14 16.3956 14 16C14 15.4696 13.7893 14.9609 13.4142 14.5858C13.0391 14.2107 12.5304 14 12 14Z" fill="#88889D"/>
                                        <path d="M13.1111 9.66294C12.7822 9.8827 12.3956 10 12 10C11.4696 10 10.9609 9.78929 10.5858 9.41421C10.2107 9.03914 10 8.53043 10 8C10 7.60444 10.1173 7.21776 10.3371 6.88886C10.5568 6.55996 10.8692 6.30362 11.2346 6.15224C11.6001 6.00087 12.0022 5.96126 12.3902 6.03843C12.7781 6.1156 13.1345 6.30608 13.4142 6.58579C13.6939 6.86549 13.8844 7.22186 13.9616 7.60982C14.0387 7.99778 13.9991 8.39992 13.8478 8.76537C13.6964 9.13082 13.44 9.44318 13.1111 9.66294Z" fill="#88889D"/>
                                      </svg>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          </List.Item>
                        )} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <DayDetails
        day={currentDay}
        month={currentMonth}
        year={currentYear}
        currentLessonType={currentLessonType}
        visible={detailsIsVisible}
        onClose={() => setDetailsIsVisible(false)}
        lessons={lessonsPage?.docs}
      />
    </>
  )
}