import React from "react";
import { Col, Row } from "antd";
import { LanguageSelector } from "../../LanguageSelector";
import { HebrewayLogoIcon } from "../../../shared/icons/HebrewayLogo";

import style from "./MobileHeader.module.scss";
import {Title} from "../Title";

export const MobileHeader = () => {
  return (
    <>
    <Row justify="space-between" className={style.container}>
      <Col>
        <HebrewayLogoIcon style={{fontSize: "1.875rem"}} />
      </Col>
      <Col>
        <LanguageSelector />
      </Col>
    </Row>
    <Row justify="center" align="middle" className={style.title}>
      <Col>
        <Title />
      </Col>
    </Row>
    </>
  );
}