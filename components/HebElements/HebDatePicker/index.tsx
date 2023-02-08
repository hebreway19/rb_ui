import React, { useCallback, useState } from "react";
import { Col, DatePicker, Row, Select } from "antd";
import { useTranslation } from "next-i18next";
import { default as ruDatePikerLang } from "antd/lib/locale/ru_RU.js";
import { default as enDatePikerLang } from "antd/lib/locale/en_GB.js";
import { default as frDatePikerLang } from "antd/lib/locale/fr_FR.js";
import moment from "moment";

import { ArrowIcon } from "../../../shared/icons";
import { useLanguage } from "../../../providers";

const monthsOptions = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  10, 11, 12
];
const locales = {
  ru: ruDatePikerLang,
  en: enDatePikerLang,
  fr: frDatePikerLang
}

export const DropdownHeader = ({selectedYear, selectYear, selectedMonth, selectMonth}) => {
  let years: number[] = [];
  for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 100; i--) {
    years.push(i);
  }
  return (
    <div
      className={"heb-date-picker__dropdown heb-date-picker__dropdown__header"}
    >
      <Row justify={"space-between"}
           gutter={8}>
        <Col xs={12}>
          <Select
            style={{width: "100%"}}
            value={selectedYear}
            onChange={selectYear}
          >
            { years.map((year, index) => <Select.Option className={`year-${index}`} key={year} value={year} onClick={() => selectYear(year)}>{year}</Select.Option>) }
          </Select>
        </Col>
        <Col xs={12}>
          <Select
            style={{width: "100%"}}
            value={selectedMonth}
            onChange={selectMonth}
          >
            { monthsOptions.map((month, index) => <Select.Option key={month} className={`month-${index}`} value={index} onClick={() => selectMonth(index)}>{month}</Select.Option>) }
          </Select>
        </Col>
      </Row>
    </div>
  )
}


export const HebDatePicker = ({className = "", type = "default", ...props}) => {
  
  const {t} = useTranslation();
  const [selectedDate, setSelectedDate] = useState(props.value ? moment(props.value) : null);
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth());
  const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
  
  const {language} = useLanguage();
  const locale = locales[String(language)] || enDatePikerLang;
  
  const [isVisibleCalendar, setIsVisibleCalendar] = useState(false);
  
  const closeDropdown = useCallback(() => {
    setIsVisibleCalendar(false);
  }, []);
  const selectMonth = useCallback((value) => {
    setSelectedDate(moment().year(selectedYear).month(value).date(new Date().getDay()));
    setSelectedMonth(value);
  }, [selectedYear]);
  const selectYear = useCallback((value) => {
    setSelectedDate(moment().year(value).month(selectedMonth).date(new Date().getDay()));
    setSelectedYear(value);
  }, [selectedMonth]);
  const onChange = useCallback((value, stringValue) => {
    setSelectedDate(value);
    props.onChange && props.onChange(new Date(stringValue));
    closeDropdown();
  }, [props, closeDropdown]);
  
  const showCalendar = useCallback(() => {
    setIsVisibleCalendar(true);
  }, []);
  
  const DropdownContent = (content) => {
    return (
      <div onMouseLeave={closeDropdown}>
        {content}
      </div>
    )
  }
  
  return (
    <DatePicker
      className={ `heb-date-picker heb-date-picker__type__${type} ${className}` }
      dropdownClassName={`heb-date-picker__dropdown`}
      allowClear={false}
      locale={locale}
      open={isVisibleCalendar}
      panelRender={DropdownContent}
      onClick={showCalendar}
      suffixIcon={ <ArrowIcon style={{marginTop: 3}} /> }
      renderExtraFooter={() => <DropdownHeader selectMonth={selectMonth} selectYear={selectYear}
                                               selectedMonth={selectedMonth} selectedYear={selectedYear} />}
      showToday={false}
      format={t("date_format")}
      {...props}
      value={selectedDate}
      onChange={onChange}
    />
  );
}
