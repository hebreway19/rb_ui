import React from "react";
import { Col, Row, Divider } from "antd";
import { useTranslation } from "next-i18next";
import { HebrewayLogoIcon } from "../../../shared/icons/HebrewayLogo";

import style from "./Header.module.scss";

export const Header = () => {
  const {t} = useTranslation();

  const aboutUsLabel: string = t("pages.home.header.about_us");

  return (
    <Row justify="space-between" align="middle" wrap={false} className={style.header}>
      <Col>
        <HebrewayLogoIcon/>
      </Col>
      <Col xs={21}>
        <Row justify="center">
          <Col>
            <Divider className={style.header__divider}>
              {aboutUsLabel}
            </Divider>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}