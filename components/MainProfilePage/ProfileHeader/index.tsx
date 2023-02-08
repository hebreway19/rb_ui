import React from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { UserState } from "../../../constants";

type ProfileHeaderProps = {
  state: UserState;
};

export const ProfileHeader = ({state}: ProfileHeaderProps) => {
  const {t} = useTranslation();
  const stateLabel: string = t("status_alert.title");
  const accountInfoLabel: string = t("navs.account_info");
  return (
    <Row className="profile__header__container" wrap={false} align="middle" justify="space-between">
      <Col>
        <h3 className="title">
          {accountInfoLabel}
        </h3>
      </Col>
      <Col style={{marginRight: "1rem"}}>
        <span className="state">
          {stateLabel}: {state}
        </span>
      </Col>
    </Row>
  )
}