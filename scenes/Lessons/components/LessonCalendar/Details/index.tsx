import React from "react";
import { HebDrawer } from "../../../../../components/HebElements";
import { Col, Row } from "antd";
import { Header } from "./Header";
import { LessonsList } from "./LessonsList";
import { TemplateList } from "./TemplateList";

export const DayDetails = ({lessons, currentLessonType, day, month, year, onClose, visible}) => {
  return (
    <HebDrawer
      visible={visible}
      onClose={onClose}
    >
      <Header
        day={day}
        year={year}
        month={month}
        currentLessonType={currentLessonType}
      />
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <LessonsList lessons={lessons} />
        </Col>
        <Col xs={24}>
          <TemplateList day={day}
                        year={year}
                        month={month}
                        lessonType={currentLessonType} />
        </Col>
      </Row>
    </HebDrawer>
  );
}