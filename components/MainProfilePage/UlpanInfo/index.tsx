import React from "react";
import { Col, Row } from "antd";
import { Ulpan } from "../../../types";

type UlpanInfoProps = {
  ulpan: Ulpan;
};

export const UlpanInfo = ({ulpan}: UlpanInfoProps) => {
  return (
    <Row justify="center">
      <Col xs={23} sm={12} xxl={23}>
        <span>{ulpan?.ulpanName}</span>
      </Col>
      <Col xs={23} sm={12} xxl={23}>
        <span>Address {ulpan?.address}</span>
      </Col>
      <Col xs={23} sm={12} xxl={23}>
        <span>Contact phone {ulpan?.contactPhone}</span>
      </Col>
      <Col xs={23} sm={12} xxl={23}>
        <span>Contact e-mail {ulpan?.contactEmail}</span>
      </Col>
    </Row>
  )
}