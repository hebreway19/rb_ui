import { Col, Row } from "antd";
import React from "react";
import { LessonCalendar } from "../index";

export const Content = ({
  ...props
}) => {
  return (
    <Row style={{marginLeft: "auto", marginRight: 0, maxWidth: 1295}}>
      <Col xs={24}>
        <LessonCalendar />
      </Col>
    </Row>
  );
} 