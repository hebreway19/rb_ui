import React, {useCallback} from "react";
import { Col, Row } from "antd";
import { ThirdPartyAuthorizationService } from "../../../constants";
import { SocialIconFactory } from "./SocialIconFactory";
import {useAuth} from "../../../providers/AuthProvider";

export type LinkItemProps = {
  socialName: ThirdPartyAuthorizationService,
  isActive: boolean
}

export const LinkItem = ({ socialName }: LinkItemProps) => {
  const {  } = useAuth();

  const IconComponent = SocialIconFactory.build(socialName);

  return (
    <Row>
      <Col xs={20}>
        <IconComponent style={{ fontSize: "3rem" }} /> <span style={{textTransform: "capitalize"}}>{socialName.toString()}</span>
      </Col>
      <Col xs={4}>
      
      </Col>
    </Row>
  );
}