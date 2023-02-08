import { Col, Row, Typography } from "antd";
import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faApple, faFacebookF, faGoogle, faVk } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { ApiEndpoint, Config } from "../../constants";

export const AuthWithSosial = () => {

  const {t} = useTranslation();

  const authorizeWithApple = useCallback(() => {
    window["AppleID"].auth.signIn();
  }, []);

  useEffect(() => {
    const params = {
      clientId: Config.APPLE_CLIENT_ID,
      redirectURI: ApiEndpoint.AUTH_WITH_APPLE_CALLBACK,
      scope: "name email"
    };
    window["AppleID"].auth.init(params);
  }, []);

  const titleLabel = t("pages.auth.social.divider");

  return (
    <>
      <div className={`social__container`}>
        <div className={`social__container__title`}>
          {titleLabel}
        </div>
        <Row
          justify="center"
          gutter={[38.09, 8]}
          className={`social__content-plate`}
        >
          <Col
            xs={6}
            className={`social__list-item`}
          >
            <Typography.Link href={ApiEndpoint.AUTH_WITH_FACEBOOK}>
              <span className="fa-layers fa-fw fa-4x">
                <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                <FontAwesomeIcon transform="shrink-7" color="#75ECF9" icon={faFacebookF as IconProp}/>
              </span>
            </Typography.Link>
          </Col>
          <Col xs={6}>
            <Typography.Link href={ApiEndpoint.AUTH_WITH_GOOGLE}>
              <span className="fa-layers fa-fw fa-4x">
                <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                <FontAwesomeIcon transform="shrink-7" color="#75ECF9" icon={faGoogle as IconProp}/>
              </span>
            </Typography.Link>
          </Col>
          <Col xs={6}>
            <Typography.Link href={ApiEndpoint.AUTH_WITH_VKONTAKTE}>
              <span className="fa-layers fa-fw fa-4x">
                <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                <FontAwesomeIcon transform="shrink-7" color="#75ECF9" icon={faVk as IconProp}/>
              </span>
            </Typography.Link>
          </Col>
          <Col xs={6} hidden>
            <div onClick={authorizeWithApple} style={{cursor: "pointer"}}>
              <span className="fa-layers fa-fw fa-4x">
                <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                <FontAwesomeIcon transform="shrink-6 up-1" color="#75ECF9" icon={faApple as IconProp}/>
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};