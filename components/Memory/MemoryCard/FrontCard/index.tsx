import React from "react";
import {Col, Row} from "antd";
import {HebrewayLogoIcon} from "../../../../shared/icons/HebrewayLogo";

export type FrontCardProps = {
  customFront?: React.ReactNode | React.ReactNode[];
}

export const FrontCard = ({ customFront }: FrontCardProps) => {
  const defaultComponent = <Row style={{height: "100%"}} align="middle">
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <HebrewayLogoIcon />
        </Col>
        <Col xs={24}>
          <h3>hebreway. <span>lessons</span></h3>
        </Col>
      </Row>
    </Col>
  </Row>
  return (
    <Row style={{height: "100%"}} align="middle">
      <Col xs={24} style={{height: "100%"}}>
        { customFront ? customFront : defaultComponent }
      </Col>
    </Row>
  )
}