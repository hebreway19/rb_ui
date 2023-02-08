import React from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import moment from "moment";
import { HebButton } from "../HebElements/HebButton";

type ClosedExamPageProps = {
  error;
  update(): any;
}

export const ClosedExamPage = ({update, error}: ClosedExamPageProps) => {
  const {t} = useTranslation();

  const dateFormat: string = t("time_format") + " " + t("date_format");
  const title: string = t("messages.lesson.exam.title_with_name", { name: (error.payload?.title) ? error.payload.title.he_nikkudot || error.payload.title.he : "" });
  const subtitle: string = t("messages.lesson.exam.accessPeriod", { openFrom: moment(error.payload.openFrom).format(dateFormat), openTo: moment(error.payload.openTo).format(dateFormat) });
  const refreshButtonLabel: string = t("actions.refresh");

  return (
    <Row align="middle" style={{minHeight: "100vh", maxWidth: 974, margin: "0 auto"}}>
      <Col xs={24}>
        <Row>
          <Col xs={24}>
            <h3 style={{textAlign: "center", fontSize: "1.5rem", color: "#ffffff"}}>{title}</h3>
          </Col>
          <Col xs={24} style={{textAlign: "center", fontSize: "1rem"}}>
            <p>{subtitle}</p>
          </Col>
          <Col xs={24} style={{textAlign: "center"}}>
            <HebButton onClick={() => update()} buttonSize="over-small" viewType="primary" overText={false}>{refreshButtonLabel}</HebButton>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}