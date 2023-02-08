import React from "react";
import { Col, Row } from "antd";
import { Social } from "../Social";

import style from "./footer.module.scss";

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <Row justify="end">
        <Col className={style.footer__content}>
          <Social />
        </Col>
      </Row>
    </footer>
  );
};