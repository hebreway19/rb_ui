import React, { useCallback } from "react";
import { Col, Row } from "antd";
import moment from "moment";
import { useTranslation } from "next-i18next";

export const Header = ({day, month, year, currentLessonType}) => {
  const {t} = useTranslation();
  const dateFormat = t("date_format");
  const lessonTypeLabel = t(`entities.lesson.${currentLessonType}s`);
  const createTitle = useCallback(() => `${lessonTypeLabel}: 
                                                 ${moment(`${year}-${month + 1}-${day}`).format(dateFormat)}`,
    [lessonTypeLabel, dateFormat]);
  return (
    <Row className="day-details__header">
      <Col xs={24}>
        <h3>
          {createTitle()}
        </h3>
      </Col>
    </Row>
  )
}