import { Col, Row, } from "antd";
import React from "react";
import { Content } from "./Content"
import { useTranslation } from "next-i18next";
import { HebPageHeader } from "../../../../components/HebElements";

export const LessonTimeTablePage = ({...props}) => {
  const {t} = useTranslation();

  const pageTitleLabel = t("navs.lessons_timetable");

  return (
    <>
      <HebPageHeader title={pageTitleLabel}/>
      <Row justify="center">
        <Col span={22}>
          <div style={{maxWidth: 84.967 + 1295 + 24}}>
            <Content/>
          </div>
        </Col>
      </Row>
    </>
  )
}

 LessonTimeTablePage;