import React, {useCallback} from "react";
import { Col, Row } from "antd";
import { AuthorizationServiceInfo } from "../../../types";
import { ThirdPartyAuthorizationService } from "../../../constants";
import { LinkItem, LinkItemProps } from "./LinkItem";

type SocialLinksProps = {
  authorizationServiceInfo: AuthorizationServiceInfo[]
}


export const SocialLinks = ({ authorizationServiceInfo = [] }: SocialLinksProps) => {
  console.log(authorizationServiceInfo);
  const activatedSocials: ThirdPartyAuthorizationService[] = authorizationServiceInfo//.filter(item => item.profileId !== null || item.profilePublicUrl !== null)
                                                                                     .map(item => item.name);
  const getLinkItemPropsBySocialName = useCallback((socialName: ThirdPartyAuthorizationService): LinkItemProps => {
    return ({ socialName, isActive: activatedSocials.includes(socialName) });
  }, [activatedSocials]);
  return (
    <Row gutter={[0, 8]}>
      { activatedSocials.map((socialName, index) => (
        <Col xs={24} key={index} >
          <LinkItem {...getLinkItemPropsBySocialName(socialName)} />
        </Col>
      )) }
    </Row>
  )
}