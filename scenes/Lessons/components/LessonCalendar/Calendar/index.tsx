import React, { useCallback, useEffect, useState } from "react";
import { Col, message, Row } from "antd";
import { LessonType } from "../../../../../constants";
import { useLessonsService } from "../../../../../services";
import { EmptyCell } from "./EmptyCell";
import { DataCellsList } from "./DataCellsList";
import { getEmptyCellsLength, getMonthLength } from "../utils";
import { HebSelect, HebSwitch } from "../../../../../components/HebElements";
import moment from "moment";

import { useTranslation } from "next-i18next";

const daysLocale = {
  ru: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
  en: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
  fr: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
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


export const Calendar = () => {
  const lessonsService = useLessonsService();
  const {t, i18n} = useTranslation();

  const [lessonsPage, setLessonsPage] = useState({docs: []});
  const [currentLessonType, setCurrentLessonType] = useState(LessonType.LESSON);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [cellDataList, setCellDataList] = useState([]);

  const generateYearsList = (currentYear) => {
    let resultArray = [];
    for (let i = currentYear - 50; i < currentYear + 10; i++) {
      resultArray.push(i);
    }
    return resultArray;
  }

  const [yearList] = useState(generateYearsList(new Date().getFullYear()));

  const [emptyCellsLength, setEmptyCellsLength] = useState({start: [], finish: []});

  const groupByDay = useCallback((lessons) => {
    let dateListForCalendar = [];
    const monthLength = getMonthLength(currentYear, currentMonth);
    for (let i = 0; i < monthLength; i++) {
      dateListForCalendar[i] = lessons.filter(lesson => {
        const monthDay = new Date(`${currentYear}-${currentMonth + 1}-${i + 1}`);
        return moment(lesson.openFrom).format("YYYY-MM-DD") === moment(monthDay).format("YYYY-MM-DD");
      })
    }
    setCellDataList(dateListForCalendar);
  }, [currentYear, currentMonth]);
  const loadLessons = useCallback(async () => {
    try {
      const foundPage = await lessonsService.loadAllLessons({
        openFrom: {
          "$gte": new Date(currentYear + '-' + (currentMonth + 1) + '-1'),
          "$lt": new Date(currentYear + '-' + (currentMonth + 1) + '-' + getMonthLength(currentYear, currentMonth))
        },
        type: currentLessonType
      });
      groupByDay(foundPage?.docs);
      setLessonsPage(foundPage);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [currentMonth, currentYear, groupByDay, currentLessonType, lessonsService]);

  const selectMonth = useCallback((value) => setCurrentMonth(value), []);
  const selectYear = useCallback((value) => setCurrentYear(value), []);
  const selectLessonType = useCallback((isExam) => setCurrentLessonType(isExam ? LessonType.EXAM
                                                                                            : LessonType.LESSON),
    []);

  useEffect(() => {
    setEmptyCellsLength(getEmptyCellsLength(currentYear, currentMonth));
  }, [currentYear, currentMonth]);
  useEffect(() => {
    loadLessons();
  }, [currentYear, currentMonth, currentLessonType]);

  const getLessonTranslate = type => t(`entities.lesson.${type}`);

  return (
    <Row justify="center" style={{minHeight: "100vh"}} align="middle">
      <Col xs={22} lg={20} className="heb-calendar">
        <Row className="heb-calendar__header">
          <Col xs={24}>
            <Row gutter={25} className="heb-calendar__header__controls">
              <Col xs={5}>
                <HebSelect
                  type="primary"
                  className="calendar-select"
                  arrow={false}
                  onChange={selectMonth}
                  defaultValue={currentMonth}
                >
                  { monthLocale[i18n.language].map((translate, index) => (
                    <HebSelect.Option key={index} value={index}>{translate}</HebSelect.Option>
                  ))
                  }
                </HebSelect>
              </Col>
              <Col xs={4}>
                <HebSelect
                  type="primary"
                  className="calendar-select"
                  arrow={false}
                  onChange={selectYear}
                  defaultValue={currentYear}
                >
                  { yearList.map((value, key) => (
                    <HebSelect.Option key={key} value={value}>{value}</HebSelect.Option>
                  ))
                  }
                </HebSelect>
              </Col>
              <Col xs={5}>
                <HebSwitch
                  defaultValue={currentLessonType === LessonType.EXAM}
                  onChange={selectLessonType}
                  checkedChildren={getLessonTranslate(LessonType.EXAM)}
                  unCheckedChildren={getLessonTranslate(LessonType.LESSON)}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <Row className="heb-calendar__days-names">
              { daysLocale[i18n.language].map(dayName => (
                <Col key={dayName} className="heb-calendar__day-name">{dayName}</Col>
              ))
              }
            </Row>
          </Col>
        </Row>
        <Row className="heb-calendar__container">
          {emptyCellsLength.start.map(key => <EmptyCell key={key} />)}
          <DataCellsList
            cellsDataList={cellDataList}
            currentLessonType={currentLessonType}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
          {emptyCellsLength.finish.map(key => <EmptyCell key={key} />)}
        </Row>
        <Row className="heb-calendar__footer" />
      </Col>
    </Row>
  );
}